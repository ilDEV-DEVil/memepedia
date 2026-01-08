import { CommonModule, ViewportScroller } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ScrollPositionService } from '../../services/scroll-position.service';
import { SupabaseService, Meme } from '../../services/supabase.service';

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

  memes!: Promise<Meme[]>

  constructor(
    private scrollPositionService: ScrollPositionService,
    private viewportScroller: ViewportScroller,
    private supabaseService: SupabaseService
  ) { }

  ngOnInit() {
    this.memes = this.supabaseService.getMemes();
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
