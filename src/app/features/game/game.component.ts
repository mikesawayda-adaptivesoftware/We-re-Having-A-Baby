import { Component, OnInit, OnDestroy, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { SessionService } from '../../core/services/session.service';
import { NameService } from '../../core/services/name.service';
import { VoteService } from '../../core/services/vote.service';
import { SwipeCardComponent } from '../../shared/components/swipe-card/swipe-card.component';
import { Session, Player } from '../../core/models/session.model';
import { NameInfo } from '../../core/models/name-info.model';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, SwipeCardComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <!-- Header -->
      <header class="p-4 bg-white/90 backdrop-blur-sm shadow-sm">
        <div class="max-w-lg mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ session?.gender === 'boy' ? '👦' : '👧' }}</span>
            <div>
              <div class="font-display font-semibold text-gray-800">{{ session?.gender === 'boy' ? 'Boy' : 'Girl' }} Names</div>
              <div class="text-xs text-gray-500">Code: <span class="font-mono">{{ session?.code }}</span></div>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <!-- Match counter -->
            <div class="flex items-center gap-1 bg-gradient-to-r from-baby-pink-100 to-baby-blue-100 px-3 py-1.5 rounded-full">
              <span class="text-lg">💕</span>
              <span class="font-bold text-gray-700">{{ matchCount }}</span>
            </div>
            
            <!-- View results -->
            <button 
              (click)="viewResults()"
              class="text-sm text-baby-pink-500 hover:text-baby-pink-600 font-medium">
              Results
            </button>
          </div>
        </div>
      </header>

      <!-- Players bar -->
      <div class="px-4 py-2 bg-white/50">
        <div class="max-w-lg mx-auto">
          <div class="flex items-center gap-2 overflow-x-auto">
            <span class="text-xs text-gray-500 flex-shrink-0">Players:</span>
            <div *ngFor="let p of players" 
                 class="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                 [class]="p.id === player?.id ? 'bg-baby-pink-200 text-baby-pink-700' : 'bg-gray-200 text-gray-600'">
              <span>{{ p.name }}</span>
              <span *ngIf="p.isCreator" class="text-yellow-500">👑</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="px-4 py-2">
        <div class="max-w-lg mx-auto">
          <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{{ currentIndex + 1 }} / {{ totalNames }}</span>
          </div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-baby-pink-400 to-baby-blue-400 rounded-full transition-all duration-300"
              [style.width.%]="((currentIndex + 1) / totalNames) * 100">
            </div>
          </div>
        </div>
      </div>

      <!-- Main game area -->
      <main class="flex-1 flex flex-col px-4 py-2 overflow-hidden">
        <div class="max-w-md mx-auto w-full flex-1 flex flex-col">
          
          <!-- Card container -->
          <div class="flex-1 flex items-center justify-center w-full" *ngIf="!isComplete">
            <!-- Loading state -->
            <div *ngIf="!currentName" class="text-center text-gray-500">
              <div class="text-3xl mb-2 animate-spin">⏳</div>
              <div>Loading names...</div>
            </div>
            
            <!-- Card -->
            <app-swipe-card
              *ngIf="currentName"
              #swipeCard
              [name]="currentName"
              [gender]="session?.gender || 'boy'"
              [nameInfo]="currentNameInfo"
              (swipedRight)="onSwipedRight()"
              (swipedLeft)="onSwipedLeft()">
            </app-swipe-card>
          </div>

          <!-- Completed state -->
          <div *ngIf="isComplete" class="flex-1 flex flex-col items-center justify-center text-center">
            <div class="text-6xl mb-4 animate-float">🎉</div>
            <h2 class="font-display text-2xl font-bold text-gray-800 mb-2">All Done!</h2>
            <p class="text-gray-600 mb-6">You've gone through all {{ totalNames }} names</p>
            <button 
              (click)="viewResults()"
              class="btn-primary bg-gradient-to-r from-baby-pink-400 to-baby-blue-400">
              View Your Matches
            </button>
          </div>

          <!-- Swipe buttons -->
          <div *ngIf="!isComplete" class="flex items-center justify-center gap-6 py-2">
            <!-- Pass button -->
            <button 
              (click)="onButtonPass()"
              [disabled]="isProcessing"
              class="group relative w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 border-2 border-red-200 hover:border-red-400 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="text-3xl group-hover:scale-110 transition-transform">👎</span>
              <span class="absolute -bottom-6 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Pass</span>
            </button>
            
            <!-- Like button -->
            <button 
              (click)="onButtonLike()"
              [disabled]="isProcessing"
              class="group relative w-20 h-20 rounded-full bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 border-2 border-green-300 hover:border-green-500 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="text-4xl group-hover:scale-110 transition-transform">❤️</span>
              <span class="absolute -bottom-6 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Like</span>
            </button>
          </div>

          <!-- Keyboard hints -->
          <div *ngIf="!isComplete" class="text-center text-xs text-gray-400 pb-1">
            Keyboard: ← Pass | → Like
          </div>
        </div>
      </main>

      <!-- Match notification -->
      <div 
        *ngIf="showMatchNotification"
        class="fixed inset-0 flex items-center justify-center z-50 bg-black/20 pointer-events-none">
        <div class="bg-white rounded-3xl shadow-2xl p-8 text-center animate-bounce">
          <div class="text-6xl mb-2">🎉💕🎉</div>
          <h3 class="font-display text-2xl font-bold text-gray-800">It's a Match!</h3>
          <p class="text-gray-600">You both like <strong>{{ lastMatchedName }}</strong></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      height: 100dvh;
    }
  `],
  host: {
    '(document:keydown.ArrowLeft)': 'onKeyboardPass($event)',
    '(document:keydown.ArrowRight)': 'onKeyboardLike($event)'
  }
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild('swipeCard') swipeCard!: SwipeCardComponent;
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sessionService = inject(SessionService);
  private nameService = inject(NameService);
  private voteService = inject(VoteService);
  
  private destroy$ = new Subject<void>();
  
  session: Session | null = null;
  player: Player | null = null;
  players: Player[] = [];
  
  names: string[] = [];
  currentIndex = 0;
  totalNames = 0;
  currentName: string | null = null;
  currentNameInfo: NameInfo | null = null;
  
  matchCount = 0;
  showMatchNotification = false;
  lastMatchedName = '';
  isProcessing = false;
  
  get isComplete(): boolean {
    return this.currentIndex >= this.totalNames;
  }

  ngOnInit(): void {
    const sessionId = this.route.snapshot.paramMap.get('sessionId');
    
    if (!sessionId) {
      this.router.navigate(['/']);
      return;
    }

    // Get session and player from service
    combineLatest([
      this.sessionService.session$,
      this.sessionService.player$
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([session, player]) => {
      if (!session || !player) {
        this.router.navigate(['/']);
        return;
      }
      
      this.session = session;
      this.player = player;
      this.currentIndex = player.currentIndex;
      
      // Initialize names
      this.names = this.nameService.getShuffledNames(session.gender, session.seed);
      this.totalNames = this.names.length;
      this.updateCurrentName();
      
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
          
          // Update match count
          this.voteService.getMatchCount$(players).pipe(
            takeUntil(this.destroy$)
          ).subscribe(count => {
            // Check for new match
            if (count > this.matchCount && this.matchCount > 0) {
              this.showMatchAnimation();
            }
            this.matchCount = count;
            
            // Save progress to user session
            this.sessionService.updateUserSessionProgress(this.currentIndex, count);
          });
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.voteService.stopListening();
  }

  private updateCurrentName(): void {
    if (this.currentIndex < this.names.length) {
      this.currentName = this.names[this.currentIndex];
      if (this.session) {
        this.currentNameInfo = this.nameService.getNameInfo(this.currentName, this.session.gender);
      }
    } else {
      this.currentName = null;
      this.currentNameInfo = null;
    }
  }

  // Button click handlers - trigger the card animation
  onButtonLike(): void {
    if (this.isProcessing || this.isComplete || !this.swipeCard) return;
    this.swipeCard.triggerSwipe('right');
  }

  onButtonPass(): void {
    if (this.isProcessing || this.isComplete || !this.swipeCard) return;
    this.swipeCard.triggerSwipe('left');
  }

  // Keyboard handlers
  onKeyboardLike(event: KeyboardEvent): void {
    event.preventDefault();
    this.onButtonLike();
  }

  onKeyboardPass(event: KeyboardEvent): void {
    event.preventDefault();
    this.onButtonPass();
  }

  // Called when swipe animation completes (from card component)
  async onSwipedRight(): Promise<void> {
    await this.castVote(true);
  }

  async onSwipedLeft(): Promise<void> {
    await this.castVote(false);
  }

  private async castVote(liked: boolean): Promise<void> {
    if (!this.session || !this.player || !this.currentName || this.isProcessing) return;

    this.isProcessing = true;
    const votedName = this.currentName;

    try {
      // Save vote
      await this.voteService.castVote(
        this.session.id,
        this.player.id,
        this.player.name,
        votedName,
        liked
      );

      // Update player index
      const newIndex = this.currentIndex + 1;
      await this.sessionService.updatePlayerIndex(this.session.id, this.player.id, newIndex);
      
      this.currentIndex = newIndex;
      this.updateCurrentName();

      // Track for match notification
      if (liked) {
        this.lastMatchedName = votedName;
      }

      // Update user session progress
      await this.sessionService.updateUserSessionProgress(newIndex, this.matchCount);
    } catch (error) {
      console.error('Error casting vote:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private showMatchAnimation(): void {
    this.showMatchNotification = true;
    setTimeout(() => {
      this.showMatchNotification = false;
    }, 2500);
  }

  viewResults(): void {
    if (this.session) {
      this.router.navigate(['/results', this.session.id]);
    }
  }
}
