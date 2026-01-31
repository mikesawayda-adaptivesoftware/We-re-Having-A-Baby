import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  User,
  onAuthStateChanged,
  updateProfile
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  
  private currentUser$ = new BehaviorSubject<AuthUser | null>(null);
  private isLoading$ = new BehaviorSubject<boolean>(true);

  constructor() {
    // Listen to auth state changes
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUser$.next(this.mapUser(user));
      } else {
        this.currentUser$.next(null);
      }
      this.isLoading$.next(false);
    });
  }

  get user$(): Observable<AuthUser | null> {
    return this.currentUser$.asObservable();
  }

  get loading$(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  get currentUser(): AuthUser | null {
    return this.currentUser$.getValue();
  }

  get isLoggedIn(): boolean {
    return this.currentUser$.getValue() !== null;
  }

  private mapUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      isAnonymous: user.isAnonymous
    };
  }

  async signUpWithEmail(email: string, password: string, displayName: string): Promise<AuthUser> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    
    // Update display name
    await updateProfile(credential.user, { displayName });
    
    const authUser = this.mapUser(credential.user);
    authUser.displayName = displayName; // Include the name we just set
    this.currentUser$.next(authUser);
    
    return authUser;
  }

  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    const authUser = this.mapUser(credential.user);
    this.currentUser$.next(authUser);
    return authUser;
  }

  async signInWithGoogle(): Promise<AuthUser> {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);
    const authUser = this.mapUser(credential.user);
    this.currentUser$.next(authUser);
    return authUser;
  }

  async signInWithFacebook(): Promise<AuthUser> {
    const provider = new FacebookAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);
    const authUser = this.mapUser(credential.user);
    this.currentUser$.next(authUser);
    return authUser;
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
    this.currentUser$.next(null);
  }
}

