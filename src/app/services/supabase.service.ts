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

     console.log('Fetched memes:', data);
     
    return data;
  }
}
