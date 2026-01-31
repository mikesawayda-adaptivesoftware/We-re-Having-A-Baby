import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc,
  addDoc, 
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query, 
  where, 
  orderBy,
  Timestamp,
  onSnapshot
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserSession, Gender } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {
  private firestore = inject(Firestore);
  
  private userSessions$ = new BehaviorSubject<UserSession[]>([]);
  private unsubscribe: (() => void) | null = null;

  getUserSessions$(): Observable<UserSession[]> {
    return this.userSessions$.asObservable();
  }

  listenToUserSessions(userId: string): void {
    // Unsubscribe from previous listener
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    const sessionsRef = collection(this.firestore, 'userSessions');
    const q = query(
      sessionsRef, 
      where('userId', '==', userId),
      orderBy('lastAccessedAt', 'desc')
    );

    this.unsubscribe = onSnapshot(q, (snapshot) => {
      const sessions: UserSession[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data['userId'],
          sessionId: data['sessionId'],
          sessionCode: data['sessionCode'],
          gender: data['gender'] as Gender,
          playerName: data['playerName'],
          playerId: data['playerId'],
          isCreator: data['isCreator'],
          joinedAt: data['joinedAt']?.toDate() || new Date(),
          lastAccessedAt: data['lastAccessedAt']?.toDate() || new Date(),
          currentIndex: data['currentIndex'] || 0,
          totalNames: data['totalNames'] || 0,
          matchCount: data['matchCount'] || 0
        };
      });
      this.userSessions$.next(sessions);
    });
  }

  async saveUserSession(
    userId: string,
    sessionId: string,
    sessionCode: string,
    gender: Gender,
    playerName: string,
    playerId: string,
    isCreator: boolean,
    totalNames: number
  ): Promise<string> {
    // Check if user already has this session saved
    const existing = await this.findUserSession(userId, sessionId);
    
    if (existing) {
      // Update last accessed
      await this.updateLastAccessed(existing.id);
      return existing.id;
    }

    const sessionsRef = collection(this.firestore, 'userSessions');
    const now = Timestamp.now();

    const docRef = await addDoc(sessionsRef, {
      userId,
      sessionId,
      sessionCode,
      gender,
      playerName,
      playerId,
      isCreator,
      joinedAt: now,
      lastAccessedAt: now,
      currentIndex: 0,
      totalNames,
      matchCount: 0
    });

    return docRef.id;
  }

  async findUserSession(userId: string, sessionId: string): Promise<UserSession | null> {
    const sessionsRef = collection(this.firestore, 'userSessions');
    const q = query(
      sessionsRef,
      where('userId', '==', userId),
      where('sessionId', '==', sessionId)
    );

    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      userId: data['userId'],
      sessionId: data['sessionId'],
      sessionCode: data['sessionCode'],
      gender: data['gender'] as Gender,
      playerName: data['playerName'],
      playerId: data['playerId'],
      isCreator: data['isCreator'],
      joinedAt: data['joinedAt']?.toDate() || new Date(),
      lastAccessedAt: data['lastAccessedAt']?.toDate() || new Date(),
      currentIndex: data['currentIndex'] || 0,
      totalNames: data['totalNames'] || 0,
      matchCount: data['matchCount'] || 0
    };
  }

  async updateLastAccessed(userSessionId: string): Promise<void> {
    const docRef = doc(this.firestore, 'userSessions', userSessionId);
    await updateDoc(docRef, {
      lastAccessedAt: Timestamp.now()
    });
  }

  async updateProgress(userSessionId: string, currentIndex: number, matchCount: number): Promise<void> {
    const docRef = doc(this.firestore, 'userSessions', userSessionId);
    await updateDoc(docRef, {
      currentIndex,
      matchCount,
      lastAccessedAt: Timestamp.now()
    });
  }

  async deleteUserSession(userSessionId: string): Promise<void> {
    const docRef = doc(this.firestore, 'userSessions', userSessionId);
    await deleteDoc(docRef);
  }

  stopListening(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.userSessions$.next([]);
  }
}

