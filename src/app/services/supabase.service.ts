import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../enviroments/enviroment';
import { Database } from '../../../database.types';

export type Meme = Database['public']['Tables']['Memes']['Row'];

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient<Database>(environment.supabaseUrl, environment.supabaseKey);
  }


  async getMemes() {
    const { data, error } = await this.supabase
      .from('Memes')
      .select('*');

    if (error) {
      console.error('Error fetching memes:', error);
      return [];
    }

    return data;
  }

  async getTrendingMemes() {
    const { data, error } = await this.supabase
      .from('Memes')
      .select('*')
      .order('meme_creation_date', { ascending: false });

    if (error) {
      console.error('Error fetching trending memes:', error);
      return [];
    }

    return data;
  }

  /**
   * Ottiene l'URL pubblico di un'immagine dal bucket di Supabase
   * @param imagePath Il percorso dell'immagine nel bucket (es. /images/meme.jpg o images/meme.jpg)
   * @returns L'URL pubblico dell'immagine
   */
  getPublicImageUrl(imagePath: string): string {
    // Rimuove eventuali slash iniziali (il path deve essere "images/..." non "/images/...")
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;

    const { data } = this.supabase
      .storage
      .from('memes')
      .getPublicUrl(cleanPath);

    return data.publicUrl;
  }
}
