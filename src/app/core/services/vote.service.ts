import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  getDocs,
  query, 
  where, 
  onSnapshot,
  Timestamp,
  collectionData
} from '@angular/fire/firestore';
import { Observable, BehaviorSubject, map, combineLatest } from 'rxjs';
import { Vote, Match, Player } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  private firestore = inject(Firestore);
  
  private votes$ = new BehaviorSubject<Vote[]>([]);
  private unsubscribe: (() => void) | null = null;

  async castVote(
    sessionId: string, 
    playerId: string, 
    playerName: string,
    babyName: string, 
    liked: boolean
  ): Promise<void> {
    const votesRef = collection(this.firestore, `sessions/${sessionId}/votes`);
    
    await addDoc(votesRef, {
      sessionId,
      playerId,
      playerName,
      babyName,
      liked,
      votedAt: Timestamp.now()
    });
  }

  listenToVotes(sessionId: string): void {
    // Unsubscribe from previous listener
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    
    const votesRef = collection(this.firestore, `sessions/${sessionId}/votes`);
    
    this.unsubscribe = onSnapshot(votesRef, (snapshot) => {
      const votes: Vote[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          sessionId: data['sessionId'],
          playerId: data['playerId'],
          playerName: data['playerName'],
          babyName: data['babyName'],
          liked: data['liked'],
          votedAt: data['votedAt']?.toDate() || new Date()
        };
      });
      this.votes$.next(votes);
    });
  }

  getVotes$(): Observable<Vote[]> {
    return this.votes$.asObservable();
  }

  getVotesForName$(babyName: string): Observable<Vote[]> {
    return this.votes$.pipe(
      map(votes => votes.filter(v => v.babyName === babyName))
    );
  }

  getPlayerVotes$(playerId: string): Observable<Vote[]> {
    return this.votes$.pipe(
      map(votes => votes.filter(v => v.playerId === playerId))
    );
  }

  hasPlayerVotedOnName$(playerId: string, babyName: string): Observable<boolean> {
    return this.votes$.pipe(
      map(votes => votes.some(v => v.playerId === playerId && v.babyName === babyName))
    );
  }

  getMatches$(players: Player[]): Observable<Match[]> {
    return this.votes$.pipe(
      map(votes => {
        // Group votes by baby name
        const votesByName = new Map<string, Vote[]>();
        
        votes.forEach(vote => {
          const existing = votesByName.get(vote.babyName) || [];
          existing.push(vote);
          votesByName.set(vote.babyName, existing);
        });
        
        const matches: Match[] = [];
        const playerIds = new Set(players.map(p => p.id));
        
        votesByName.forEach((nameVotes, babyName) => {
          const likedBy = nameVotes
            .filter(v => v.liked)
            .map(v => v.playerName);
          
          const votedPlayerIds = new Set(nameVotes.map(v => v.playerId));
          const allPlayersVoted = [...playerIds].every(id => votedPlayerIds.has(id));
          
          // A match is when all players have voted AND all liked it
          const allLiked = nameVotes.every(v => v.liked);
          const isMatch = allPlayersVoted && allLiked && nameVotes.length === players.length;
          
          if (likedBy.length > 0 || allPlayersVoted) {
            matches.push({
              babyName,
              likedBy,
              allPlayersVoted,
              isMatch
            });
          }
        });
        
        // Sort: matches first, then by number of likes
        return matches.sort((a, b) => {
          if (a.isMatch && !b.isMatch) return -1;
          if (!a.isMatch && b.isMatch) return 1;
          return b.likedBy.length - a.likedBy.length;
        });
      })
    );
  }

  getMatchedNames$(players: Player[]): Observable<string[]> {
    return this.getMatches$(players).pipe(
      map(matches => matches.filter(m => m.isMatch).map(m => m.babyName))
    );
  }

  getMatchCount$(players: Player[]): Observable<number> {
    return this.getMatchedNames$(players).pipe(
      map(names => names.length)
    );
  }

  stopListening(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.votes$.next([]);
  }
}

