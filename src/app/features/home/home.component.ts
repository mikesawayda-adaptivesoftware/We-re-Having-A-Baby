import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, AuthUser } from '../../core/services/auth.service';
import { UserSessionService } from '../../core/services/user-session.service';
import { SessionService } from '../../core/services/session.service';
import { UserSession } from '../../core/models/session.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center p-6">
      <!-- User status bar -->
      <div class="absolute top-4 right-4">
        <div *ngIf="user" class="flex items-center gap-3 bg-white/80 rounded-full px-4 py-2 shadow-md">
          <div *ngIf="user.photoURL && !imageError" class="w-8 h-8 rounded-full overflow-hidden">
            <img [src]="user.photoURL" alt="Profile" class="w-full h-full object-cover" referrerpolicy="no-referrer" (error)="onImageError()">
          </div>
          <div *ngIf="!user.photoURL || imageError" class="w-8 h-8 rounded-full bg-gradient-to-br from-baby-pink-300 to-baby-blue-300 flex items-center justify-center text-white font-bold text-sm">
            {{ getInitials(user.displayName || user.email || 'U') }}
          </div>
          <span class="text-sm font-medium text-gray-700 hidden sm:block">{{ user.displayName || user.email }}</span>
          <button 
            (click)="signOut()"
            class="text-xs text-gray-500 hover:text-gray-700">
            Sign out
          </button>
        </div>
        
        <button 
          *ngIf="!user && !isLoading"
          (click)="goToAuth()"
          class="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 shadow-md text-sm font-medium text-gray-700 hover:bg-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Sign In
        </button>
      </div>

      <!-- Floating decorative elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-10 w-16 h-16 bg-baby-pink-200 rounded-full opacity-40 animate-float"></div>
        <div class="absolute top-40 right-16 w-12 h-12 bg-baby-blue-200 rounded-full opacity-40 animate-float" style="animation-delay: 0.5s"></div>
        <div class="absolute bottom-32 left-20 w-20 h-20 bg-baby-pink-100 rounded-full opacity-30 animate-float" style="animation-delay: 1s"></div>
        <div class="absolute bottom-40 right-10 w-14 h-14 bg-baby-blue-100 rounded-full opacity-30 animate-float" style="animation-delay: 1.5s"></div>
      </div>
      
      <!-- Main content -->
      <div class="relative z-10 text-center max-w-md">
        <!-- Logo/Icon -->
        <div class="mb-8">
          <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-baby-pink-300 to-baby-blue-300 shadow-lg mb-4">
            <span class="text-5xl">👶</span>
          </div>
        </div>
        
        <!-- Title -->
        <h1 class="font-display text-4xl md:text-5xl font-bold text-gray-800 mb-3">
          Baby Name
          <span class="block bg-gradient-to-r from-baby-pink-500 to-baby-blue-500 bg-clip-text text-transparent">
            Matcher
          </span>
        </h1>
        
        <!-- Subtitle -->
        <p class="text-gray-600 text-lg mb-8 font-body">
          Find the perfect name together
        </p>

        <!-- Recent session card (for logged-in users) -->
        <div *ngIf="user && recentSession" class="mb-8">
          <div 
            (click)="resumeSession(recentSession)"
            class="card bg-gradient-to-r from-baby-pink-50 to-baby-blue-50 cursor-pointer hover:shadow-lg transition-shadow">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center">
                <span class="text-2xl">{{ recentSession.gender === 'boy' ? '👦' : '👧' }}</span>
              </div>
              <div class="flex-1 text-left">
                <div class="text-xs text-gray-500 mb-0.5">Continue where you left off</div>
                <div class="font-display font-semibold text-gray-800">{{ recentSession.gender === 'boy' ? 'Boy' : 'Girl' }} Names</div>
                <div class="text-xs text-gray-500">{{ recentSession.currentIndex }}/{{ recentSession.totalNames }} • {{ recentSession.matchCount }} matches</div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Action buttons -->
        <div class="space-y-4">
          <button 
            (click)="createSession()"
            class="w-full btn-primary bg-gradient-to-r from-baby-pink-400 to-baby-pink-500 text-lg py-4">
            <span class="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Create New Session
            </span>
          </button>
          
          <button 
            (click)="joinSession()"
            class="w-full btn-secondary text-lg py-4">
            <span class="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Join Session
            </span>
          </button>

          <!-- My Sessions link (for logged-in users) -->
          <button 
            *ngIf="user"
            (click)="goToMySessions()"
            class="w-full text-baby-pink-500 hover:text-baby-pink-600 font-medium py-2 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            View All My Sessions
          </button>
        </div>
        
        <!-- How it works -->
        <div class="mt-12 text-left">
          <h3 class="font-display text-lg font-semibold text-gray-700 mb-4 text-center">How it works</h3>
          <div class="space-y-3">
            <div class="flex items-center gap-3 bg-white/60 rounded-xl p-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-baby-pink-200 flex items-center justify-center text-baby-pink-600 font-bold">1</div>
              <p class="text-gray-600 text-sm">Create a session and choose boy or girl names</p>
            </div>
            <div class="flex items-center gap-3 bg-white/60 rounded-xl p-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-baby-blue-200 flex items-center justify-center text-baby-blue-600 font-bold">2</div>
              <p class="text-gray-600 text-sm">Share the code with your partner</p>
            </div>
            <div class="flex items-center gap-3 bg-white/60 rounded-xl p-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-baby-pink-200 flex items-center justify-center text-baby-pink-600 font-bold">3</div>
              <p class="text-gray-600 text-sm">Swipe right on names you love, left on names you don't</p>
            </div>
            <div class="flex items-center gap-3 bg-white/60 rounded-xl p-3">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-baby-blue-200 flex items-center justify-center text-baby-blue-600 font-bold">4</div>
              <p class="text-gray-600 text-sm">Find names you both love!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  private userSessionService = inject(UserSessionService);
  private sessionService = inject(SessionService);
  private destroy$ = new Subject<void>();
  
  user: AuthUser | null = null;
  isLoading = true;
  recentSession: UserSession | null = null;
  imageError = false;

  ngOnInit(): void {
    this.authService.loading$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(loading => {
      this.isLoading = loading;
    });

    this.authService.user$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.user = user;
      this.imageError = false; // Reset image error on user change
      
      if (user) {
        // Load user's sessions
        this.userSessionService.listenToUserSessions(user.uid);
        
        this.userSessionService.getUserSessions$().pipe(
          takeUntil(this.destroy$)
        ).subscribe(sessions => {
          // Get most recent session
          this.recentSession = sessions.length > 0 ? sessions[0] : null;
        });
      } else {
        this.recentSession = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.userSessionService.stopListening();
  }

  createSession(): void {
    this.router.navigate(['/create']);
  }

  joinSession(): void {
    this.router.navigate(['/join']);
  }

  goToAuth(): void {
    this.router.navigate(['/auth']);
  }

  goToMySessions(): void {
    this.router.navigate(['/my-sessions']);
  }

  async resumeSession(session: UserSession): Promise<void> {
    const result = await this.sessionService.resumeSession(session.sessionId, session.playerId);
    
    if (result) {
      this.router.navigate(['/game', session.sessionId]);
    }
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  onImageError(): void {
    this.imageError = true;
  }
}
