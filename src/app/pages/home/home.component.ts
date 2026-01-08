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
   * Gets the public URL of an image from the Supabase bucket
   * @param imagePath The path of the image in the bucket
   * @returns The public URL of the image
   */
  getImageUrl(imagePath: string): string {
    return this.supabaseService.getPublicImageUrl(imagePath);
  }
}
