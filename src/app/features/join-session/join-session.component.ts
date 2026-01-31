import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SessionService } from '../../core/services/session.service';
import { AuthService, AuthUser } from '../../core/services/auth.service';

@Component({
  selector: 'app-join-session',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center p-6">
      <!-- Back button -->
      <button 
        (click)="goBack()"
        class="absolute top-6 left-6 p-2 rounded-full bg-white/80 shadow-md hover:bg-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div class="w-full max-w-md">
        <!-- Step indicator -->
        <div class="flex justify-center mb-8">
          <div class="flex items-center gap-2">
            <div [class]="step >= 1 ? 'bg-baby-blue-400' : 'bg-gray-300'" class="w-3 h-3 rounded-full transition-colors"></div>
            <div [class]="step >= 2 ? 'bg-baby-blue-400' : 'bg-gray-300'" class="w-12 h-1 rounded-full transition-colors"></div>
            <div [class]="step >= 2 ? 'bg-baby-blue-400' : 'bg-gray-300'" class="w-3 h-3 rounded-full transition-colors"></div>
          </div>
        </div>

        <!-- Step 1: Enter Code -->
        <div *ngIf="step === 1" class="card text-center animate-card-enter">
          <h2 class="font-display text-2xl font-bold text-gray-800 mb-2">Join Session</h2>
          <p class="text-gray-600 mb-8">Enter the 6-character code from your partner</p>
          
          <div class="mb-6">
            <input 
              type="text"
              [(ngModel)]="sessionCode"
              placeholder="ABC123"
              maxlength="6"
              class="input-field text-center text-2xl tracking-[0.5em] uppercase font-mono"
              (keyup.enter)="validateCode()"
              (input)="onCodeInput($event)"
              autofocus>
          </div>
          
          <button 
            (click)="validateCode()"
            [disabled]="sessionCode.length !== 6 || isValidating"
            [class]="sessionCode.length === 6 && !isValidating ? 'bg-gradient-to-r from-baby-blue-400 to-baby-pink-400' : 'bg-gray-300 cursor-not-allowed'"
            class="w-full btn-primary text-lg">
            <span *ngIf="!isValidating">Find Session</span>
            <span *ngIf="isValidating" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </span>
          </button>
        </div>

        <!-- Step 2: Enter Name -->
        <div *ngIf="step === 2" class="card text-center animate-card-enter">
          <!-- Session info -->
          <div class="mb-6 p-4 bg-gradient-to-r from-baby-pink-50 to-baby-blue-50 rounded-xl">
            <div class="text-sm text-gray-500 mb-1">Session Found!</div>
            <div class="flex items-center justify-center gap-2">
              <span class="text-3xl">{{ sessionGender === 'boy' ? '👦' : '👧' }}</span>
              <span class="font-display font-semibold text-gray-700">{{ sessionGender === 'boy' ? 'Boy' : 'Girl' }} Names</span>
            </div>
          </div>

          <!-- Show logged in user info -->
          <div *ngIf="user" class="mb-6 p-3 bg-white/80 rounded-xl flex items-center gap-3">
            <div *ngIf="user.photoURL && !imageError" class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img [src]="user.photoURL" alt="Profile" class="w-full h-full object-cover" referrerpolicy="no-referrer" (error)="onImageError()">
            </div>
            <div *ngIf="!user.photoURL || imageError" class="w-10 h-10 rounded-full bg-gradient-to-br from-baby-pink-300 to-baby-blue-300 flex items-center justify-center text-white font-bold flex-shrink-0">
              {{ getInitials(user.displayName || user.email || 'U') }}
            </div>
            <div class="text-left">
              <div class="text-sm text-gray-500">Signed in as</div>
              <div class="font-medium text-gray-700">{{ user.displayName || user.email }}</div>
            </div>
          </div>

          <h2 class="font-display text-2xl font-bold text-gray-800 mb-2">
            {{ user ? 'Confirm your name' : "What's your name?" }}
          </h2>
          <p class="text-gray-600 mb-8">This will be shown to other players</p>
          
          <input 
            type="text"
            [(ngModel)]="playerName"
            placeholder="Enter your name"
            class="input-field mb-6 text-center"
            (keyup.enter)="joinSession()"
            autofocus>
          
          <button 
            (click)="joinSession()"
            [disabled]="!playerName.trim() || isLoading"
            [class]="playerName.trim() && !isLoading ? 'bg-gradient-to-r from-baby-blue-400 to-baby-pink-400' : 'bg-gray-300 cursor-not-allowed'"
            class="w-full btn-primary text-lg">
            <span *ngIf="!isLoading">Join Session</span>
            <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Joining...
            </span>
          </button>
          
          <button 
            (click)="previousStep()"
            class="mt-4 text-gray-500 hover:text-gray-700 transition-colors">
            ← Enter different code
          </button>
        </div>

        <!-- Error message -->
        <div *ngIf="error" class="mt-4 p-4 bg-red-100 text-red-700 rounded-xl text-center">
          {{ error }}
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class JoinSessionComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private sessionService = inject(SessionService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  step = 1;
  sessionCode = '';
  playerName = '';
  sessionGender: 'boy' | 'girl' | null = null;
  foundSessionId = '';
  isValidating = false;
  isLoading = false;
  error = '';
  user: AuthUser | null = null;
  imageError = false;

  ngOnInit(): void {
    this.authService.user$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.user = user;
      // Pre-fill name if user is logged in
      if (user?.displayName && !this.playerName) {
        this.playerName = user.displayName;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.sessionCode = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    this.error = '';
  }

  async validateCode(): Promise<void> {
    if (this.sessionCode.length !== 6) return;

    this.isValidating = true;
    this.error = '';

    try {
      // We'll do a quick join attempt to validate the code
      const tempResult = await this.sessionService.joinSession(this.sessionCode, '__temp__');
      
      if (tempResult) {
        this.sessionGender = tempResult.session.gender;
        this.foundSessionId = tempResult.session.id;
        this.step = 2;
        
        // Clear the temp session since we haven't actually joined yet
        this.sessionService.clearSession();
      } else {
        this.error = 'Session not found. Please check the code and try again.';
      }
    } catch (err) {
      console.error('Error validating code:', err);
      this.error = 'Failed to find session. Please try again.';
    } finally {
      this.isValidating = false;
    }
  }

  async joinSession(): Promise<void> {
    if (!this.playerName.trim()) return;

    this.isLoading = true;
    this.error = '';

    try {
      const result = await this.sessionService.joinSession(
        this.sessionCode,
        this.playerName.trim()
      );

      if (result) {
        this.router.navigate(['/game', result.session.id]);
      } else {
        this.error = 'Session not found. It may have been closed.';
      }
    } catch (err) {
      console.error('Error joining session:', err);
      this.error = 'Failed to join session. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  previousStep(): void {
    this.step = 1;
    this.sessionGender = null;
    this.foundSessionId = '';
    this.error = '';
  }

  goBack(): void {
    if (this.step === 2) {
      this.previousStep();
    } else {
      this.router.navigate(['/']);
    }
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
