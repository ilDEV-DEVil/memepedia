import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meme, SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  trendingMemes!: Promise<Meme[]>;

  constructor(
    private supabaseService: SupabaseService
  ) { }

  ngOnInit() {
    this.trendingMemes = this.supabaseService.getTrendingMemes();
  }

  /**
   * Ottiene l'URL pubblico di un'immagine dal bucket di Supabase
   * @param imagePath Il percorso dell'immagine nel bucket
   * @returns L'URL pubblico dell'immagine
   */
  getImageUrl(imagePath: string): string {
    return this.supabaseService.getPublicImageUrl(imagePath);
  }
}
