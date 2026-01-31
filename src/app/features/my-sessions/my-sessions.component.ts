import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, AuthUser } from '../../core/services/auth.service';
import { UserSessionService } from '../../core/services/user-session.service';
import { SessionService } from '../../core/services/session.service';
import { UserSession } from '../../core/models/session.model';

@Component({
  selector: 'app-my-sessions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex flex-col bg-gradient-to-b from-baby-pink-50 via-white to-baby-blue-50">
      <!-- Header -->
      <header class="p-4 bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div class="max-w-lg mx-auto flex items-center justify-between">
          <button 
            (click)="goBack()"
            class="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h1 class="font-display text-xl font-bold text-gray-800">My Sessions</h1>
          
          <div class="w-10"></div>
        </div>
      </header>

      <!-- Main content -->
      <main class="flex-1 p-4">
        <div class="max-w-lg mx-auto">
          
          <!-- Not logged in -->
          <div *ngIf="!user" class="card text-center py-12">
            <div class="text-5xl mb-4">🔐</div>
            <h2 class="font-display text-xl font-bold text-gray-800 mb-2">Sign in to see your sessions</h2>
            <p class="text-gray-600 mb-6">Your sessions will be saved so you can resume anytime</p>
            <button 
              (click)="goToAuth()"
              class="btn-primary bg-gradient-to-r from-baby-pink-400 to-baby-blue-400">
              Sign In
            </button>
          </div>

          <!-- Loading -->
          <div *ngIf="user && isLoading" class="text-center py-12">
            <div class="inline-flex items-center gap-2 text-gray-500">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading sessions...
            </div>
          </div>

          <!-- No sessions -->
          <div *ngIf="user && !isLoading && sessions.length === 0" class="card text-center py-12">
            <div class="text-5xl mb-4">📝</div>
            <h2 class="font-display text-xl font-bold text-gray-800 mb-2">No sessions yet</h2>
            <p class="text-gray-600 mb-6">Create or join a session to get started!</p>
            <div class="flex gap-3 justify-center">
              <button 
                (click)="createSession()"
                class="btn-primary bg-gradient-to-r from-baby-pink-400 to-baby-pink-500">
                Create Session
              </button>
              <button 
                (click)="joinSession()"
                class="btn-secondary">
                Join Session
              </button>
            </div>
          </div>

          <!-- Sessions list -->
          <div *ngIf="user && !isLoading && sessions.length > 0" class="space-y-4">
            <div class="flex items-center justify-between mb-2">
              <h2 class="font-display text-lg font-semibold text-gray-700">Your Sessions</h2>
              <span class="text-sm text-gray-500">{{ sessions.length }} session{{ sessions.length === 1 ? '' : 's' }}</span>
            </div>

            <div 
              *ngFor="let session of sessions; let i = index"
              class="card hover:shadow-lg transition-shadow cursor-pointer animate-card-enter"
              [style.animation-delay.ms]="i * 50"
              (click)="resumeSession(session)">
              
              <div class="flex items-start gap-4">
                <!-- Icon -->
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center flex-shrink-0"
                     [class]="session.gender === 'boy' ? 'from-baby-blue-200 to-baby-blue-300' : 'from-baby-pink-200 to-baby-pink-300'">
                  <span class="text-2xl">{{ session.gender === 'boy' ? '👦' : '👧' }}</span>
                </div>
                
                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-display font-bold text-gray-800">{{ session.gender === 'boy' ? 'Boy' : 'Girl' }} Names</span>
                    <span *ngIf="session.isCreator" class="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Creator</span>
                  </div>
                  
                  <div class="text-sm text-gray-500 mb-2">
                    Code: <span class="font-mono font-medium">{{ session.sessionCode }}</span>
                  </div>
                  
                  <!-- Progress -->
                  <div class="flex items-center gap-4 text-xs text-gray-500">
                    <div class="flex items-center gap-1">
                      <span>📊</span>
                      <span>{{ session.currentIndex }}/{{ session.totalNames }} viewed</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <span>💕</span>
                      <span>{{ session.matchCount }} matches</span>
                    </div>
                  </div>
                  
                  <!-- Progress bar -->
                  <div class="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      class="h-full rounded-full transition-all"
                      [class]="session.gender === 'boy' ? 'bg-baby-blue-400' : 'bg-baby-pink-400'"
                      [style.width.%]="(session.currentIndex / session.totalNames) * 100">
                    </div>
                  </div>
                </div>
                
                <!-- Arrow -->
                <div class="flex-shrink-0 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              <!-- Last accessed -->
              <div class="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
                <span>Last played {{ getTimeAgo(session.lastAccessedAt) }}</span>
                <button 
                  (click)="deleteSession($event, session)"
                  class="text-red-400 hover:text-red-600 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div *ngIf="user && sessions.length > 0" class="mt-8 space-y-3">
            <button 
              (click)="createSession()"
              class="w-full btn-primary bg-gradient-to-r from-baby-pink-400 to-baby-blue-400">
              Create New Session
            </button>
            <button 
              (click)="joinSession()"
              class="w-full btn-secondary">
              Join Existing Session
            </button>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class MySessionsComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  private userSessionService = inject(UserSessionService);
  private sessionService = inject(SessionService);
  private destroy$ = new Subject<void>();

  user: AuthUser | null = null;
  sessions: UserSession[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.authService.user$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.user = user;
      
      if (user) {
        this.userSessionService.listenToUserSessions(user.uid);
        
        this.userSessionService.getUserSessions$().pipe(
          takeUntil(this.destroy$)
        ).subscribe(sessions => {
          this.sessions = sessions;
          this.isLoading = false;
        });
      } else {
        this.sessions = [];
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.userSessionService.stopListening();
  }

  async resumeSession(session: UserSession): Promise<void> {
    const result = await this.sessionService.resumeSession(session.sessionId, session.playerId);
    
    if (result) {
      this.router.navigate(['/game', session.sessionId]);
    } else {
      // Session no longer exists, remove from user's list
      await this.userSessionService.deleteUserSession(session.id);
    }
  }

  async deleteSession(event: Event, session: UserSession): Promise<void> {
    event.stopPropagation();
    
    if (confirm('Remove this session from your list? You can rejoin using the code.')) {
      await this.userSessionService.deleteUserSession(session.id);
    }
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

  goBack(): void {
    this.router.navigate(['/']);
  }

  getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  }
}

