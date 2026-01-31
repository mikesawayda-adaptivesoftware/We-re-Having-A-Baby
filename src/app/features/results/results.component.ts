import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, combineLatest, map } from 'rxjs';
import { SessionService } from '../../core/services/session.service';
import { VoteService } from '../../core/services/vote.service';
import { Session, Player, Match } from '../../core/models/session.model';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex flex-col bg-gradient-to-b from-baby-pink-50 via-white to-baby-blue-50">
      <!-- Header -->
      <header class="p-4 bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div class="max-w-lg mx-auto flex items-center justify-between">
          <button 
            (click)="backToGame()"
            class="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h1 class="font-display text-xl font-bold text-gray-800">Results</h1>
          
          <div class="w-10"></div>
        </div>
      </header>

      <!-- Session info -->
      <div class="px-4 py-3 bg-white/50">
        <div class="max-w-lg mx-auto flex items-center justify-center gap-3">
          <span class="text-2xl">{{ session?.gender === 'boy' ? '👦' : '👧' }}</span>
          <span class="font-medium text-gray-700">{{ session?.gender === 'boy' ? 'Boy' : 'Girl' }} Names</span>
          <span class="text-gray-400">|</span>
          <span class="text-sm text-gray-500">{{ players.length }} players</span>
        </div>
      </div>

      <!-- Main content -->
      <main class="flex-1 p-4">
        <div class="max-w-lg mx-auto">
          
          <!-- Matches section -->
          <div class="mb-8">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-2xl">💕</span>
              <h2 class="font-display text-xl font-bold text-gray-800">Perfect Matches</h2>
              <span class="ml-auto bg-gradient-to-r from-baby-pink-400 to-baby-blue-400 text-white text-sm font-bold px-3 py-1 rounded-full">
                {{ matches.length }}
              </span>
            </div>
            
            <div *ngIf="matches.length === 0" class="card text-center py-8">
              <div class="text-4xl mb-3">🔍</div>
              <h3 class="font-display font-semibold text-gray-700 mb-2">No matches yet</h3>
              <p class="text-gray-500 text-sm">Keep swiping to find names you both love!</p>
            </div>
            
            <div *ngIf="matches.length > 0" class="space-y-3">
              <div 
                *ngFor="let name of matches; let i = index"
                class="card flex items-center gap-4 animate-card-enter"
                [style.animation-delay.ms]="i * 50">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-baby-pink-200 to-baby-blue-200 flex items-center justify-center">
                  <span class="text-xl">{{ session?.gender === 'boy' ? '👦' : '👧' }}</span>
                </div>
                <div class="flex-1">
                  <h3 class="font-display text-lg font-bold text-gray-800">{{ name }}</h3>
                  <p class="text-sm text-green-600">Everyone loves this name! ❤️</p>
                </div>
                <div class="text-2xl">✨</div>
              </div>
            </div>
          </div>

          <!-- Partial likes section -->
          <div *ngIf="partialMatches.length > 0" class="mb-8">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-2xl">💭</span>
              <h2 class="font-display text-xl font-bold text-gray-800">Almost There</h2>
              <span class="text-sm text-gray-500">(liked by some)</span>
            </div>
            
            <div class="space-y-2">
              <div 
                *ngFor="let match of partialMatches"
                class="bg-white/70 rounded-xl p-4 flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <span>{{ session?.gender === 'boy' ? '👦' : '👧' }}</span>
                </div>
                <div class="flex-1">
                  <h3 class="font-display font-semibold text-gray-700">{{ match.babyName }}</h3>
                  <p class="text-xs text-gray-500">
                    Liked by: {{ match.likedBy.join(', ') }}
                  </p>
                </div>
                <div class="text-sm text-gray-400">
                  {{ match.likedBy.length }}/{{ players.length }}
                </div>
              </div>
            </div>
          </div>

          <!-- Player progress -->
          <div class="mb-8">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-2xl">👥</span>
              <h2 class="font-display text-xl font-bold text-gray-800">Player Progress</h2>
            </div>
            
            <div class="space-y-3">
              <div *ngFor="let p of players" class="bg-white/70 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-700">{{ p.name }}</span>
                    <span *ngIf="p.isCreator" class="text-yellow-500">👑</span>
                    <span *ngIf="p.id === player?.id" class="text-xs bg-baby-pink-100 text-baby-pink-600 px-2 py-0.5 rounded-full">You</span>
                  </div>
                  <span class="text-sm text-gray-500">{{ p.currentIndex }} / {{ session?.totalNames || 0 }}</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-gradient-to-r from-baby-pink-400 to-baby-blue-400 rounded-full transition-all duration-300"
                    [style.width.%]="(p.currentIndex / (session?.totalNames || 1)) * 100">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-3 pb-8">
            <button 
              (click)="backToGame()"
              class="w-full btn-primary bg-gradient-to-r from-baby-pink-400 to-baby-blue-400 text-lg">
              Continue Swiping
            </button>
            
            <button 
              (click)="copySessionCode()"
              class="w-full btn-secondary">
              <span class="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {{ copied ? 'Copied!' : 'Copy Session Code: ' + session?.code }}
              </span>
            </button>
            
            <button 
              (click)="startNewSession()"
              class="w-full text-gray-500 hover:text-gray-700 py-2">
              Start New Session
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
export class ResultsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sessionService = inject(SessionService);
  private voteService = inject(VoteService);
  
  private destroy$ = new Subject<void>();
  
  session: Session | null = null;
  player: Player | null = null;
  players: Player[] = [];
  
  matches: string[] = [];
  partialMatches: Match[] = [];
  
  copied = false;

  ngOnInit(): void {
    const sessionId = this.route.snapshot.paramMap.get('sessionId');
    
    if (!sessionId) {
      this.router.navigate(['/']);
      return;
    }

    // Get session and player
    combineLatest([
      this.sessionService.session$,
      this.sessionService.player$
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([session, player]) => {
      if (!session) {
        this.router.navigate(['/']);
        return;
      }
      
      this.session = session;
      this.player = player;
      
      // Start listening to votes
      this.voteService.listenToVotes(session.id);
    });

    // Listen to players
    this.sessionService.session$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(session => {
      if (session) {
        this.sessionService.getPlayers$(session.id).pipe(
          takeUntil(this.destroy$)
        ).subscribe(players => {
          this.players = players;
          
          // Get matches
          this.voteService.getMatches$(players).pipe(
            takeUntil(this.destroy$)
          ).subscribe(allMatches => {
            this.matches = allMatches.filter(m => m.isMatch).map(m => m.babyName);
            this.partialMatches = allMatches.filter(m => !m.isMatch && m.likedBy.length > 0);
          });
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  backToGame(): void {
    if (this.session) {
      this.router.navigate(['/game', this.session.id]);
    }
  }

  async copySessionCode(): Promise<void> {
    if (this.session) {
      try {
        await navigator.clipboard.writeText(this.session.code);
        this.copied = true;
        setTimeout(() => this.copied = false, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  }

  startNewSession(): void {
    this.sessionService.clearSession();
    this.voteService.stopListening();
    this.router.navigate(['/']);
  }
}

