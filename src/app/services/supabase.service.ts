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
   * Gets the public URL of an image from the Supabase bucket
   * @param imagePath The path of the image in the bucket (e.g. /images/meme.jpg or images/meme.jpg)
   * @returns The public URL of the image
   */
  getPublicImageUrl(imagePath: string): string {
    // Remove any leading slashes (the path should be "images/..." not "/images/...")
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;

    const { data } = this.supabase
      .storage
      .from('memes')
      .getPublicUrl(cleanPath);

    return data.publicUrl;
  }
}
