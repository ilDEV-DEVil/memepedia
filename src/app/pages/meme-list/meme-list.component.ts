import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ViewportScroller } from '@angular/common';
import { MemeService, Meme } from '../../services/meme.service';
import { ScrollPositionService } from '../../services/scroll-position.service';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-meme-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './meme-list.component.html',
  styleUrl: './meme-list.component.scss'
})
export class MemeListComponent implements OnInit, AfterViewInit {
  searchTerm: string = '';
  private searchTermSubject = new BehaviorSubject<string>('');
  private readonly ROUTE_KEY = '/memes';

  memes$!: Observable<Meme[]>;
  filteredMemes$!: Observable<Meme[]>;

  constructor(
    private memeService: MemeService,
    private scrollPositionService: ScrollPositionService,
    private viewportScroller: ViewportScroller
  ) { }

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

  ngAfterViewInit() {
    // Ripristina la posizione di scroll dopo che la vista è stata inizializzata
    setTimeout(() => {
      const savedPosition = this.scrollPositionService.getScrollPosition(this.ROUTE_KEY);
      if (savedPosition !== null) {
        this.viewportScroller.scrollToPosition([0, savedPosition]);
      }
    }, 100);
  }

  onSearch(term: string) {
    this.searchTermSubject.next(term);
    // Resetta la posizione di scroll quando si effettua una ricerca
    this.scrollPositionService.clearScrollPosition(this.ROUTE_KEY);
  }

  /**
   * Salva la posizione di scroll prima di navigare via dalla pagina
   */
  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = this.viewportScroller.getScrollPosition()[1];
    this.scrollPositionService.saveScrollPosition(this.ROUTE_KEY, scrollPosition);
  }

  /**
   * Chiamato quando si clicca su una card per navigare al dettaglio
   */
  onMemeClick(): void {
    const scrollPosition = this.viewportScroller.getScrollPosition()[1];
    this.scrollPositionService.saveScrollPosition(this.ROUTE_KEY, scrollPosition);
  }
}
