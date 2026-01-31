import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

type AuthMode = 'login' | 'signup';

@Component({
  selector: 'app-auth',
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
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-baby-pink-300 to-baby-blue-300 shadow-lg mb-4">
            <span class="text-3xl">👶</span>
          </div>
          <h1 class="font-display text-2xl font-bold text-gray-800">
            {{ mode === 'login' ? 'Welcome Back!' : 'Create Account' }}
          </h1>
          <p class="text-gray-600 mt-1">
            {{ mode === 'login' ? 'Sign in to continue' : 'Join to save your matches' }}
          </p>
        </div>

        <!-- Auth Card -->
        <div class="card">
          <!-- Social Login Buttons -->
          <div class="space-y-3 mb-6">
            <button 
              (click)="signInWithGoogle()"
              [disabled]="isLoading"
              class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50">
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button 
              (click)="signInWithFacebook()"
              [disabled]="isLoading"
              class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1877F2] rounded-xl font-medium text-white hover:bg-[#166FE5] transition-all disabled:opacity-50">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>
          </div>

          <!-- Divider -->
          <div class="flex items-center gap-4 mb-6">
            <div class="flex-1 h-px bg-gray-200"></div>
            <span class="text-sm text-gray-400">or</span>
            <div class="flex-1 h-px bg-gray-200"></div>
          </div>

          <!-- Email Form -->
          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <div *ngIf="mode === 'signup'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input 
                type="text"
                [(ngModel)]="displayName"
                name="displayName"
                placeholder="Enter your name"
                class="input-field"
                required>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="you@example.com"
                class="input-field"
                required>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••"
                class="input-field"
                required
                minlength="6">
            </div>

            <button 
              type="submit"
              [disabled]="isLoading"
              class="w-full btn-primary bg-gradient-to-r from-baby-pink-400 to-baby-blue-400 text-lg">
              <span *ngIf="!isLoading">{{ mode === 'login' ? 'Sign In' : 'Create Account' }}</span>
              <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ mode === 'login' ? 'Signing in...' : 'Creating account...' }}
              </span>
            </button>
          </form>

          <!-- Error message -->
          <div *ngIf="error" class="mt-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm text-center">
            {{ error }}
          </div>

          <!-- Toggle mode -->
          <div class="mt-6 text-center text-sm text-gray-600">
            <span *ngIf="mode === 'login'">
              Don't have an account? 
              <button (click)="toggleMode()" class="text-baby-pink-500 hover:text-baby-pink-600 font-medium">Sign up</button>
            </span>
            <span *ngIf="mode === 'signup'">
              Already have an account? 
              <button (click)="toggleMode()" class="text-baby-pink-500 hover:text-baby-pink-600 font-medium">Sign in</button>
            </span>
          </div>
        </div>

        <!-- Continue as guest -->
        <div class="mt-6 text-center">
          <button 
            (click)="continueAsGuest()"
            class="text-gray-500 hover:text-gray-700 font-medium">
            Continue as Guest →
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AuthComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  mode: AuthMode = 'login';
  email = '';
  password = '';
  displayName = '';
  isLoading = false;
  error = '';

  toggleMode(): void {
    this.mode = this.mode === 'login' ? 'signup' : 'login';
    this.error = '';
  }

  async onSubmit(): Promise<void> {
    if (!this.email || !this.password) return;
    if (this.mode === 'signup' && !this.displayName) return;

    this.isLoading = true;
    this.error = '';

    try {
      if (this.mode === 'login') {
        await this.authService.signInWithEmail(this.email, this.password);
      } else {
        await this.authService.signUpWithEmail(this.email, this.password, this.displayName);
      }
      this.router.navigate(['/']);
    } catch (err: any) {
      console.error('Auth error:', err);
      this.error = this.getErrorMessage(err.code);
    } finally {
      this.isLoading = false;
    }
  }

  async signInWithGoogle(): Promise<void> {
    this.isLoading = true;
    this.error = '';

    try {
      await this.authService.signInWithGoogle();
      this.router.navigate(['/']);
    } catch (err: any) {
      console.error('Google auth error:', err);
      this.error = this.getErrorMessage(err.code);
    } finally {
      this.isLoading = false;
    }
  }

  async signInWithFacebook(): Promise<void> {
    this.isLoading = true;
    this.error = '';

    try {
      await this.authService.signInWithFacebook();
      this.router.navigate(['/']);
    } catch (err: any) {
      console.error('Facebook auth error:', err);
      this.error = this.getErrorMessage(err.code);
    } finally {
      this.isLoading = false;
    }
  }

  continueAsGuest(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Try signing in instead.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/popup-closed-by-user':
        return 'Sign in was cancelled.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with this email using a different sign-in method.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }
}

