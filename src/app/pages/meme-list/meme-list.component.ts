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

  memes!: Promise<Meme[]>;

  constructor(
    private scrollPositionService: ScrollPositionService,
    private viewportScroller: ViewportScroller,
    private supabaseService: SupabaseService
  ) { }

  ngOnInit() {
    this.memes = this.supabaseService.getMemes();
  }

  ngAfterViewInit() {
    // Restore the scroll position after the view has been initialized
    setTimeout(() => {
      const savedPosition = this.scrollPositionService.getScrollPosition(this.ROUTE_KEY);
      if (savedPosition !== null) {
        this.viewportScroller.scrollToPosition([0, savedPosition]);
      }
    }, 100);
  }

  onSearch(term: string) {
    this.searchTermSubject.next(term);
    // Reset the scroll position when performing a search
    this.scrollPositionService.clearScrollPosition(this.ROUTE_KEY);
  }

  /**
   * Saves the scroll position before navigating away from the page
   */
  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = this.viewportScroller.getScrollPosition()[1];
    this.scrollPositionService.saveScrollPosition(this.ROUTE_KEY, scrollPosition);
  }

  /**
   * Called when clicking on a card to navigate to the detail page
   */
  onMemeClick(): void {
    const scrollPosition = this.viewportScroller.getScrollPosition()[1];
    this.scrollPositionService.saveScrollPosition(this.ROUTE_KEY, scrollPosition);
  }

  /**
   * Gets the public URL of an image from the Supabase bucket
   * @param imagePath The path of the image in the bucket
   * @returns The public URL of the image
   */
  getImageUrl(imagePath: string): string {
    return this.supabaseService.getPublicImageUrl(imagePath);
  }
}
