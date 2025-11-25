import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MemeService, Meme } from '../../services/meme.service';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-meme-list',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    template: `
    <div class="list-container">
      <header class="list-header">
        <h2>All Memes</h2>
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="Search memes..." 
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearch($event)">
        </div>
      </header>

      <div class="meme-grid" *ngIf="filteredMemes$ | async as memes; else loading">
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
        <div *ngIf="memes.length === 0" class="no-results">
          No memes found matching "{{ searchTerm }}".
        </div>
      </div>
      
      <ng-template #loading>
        <div class="loading">Loading memes...</div>
      </ng-template>
    </div>
  `,
    styles: [`
    @import '../../../styles/variables';

    .list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: $spacing-xl $spacing-md;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-xl;
      flex-wrap: wrap;
      gap: $spacing-md;

      h2 {
        font-size: 2rem;
        margin: 0;
        color: $primary-color;
      }

      .search-bar {
        flex: 1;
        max-width: 400px;

        input {
          width: 100%;
          padding: $spacing-md;
          border-radius: 8px;
          border: 1px solid #333;
          background-color: $surface-color;
          color: $text-color;
          font-size: 1rem;

          &:focus {
            outline: none;
            border-color: $primary-color;
          }
        }
      }
    }

    .meme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: $spacing-lg;
    }

    .meme-card {
      background-color: $surface-color;
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.3s;
      height: 100%;

      &:hover {
        transform: translateY(-5px);
      }

      a {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .image-wrapper {
        height: 200px;
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
          font-size: 1rem;
          color: $text-color;
        }
      }
    }

    .no-results, .loading {
      text-align: center;
      padding: $spacing-xl;
      color: $text-secondary;
      font-size: 1.2rem;
      grid-column: 1 / -1;
    }
  `]
})
export class MemeListComponent implements OnInit {
    searchTerm: string = '';
    private searchTermSubject = new BehaviorSubject<string>('');

    memes$!: Observable<Meme[]>;
    filteredMemes$!: Observable<Meme[]>;

    constructor(private memeService: MemeService) { }

    ngOnInit() {
        this.memes$ = this.memeService.getMemes();

        this.filteredMemes$ = combineLatest([
            this.memes$,
            this.searchTermSubject
        ]).pipe(
            map(([memes, term]) => {
                if (!term) return memes;
                return memes.filter(meme =>
                    meme.name.toLowerCase().includes(term.toLowerCase())
                );
            })
        );
    }

    onSearch(term: string) {
        this.searchTermSubject.next(term);
    }
}
