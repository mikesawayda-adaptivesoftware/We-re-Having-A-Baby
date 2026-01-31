import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs,
  updateDoc, 
  query, 
  where, 
  onSnapshot,
  Timestamp,
  collectionData
} from '@angular/fire/firestore';
import { Observable, from, map, BehaviorSubject } from 'rxjs';
import { Session, Player, generateSessionCode, Gender, SessionStatus } from '../models/session.model';
import { AuthService } from './auth.service';
import { UserSessionService } from './user-session.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private userSessionService = inject(UserSessionService);
  
  private currentSession$ = new BehaviorSubject<Session | null>(null);
  private currentPlayer$ = new BehaviorSubject<Player | null>(null);
  private currentUserSessionId: string | null = null;
  
  get session$(): Observable<Session | null> {
    return this.currentSession$.asObservable();
  }
  
  get player$(): Observable<Player | null> {
    return this.currentPlayer$.asObservable();
  }
  
  get currentSession(): Session | null {
    return this.currentSession$.getValue();
  }
  
  get currentPlayer(): Player | null {
    return this.currentPlayer$.getValue();
  }

  async createSession(gender: Gender, playerName: string, totalNames: number): Promise<{ session: Session; player: Player }> {
    const sessionsRef = collection(this.firestore, 'sessions');
    const user = this.authService.currentUser;
    
    // Generate unique session code
    let code = generateSessionCode();
    let codeExists = true;
    
    while (codeExists) {
      const codeQuery = query(sessionsRef, where('code', '==', code));
      const snapshot = await getDocs(codeQuery);
      if (snapshot.empty) {
        codeExists = false;
      } else {
        code = generateSessionCode();
      }
    }
    
    const seed = Math.floor(Math.random() * 1000000);
    const playerId = user?.uid || this.generateId();
    
    const sessionData = {
      code,
      gender,
      seed,
      createdAt: Timestamp.now(),
      status: 'waiting' as SessionStatus,
      creatorId: playerId,
      totalNames
    };
    
    const sessionDoc = await addDoc(sessionsRef, sessionData);
    
    const session: Session = {
      id: sessionDoc.id,
      ...sessionData,
      createdAt: new Date()
    };
    
    // Add the creator as first player
    const player = await this.addPlayer(session.id, playerId, playerName, true, user?.uid);
    
    this.currentSession$.next(session);
    this.currentPlayer$.next(player);
    
    // Save to user's sessions if logged in
    if (user) {
      this.currentUserSessionId = await this.userSessionService.saveUserSession(
        user.uid,
        session.id,
        session.code,
        session.gender,
        playerName,
        playerId,
        true,
        totalNames
      );
    }
    
    // Start listening to session updates
    this.listenToSession(session.id);
    
    return { session, player };
  }

  async joinSession(code: string, playerName: string): Promise<{ session: Session; player: Player } | null> {
    const sessionsRef = collection(this.firestore, 'sessions');
    const codeQuery = query(sessionsRef, where('code', '==', code.toUpperCase()));
    const snapshot = await getDocs(codeQuery);
    const user = this.authService.currentUser;
    
    if (snapshot.empty) {
      return null;
    }
    
    const sessionDoc = snapshot.docs[0];
    const sessionData = sessionDoc.data();
    
    const session: Session = {
      id: sessionDoc.id,
      code: sessionData['code'],
      gender: sessionData['gender'],
      seed: sessionData['seed'],
      createdAt: sessionData['createdAt'].toDate(),
      status: sessionData['status'],
      creatorId: sessionData['creatorId'],
      totalNames: sessionData['totalNames']
    };
    
    // Check if user already has a player in this session
    let player: Player | null = null;
    if (user) {
      player = await this.findPlayerByUserId(session.id, user.uid);
    }
    
    if (!player) {
      const playerId = user?.uid || this.generateId();
      player = await this.addPlayer(session.id, playerId, playerName, false, user?.uid);
    }
    
    this.currentSession$.next(session);
    this.currentPlayer$.next(player);
    
    // Save to user's sessions if logged in
    if (user) {
      this.currentUserSessionId = await this.userSessionService.saveUserSession(
        user.uid,
        session.id,
        session.code,
        session.gender,
        playerName,
        player.id,
        false,
        session.totalNames
      );
    }
    
    // Start listening to session updates
    this.listenToSession(session.id);
    
    return { session, player };
  }

  async resumeSession(sessionId: string, playerId: string): Promise<{ session: Session; player: Player } | null> {
    // Get session
    const sessionRef = doc(this.firestore, 'sessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (!sessionSnap.exists()) {
      return null;
    }
    
    const sessionData = sessionSnap.data();
    const session: Session = {
      id: sessionSnap.id,
      code: sessionData['code'],
      gender: sessionData['gender'],
      seed: sessionData['seed'],
      createdAt: sessionData['createdAt'].toDate(),
      status: sessionData['status'],
      creatorId: sessionData['creatorId'],
      totalNames: sessionData['totalNames']
    };
    
    // Get player
    const playersRef = collection(this.firestore, `sessions/${sessionId}/players`);
    const playerQuery = query(playersRef, where('id', '==', playerId));
    const playerSnap = await getDocs(playerQuery);
    
    if (playerSnap.empty) {
      return null;
    }
    
    const playerDoc = playerSnap.docs[0];
    const playerData = playerDoc.data();
    const player: Player = {
      id: playerData['id'],
      sessionId: playerData['sessionId'],
      name: playerData['name'],
      currentIndex: playerData['currentIndex'],
      joinedAt: playerData['joinedAt']?.toDate() || new Date(),
      isCreator: playerData['isCreator'],
      userId: playerData['userId']
    };
    
    this.currentSession$.next(session);
    this.currentPlayer$.next(player);
    
    // Update last accessed
    const user = this.authService.currentUser;
    if (user) {
      const userSession = await this.userSessionService.findUserSession(user.uid, sessionId);
      if (userSession) {
        this.currentUserSessionId = userSession.id;
        await this.userSessionService.updateLastAccessed(userSession.id);
      }
    }
    
    // Start listening to session updates
    this.listenToSession(session.id);
    
    return { session, player };
  }

  private async findPlayerByUserId(sessionId: string, userId: string): Promise<Player | null> {
    const playersRef = collection(this.firestore, `sessions/${sessionId}/players`);
    const playerQuery = query(playersRef, where('userId', '==', userId));
    const snapshot = await getDocs(playerQuery);
    
    if (snapshot.empty) {
      return null;
    }
    
    const playerDoc = snapshot.docs[0];
    const data = playerDoc.data();
    
    return {
      id: data['id'],
      sessionId: data['sessionId'],
      name: data['name'],
      currentIndex: data['currentIndex'],
      joinedAt: data['joinedAt']?.toDate() || new Date(),
      isCreator: data['isCreator'],
      userId: data['userId']
    };
  }

  private async addPlayer(sessionId: string, playerId: string, name: string, isCreator: boolean, userId?: string): Promise<Player> {
    const playersRef = collection(this.firestore, `sessions/${sessionId}/players`);
    
    const playerData: any = {
      id: playerId,
      sessionId,
      name,
      currentIndex: 0,
      joinedAt: Timestamp.now(),
      isCreator
    };
    
    if (userId) {
      playerData.userId = userId;
    }
    
    await addDoc(playersRef, playerData);
    
    return {
      ...playerData,
      joinedAt: new Date()
    };
  }

  getPlayers$(sessionId: string): Observable<Player[]> {
    const playersRef = collection(this.firestore, `sessions/${sessionId}/players`);
    return collectionData(playersRef).pipe(
      map(players => players.map(p => ({
        id: p['id'],
        sessionId: p['sessionId'],
        name: p['name'],
        currentIndex: p['currentIndex'],
        joinedAt: p['joinedAt']?.toDate() || new Date(),
        isCreator: p['isCreator'],
        userId: p['userId']
      })))
    );
  }

  async updatePlayerIndex(sessionId: string, playerId: string, newIndex: number): Promise<void> {
    const playersRef = collection(this.firestore, `sessions/${sessionId}/players`);
    const playerQuery = query(playersRef, where('id', '==', playerId));
    const snapshot = await getDocs(playerQuery);
    
    if (!snapshot.empty) {
      const playerDoc = snapshot.docs[0];
      await updateDoc(playerDoc.ref, { currentIndex: newIndex });
      
      // Update local state
      const currentPlayer = this.currentPlayer$.getValue();
      if (currentPlayer && currentPlayer.id === playerId) {
        this.currentPlayer$.next({ ...currentPlayer, currentIndex: newIndex });
      }
    }
  }

  async updateUserSessionProgress(currentIndex: number, matchCount: number): Promise<void> {
    if (this.currentUserSessionId) {
      await this.userSessionService.updateProgress(this.currentUserSessionId, currentIndex, matchCount);
    }
  }

  async startSession(sessionId: string): Promise<void> {
    const sessionRef = doc(this.firestore, `sessions/${sessionId}`);
    await updateDoc(sessionRef, { status: 'active' as SessionStatus });
  }

  async endSession(sessionId: string): Promise<void> {
    const sessionRef = doc(this.firestore, `sessions/${sessionId}`);
    await updateDoc(sessionRef, { status: 'completed' as SessionStatus });
  }

  private listenToSession(sessionId: string): void {
    const sessionRef = doc(this.firestore, `sessions/${sessionId}`);
    
    onSnapshot(sessionRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const session: Session = {
          id: snapshot.id,
          code: data['code'],
          gender: data['gender'],
          seed: data['seed'],
          createdAt: data['createdAt'].toDate(),
          status: data['status'],
          creatorId: data['creatorId'],
          totalNames: data['totalNames']
        };
        this.currentSession$.next(session);
      }
    });
  }

  clearSession(): void {
    this.currentSession$.next(null);
    this.currentPlayer$.next(null);
    this.currentUserSessionId = null;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
