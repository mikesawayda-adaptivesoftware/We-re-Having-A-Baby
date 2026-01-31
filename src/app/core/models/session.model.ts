export type Gender = 'boy' | 'girl';
export type SessionStatus = 'waiting' | 'active' | 'completed';

export interface Session {
  id: string;
  code: string;
  gender: Gender;
  seed: number;
  createdAt: Date;
  status: SessionStatus;
  creatorId: string;
  totalNames: number;
}

export interface Player {
  id: string;
  sessionId: string;
  name: string;
  currentIndex: number;
  joinedAt: Date;
  isCreator: boolean;
  userId?: string; // Link to authenticated user if logged in
}

export interface Vote {
  id: string;
  sessionId: string;
  playerId: string;
  playerName: string;
  babyName: string;
  liked: boolean;
  votedAt: Date;
}

export interface Match {
  babyName: string;
  likedBy: string[];
  allPlayersVoted: boolean;
  isMatch: boolean;
}

export interface GameState {
  session: Session | null;
  player: Player | null;
  players: Player[];
  currentName: string | null;
  currentIndex: number;
  totalNames: number;
  matches: Match[];
  isLoading: boolean;
}

// User's saved session reference
export interface UserSession {
  id: string;
  userId: string;
  sessionId: string;
  sessionCode: string;
  gender: Gender;
  playerName: string;
  playerId: string;
  isCreator: boolean;
  joinedAt: Date;
  lastAccessedAt: Date;
  currentIndex: number;
  totalNames: number;
  matchCount: number;
}

// Helper function to generate session code
export function generateSessionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like 0, O, 1, I
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Seeded random number generator (mulberry32)
export function seededRandom(seed: number): () => number {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Shuffle array using seeded random
export function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  const random = seededRandom(seed);
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}
