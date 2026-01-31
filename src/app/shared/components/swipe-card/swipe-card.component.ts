import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NameInfo } from '../../../core/models/name-info.model';
import 'hammerjs';

@Component({
  selector: 'app-swipe-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card-container">
      <!-- Card wrapper for swipe gestures -->
      <div 
        #card
        class="swipe-card"
        [class.boy-theme]="gender === 'boy'"
        [class.girl-theme]="gender === 'girl'"
        [class.flipped]="isFlipped"
        [style.transform]="cardTransform"
        [style.transition]="cardTransition"
        (click)="onCardClick($event)">
        
        <!-- Swipe indicators -->
        <div class="swipe-indicator like-indicator" [style.opacity]="likeOpacity">
          <span>LIKE ❤️</span>
        </div>
        <div class="swipe-indicator pass-indicator" [style.opacity]="passOpacity">
          <span>PASS 👎</span>
        </div>
        
        <!-- Front of card -->
        <div class="card-face card-front">
          <div class="card-content">
            <div class="gender-icon">{{ gender === 'boy' ? '👦' : '👧' }}</div>
            <h2 class="baby-name">{{ name }}</h2>
            
            <div class="quick-stats" *ngIf="nameInfo">
              <div class="stat-pill">🌍 {{ nameInfo.origin }}</div>
              <div class="stat-meaning">"{{ nameInfo.meaning }}"</div>
            </div>
            
            <div class="flip-hint">
              <span>↻ Tap to see more details</span>
            </div>
          </div>
        </div>
        
        <!-- Back of card -->
        <div class="card-face card-back">
          <div class="back-content" *ngIf="nameInfo">
            <h3 class="back-name">{{ name }}</h3>
            <div class="back-subtitle">Name Details</div>
            
            <div class="stats-grid">
              <div class="stat-item" *ngIf="nameInfo.popularity">
                <div class="stat-label">📊 Popularity</div>
                <div class="stat-value">#{{ nameInfo.popularity }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">🌍 Origin</div>
                <div class="stat-value">{{ nameInfo.origin }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">🔤 Syllables</div>
                <div class="stat-value">{{ nameInfo.syllables }}</div>
              </div>
              <div class="stat-item" *ngIf="nameInfo.peakDecade">
                <div class="stat-label">📈 Peak Era</div>
                <div class="stat-value">{{ nameInfo.peakDecade }}</div>
              </div>
            </div>
            
            <div class="detail-section">
              <div class="detail-label">💫 Meaning</div>
              <div class="detail-value">{{ nameInfo.meaning }}</div>
            </div>
            
            <div class="detail-section" *ngIf="nameInfo.nicknames && nameInfo.nicknames.length > 0">
              <div class="detail-label">💝 Nicknames</div>
              <div class="pill-list">
                <span class="pill" *ngFor="let nick of nameInfo.nicknames">{{ nick }}</span>
              </div>
            </div>
            
            <div class="detail-section" *ngIf="nameInfo.famousPeople && nameInfo.famousPeople.length > 0">
              <div class="detail-label">⭐ Famous People</div>
              <div class="famous-list">{{ nameInfo.famousPeople.slice(0, 3).join(', ') }}</div>
            </div>
            
            <div class="flip-hint">
              <span>↻ Tap to flip back</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 400px;
    }
    
    .card-container {
      width: 100%;
      perspective: 1000px;
    }
    
    .swipe-card {
      width: 320px;
      height: 420px;
      margin: 0 auto;
      position: relative;
      transform-style: preserve-3d;
      cursor: grab;
      user-select: none;
      -webkit-user-select: none;
      border-radius: 20px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }
    
    .swipe-card:active {
      cursor: grabbing;
    }
    
    .swipe-card.flipped {
      transform: rotateY(180deg);
    }
    
    /* Themes */
    .boy-theme {
      background: linear-gradient(145deg, #ffffff 0%, #eff6ff 50%, #dbeafe 100%);
      border: 3px solid #bfdbfe;
    }
    
    .girl-theme {
      background: linear-gradient(145deg, #ffffff 0%, #fdf2f8 50%, #fce7f3 100%);
      border: 3px solid #fbcfe8;
    }
    
    /* Card faces */
    .card-face {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      border-radius: 20px;
      overflow: hidden;
    }
    
    .card-front {
      z-index: 2;
    }
    
    .card-back {
      transform: rotateY(180deg);
      z-index: 1;
      background: inherit;
    }
    
    /* Swipe indicators */
    .swipe-indicator {
      position: absolute;
      top: 20px;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 800;
      font-size: 16px;
      z-index: 10;
      opacity: 0;
    }
    
    .like-indicator {
      left: 16px;
      background: #dcfce7;
      border: 2px solid #22c55e;
      color: #16a34a;
      transform: rotate(-12deg);
    }
    
    .pass-indicator {
      right: 16px;
      background: #fee2e2;
      border: 2px solid #ef4444;
      color: #dc2626;
      transform: rotate(12deg);
    }
    
    /* Front card content */
    .card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 24px;
      text-align: center;
    }
    
    .gender-icon {
      font-size: 56px;
      margin-bottom: 12px;
    }
    
    .baby-name {
      font-family: 'Quicksand', sans-serif;
      font-size: 36px;
      font-weight: 700;
      margin: 0 0 16px 0;
      padding: 8px 20px;
      border-radius: 12px;
    }
    
    .boy-theme .baby-name {
      color: #1e40af;
      background: rgba(59, 130, 246, 0.1);
    }
    
    .girl-theme .baby-name {
      color: #be185d;
      background: rgba(236, 72, 153, 0.1);
    }
    
    .quick-stats {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    
    .stat-pill {
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
    }
    
    .boy-theme .stat-pill {
      background: rgba(59, 130, 246, 0.15);
      color: #1e40af;
    }
    
    .girl-theme .stat-pill {
      background: rgba(236, 72, 153, 0.15);
      color: #be185d;
    }
    
    .stat-meaning {
      font-size: 14px;
      color: #6b7280;
      font-style: italic;
      max-width: 240px;
    }
    
    .flip-hint {
      margin-top: auto;
      color: #9ca3af;
      font-size: 12px;
    }
    
    /* Back card content */
    .back-content {
      padding: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      text-align: center;
    }
    
    .back-name {
      font-family: 'Quicksand', sans-serif;
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 4px 0;
    }
    
    .boy-theme .back-name {
      color: #1e40af;
    }
    
    .girl-theme .back-name {
      color: #be185d;
    }
    
    .back-subtitle {
      font-size: 12px;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid rgba(0,0,0,0.1);
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 16px;
      text-align: center;
    }
    
    .stat-item {
      padding: 10px;
      border-radius: 12px;
      background: rgba(0, 0, 0, 0.03);
    }
    
    .stat-label {
      font-size: 11px;
      color: #6b7280;
      margin-bottom: 4px;
    }
    
    .stat-value {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }
    
    .detail-section {
      margin-bottom: 12px;
      text-align: left;
    }
    
    .detail-label {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 4px;
    }
    
    .detail-value {
      font-size: 14px;
      color: #374151;
    }
    
    .pill-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    
    .pill {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .boy-theme .pill {
      background: rgba(59, 130, 246, 0.15);
      color: #1e40af;
    }
    
    .girl-theme .pill {
      background: rgba(236, 72, 153, 0.15);
      color: #be185d;
    }
    
    .famous-list {
      font-size: 13px;
      color: #4b5563;
    }
  `]
})
export class SwipeCardComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('card') cardElement!: ElementRef<HTMLDivElement>;
  
  @Input() name: string = '';
  @Input() gender: 'boy' | 'girl' = 'boy';
  @Input() nameInfo: NameInfo | null = null;
  
  @Output() swipedRight = new EventEmitter<void>();
  @Output() swipedLeft = new EventEmitter<void>();
  
  cardTransform = '';
  cardTransition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  isFlipped = false;
  
  private hammer: HammerManager | null = null;
  private currentX = 0;
  private isSwipeAnimating = false;
  private wasDragging = false;
  private dragStartTime = 0;
  
  get likeOpacity(): number {
    if (this.isFlipped) return 0;
    return Math.min(Math.max(this.currentX / 80, 0), 1);
  }
  
  get passOpacity(): number {
    if (this.isFlipped) return 0;
    return Math.min(Math.max(-this.currentX / 80, 0), 1);
  }

  ngAfterViewInit(): void {
    this.initHammer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['name'] && !changes['name'].firstChange) {
      this.resetCard();
    }
  }

  ngOnDestroy(): void {
    if (this.hammer) {
      this.hammer.destroy();
    }
  }

  onCardClick(event: Event): void {
    // Only flip if it was a quick tap, not a drag
    if (!this.wasDragging && !this.isSwipeAnimating) {
      this.isFlipped = !this.isFlipped;
      if (this.isFlipped) {
        this.cardTransform = 'rotateY(180deg)';
      } else {
        this.cardTransform = '';
      }
    }
    // Reset the dragging flag after click is processed
    this.wasDragging = false;
  }

  private resetCard(): void {
    this.cardTransform = '';
    this.cardTransition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    this.currentX = 0;
    this.isSwipeAnimating = false;
    this.isFlipped = false;
    this.wasDragging = false;
  }

  private initHammer(): void {
    if (!this.cardElement?.nativeElement) return;

    this.hammer = new Hammer(this.cardElement.nativeElement);
    
    this.hammer.get('pan').set({ 
      direction: Hammer.DIRECTION_HORIZONTAL,
      threshold: 10
    });
    
    this.hammer.on('panstart', () => {
      if (this.isSwipeAnimating) return;
      this.cardTransition = 'none';
      this.dragStartTime = Date.now();
      this.wasDragging = false;
    });
    
    this.hammer.on('panmove', (e) => {
      if (this.isSwipeAnimating || this.isFlipped) return;
      
      // Mark as dragging if moved more than a small threshold
      if (Math.abs(e.deltaX) > 5) {
        this.wasDragging = true;
      }
      
      this.currentX = e.deltaX;
      const rotation = e.deltaX * 0.05;
      this.cardTransform = `translateX(${this.currentX}px) rotate(${rotation}deg)`;
    });
    
    this.hammer.on('panend', (e) => {
      if (this.isSwipeAnimating || this.isFlipped) return;
      
      const threshold = 100;
      const velocity = Math.abs(e.velocityX);
      const effectiveThreshold = velocity > 0.5 ? 50 : threshold;
      
      if (e.deltaX > effectiveThreshold) {
        this.animateSwipeOut('right');
      } else if (e.deltaX < -effectiveThreshold) {
        this.animateSwipeOut('left');
      } else {
        // Snap back
        this.cardTransition = 'transform 0.3s ease-out';
        this.cardTransform = '';
        this.currentX = 0;
      }
    });
  }

  private animateSwipeOut(direction: 'left' | 'right'): void {
    this.isSwipeAnimating = true;
    
    const endX = direction === 'right' ? window.innerWidth + 100 : -window.innerWidth - 100;
    const endRotation = direction === 'right' ? 30 : -30;
    
    this.cardTransition = 'transform 0.4s ease-out';
    this.cardTransform = `translateX(${endX}px) rotate(${endRotation}deg)`;
    
    setTimeout(() => {
      if (direction === 'right') {
        this.swipedRight.emit();
      } else {
        this.swipedLeft.emit();
      }
      this.resetCard();
    }, 400);
  }

  triggerSwipe(direction: 'left' | 'right'): void {
    if (this.isSwipeAnimating) return;
    // Reset flip before swiping
    if (this.isFlipped) {
      this.isFlipped = false;
      this.cardTransform = '';
    }
    setTimeout(() => this.animateSwipeOut(direction), 50);
  }
}
