import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SessionService } from '../../core/services/session.service';
import { NameService } from '../../core/services/name.service';
import { AuthService, AuthUser } from '../../core/services/auth.service';
import { Gender } from '../../core/models/session.model';

@Component({
  selector: 'app-create-session',
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
            <div [class]="step >= 1 ? 'bg-baby-pink-400' : 'bg-gray-300'" class="w-3 h-3 rounded-full transition-colors"></div>
            <div [class]="step >= 2 ? 'bg-baby-pink-400' : 'bg-gray-300'" class="w-12 h-1 rounded-full transition-colors"></div>
            <div [class]="step >= 2 ? 'bg-baby-pink-400' : 'bg-gray-300'" class="w-3 h-3 rounded-full transition-colors"></div>
          </div>
        </div>

        <!-- Step 1: Gender Selection -->
        <div *ngIf="step === 1" class="card text-center animate-card-enter">
          <h2 class="font-display text-2xl font-bold text-gray-800 mb-2">Choose Names</h2>
          <p class="text-gray-600 mb-8">What kind of names are you looking for?</p>
          
          <div class="grid grid-cols-2 gap-4 mb-8">
            <button 
              (click)="selectGender('boy')"
              [class]="selectedGender === 'boy' ? 'ring-4 ring-baby-blue-300 bg-baby-blue-50' : 'bg-white hover:bg-baby-blue-50'"
              class="p-6 rounded-2xl border-2 border-baby-blue-200 transition-all transform hover:scale-105">
              <div class="text-5xl mb-2">👦</div>
              <div class="font-display font-semibold text-gray-700">Boy Names</div>
              <div class="text-sm text-gray-500 mt-1">{{ boyNamesCount }} names</div>
            </button>
            
            <button 
              (click)="selectGender('girl')"
              [class]="selectedGender === 'girl' ? 'ring-4 ring-baby-pink-300 bg-baby-pink-50' : 'bg-white hover:bg-baby-pink-50'"
              class="p-6 rounded-2xl border-2 border-baby-pink-200 transition-all transform hover:scale-105">
              <div class="text-5xl mb-2">👧</div>
              <div class="font-display font-semibold text-gray-700">Girl Names</div>
              <div class="text-sm text-gray-500 mt-1">{{ girlNamesCount }} names</div>
            </button>
          </div>
          
          <button 
            (click)="nextStep()"
            [disabled]="!selectedGender"
            [class]="selectedGender ? 'bg-gradient-to-r from-baby-pink-400 to-baby-blue-400' : 'bg-gray-300 cursor-not-allowed'"
            class="w-full btn-primary text-lg">
            Continue
          </button>
        </div>

        <!-- Step 2: Enter Name -->
        <div *ngIf="step === 2" class="card text-center animate-card-enter">
          <!-- Show logged in user info -->
          <div *ngIf="user" class="mb-6 p-3 bg-gradient-to-r from-baby-pink-50 to-baby-blue-50 rounded-xl flex items-center gap-3">
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
            (keyup.enter)="createSession()"
            autofocus>
          
          <button 
            (click)="createSession()"
            [disabled]="!playerName.trim() || isLoading"
            [class]="playerName.trim() && !isLoading ? 'bg-gradient-to-r from-baby-pink-400 to-baby-blue-400' : 'bg-gray-300 cursor-not-allowed'"
            class="w-full btn-primary text-lg">
            <span *ngIf="!isLoading">Create Session</span>
            <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          </button>
          
          <button 
            (click)="previousStep()"
            class="mt-4 text-gray-500 hover:text-gray-700 transition-colors">
            ← Back to gender selection
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
export class CreateSessionComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private sessionService = inject(SessionService);
  private nameService = inject(NameService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  step = 1;
  selectedGender: Gender | null = null;
  playerName = '';
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

  get boyNamesCount(): number {
    return this.nameService.getTotalNames('boy');
  }

  get girlNamesCount(): number {
    return this.nameService.getTotalNames('girl');
  }

  selectGender(gender: Gender): void {
    this.selectedGender = gender;
  }

  nextStep(): void {
    if (this.selectedGender) {
      this.step = 2;
    }
  }

  previousStep(): void {
    this.step = 1;
  }

  async createSession(): Promise<void> {
    if (!this.selectedGender || !this.playerName.trim()) return;

    this.isLoading = true;
    this.error = '';

    try {
      const totalNames = this.nameService.getTotalNames(this.selectedGender);
      const result = await this.sessionService.createSession(
        this.selectedGender,
        this.playerName.trim(),
        totalNames
      );

      this.router.navigate(['/game', result.session.id]);
    } catch (err) {
      console.error('Error creating session:', err);
      this.error = 'Failed to create session. Please try again.';
    } finally {
      this.isLoading = false;
    }
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
