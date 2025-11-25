import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MemeService, Meme } from '../../services/meme.service';
import { Observable, switchMap } from 'rxjs';

@Component({
    selector: 'app-meme-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="detail-container" *ngIf="meme$ | async as meme; else loading">
      <div class="back-link">
        <a routerLink="/memes">← Back to List</a>
      </div>

      <div class="content-wrapper">
        <div class="image-section">
          <img [src]="meme.url" [alt]="meme.name">
        </div>

        <div class="info-section">
          <h1>{{ meme.name }}</h1>
          
          <div class="info-block">
            <h2>Origin</h2>
            <p>{{ meme.origin }}</p>
          </div>

          <div class="info-block">
            <h2>History & Usage</h2>
            <p>{{ meme.history }}</p>
          </div>

          <div class="meta-info">
            <span>Dimensions: {{ meme.width }}x{{ meme.height }}</span>
            <span>Captions: {{ meme.captions }}</span>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading">Loading meme details...</div>
    </ng-template>
  `,
    styles: [`
    @import '../../../styles/variables';

    .detail-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: $spacing-xl $spacing-md;
    }

    .back-link {
      margin-bottom: $spacing-lg;
      
      a {
        color: $secondary-color;
        font-weight: bold;
        &:hover {
          text-decoration: underline;
        }
      }
    }

    .content-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: $spacing-xl;
      background-color: $surface-color;
      padding: $spacing-xl;
      border-radius: 16px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .image-section {
      img {
        width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      }
    }

    .info-section {
      h1 {
        font-size: 2.5rem;
        color: $primary-color;
        margin-top: 0;
        margin-bottom: $spacing-lg;
      }

      .info-block {
        margin-bottom: $spacing-lg;

        h2 {
          font-size: 1.5rem;
          color: $secondary-color;
          margin-bottom: $spacing-sm;
          border-bottom: 1px solid #333;
          padding-bottom: $spacing-xs;
        }

        p {
          line-height: 1.6;
          color: $text-secondary;
        }
      }

      .meta-info {
        margin-top: $spacing-xl;
        padding-top: $spacing-lg;
        border-top: 1px solid #333;
        display: flex;
        gap: $spacing-lg;
        color: darken($text-secondary, 20%);
        font-size: 0.9rem;
      }
    }

    .loading {
      text-align: center;
      padding: $spacing-xl;
      color: $text-secondary;
    }
  `]
})
export class MemeDetailComponent implements OnInit {
    meme$!: Observable<Meme | undefined>;

    constructor(
        private route: ActivatedRoute,
        private memeService: MemeService
    ) { }

    ngOnInit() {
        this.meme$ = this.route.paramMap.pipe(
            switchMap(params => {
                const id = params.get('id');
                return this.memeService.getMemeById(id!);
            })
        );
    }
}
