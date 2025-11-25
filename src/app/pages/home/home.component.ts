import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MemeService, Meme } from '../../services/meme.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="home-container">
      <header class="hero">
        <h1>Welcome to Memepedia</h1>
        <p>Discover the origin stories of your favorite internet culture moments.</p>
        <a routerLink="/memes" class="cta-button">Explore All Memes</a>
      </header>

      <section class="trending">
        <h2>Trending Now</h2>
        <div class="meme-grid" *ngIf="trendingMemes$ | async as memes; else loading">
          <div class="meme-card" *ngFor="let meme of memes">
            <a [routerLink]="['/memes', meme.id]">
              <div class="image-wrapper">
                <img [src]="meme.url" [alt]="meme.name" loading="lazy">
              </div>
              <div class="card-content">
                <h3>{{ meme.name }}</h3>
              </div>
            </a>
          </div>
        </div>
        <ng-template #loading>
          <div class="loading">Loading trending memes...</div>
        </ng-template>
      </section>
    </div>
  `,
    styles: [`
    @import '../../../styles/variables';

    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: $spacing-xl $spacing-md;
    }

    .hero {
      text-align: center;
      margin-bottom: $spacing-xl * 2;
      padding: $spacing-xl;
      background: linear-gradient(135deg, $surface-color 0%, darken($surface-color, 5%) 100%);
      border-radius: 16px;

      h1 {
        font-size: 3rem;
        margin-bottom: $spacing-md;
        color: $primary-color;
      }

      p {
        font-size: 1.2rem;
        color: $text-secondary;
        margin-bottom: $spacing-lg;
      }

      .cta-button {
        display: inline-block;
        background-color: $secondary-color;
        color: #000;
        padding: $spacing-md $spacing-lg;
        border-radius: 8px;
        font-weight: bold;
        transition: transform 0.2s, box-shadow 0.2s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba($secondary-color, 0.4);
        }
      }
    }

    .trending {
      h2 {
        font-size: 2rem;
        margin-bottom: $spacing-lg;
        border-bottom: 2px solid $surface-color;
        padding-bottom: $spacing-sm;
      }
    }

    .meme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: $spacing-lg;
    }

    .meme-card {
      background-color: $surface-color;
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.3s;
      height: 100%;
      display: flex;
      flex-direction: column;

      &:hover {
        transform: scale(1.03);
      }

      a {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .image-wrapper {
        height: 250px;
        overflow: hidden;
        background-color: #000;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .card-content {
        padding: $spacing-md;
        
        h3 {
          margin: 0;
          font-size: 1.1rem;
          color: $text-color;
        }
      }
    }

    .loading {
      text-align: center;
      padding: $spacing-xl;
      color: $text-secondary;
    }
  `]
})
export class HomeComponent implements OnInit {
    trendingMemes$!: Observable<Meme[]>;

    constructor(private memeService: MemeService) { }

    ngOnInit() {
        this.trendingMemes$ = this.memeService.getTrendingMemes();
    }
}
