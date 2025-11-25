import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

export interface Meme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
  captions: number;
  history?: string; // Added for our app
  origin?: string;  // Added for our app
}

interface ImgflipResponse {
  success: boolean;
  data: {
    memes: Meme[];
  };
}

const MOCK_HISTORY: { [key: string]: { history: string; origin: string } } = {
  '181913649': { // Drake Hotline Bling
    history: "The 'Drake Hotline Bling' meme is derived from the music video for Drake's 2015 hit single 'Hotline Bling'. The specific frames used show Drake looking disgusted/rejecting something in one frame, and then looking pleased/approving in the next.",
    origin: "The music video was released on October 19, 2015. The meme format quickly gained popularity on 4chan and Reddit as a way to express preference for one thing over another."
  },
  '87743020': { // Distracted Boyfriend
    history: "Also known as 'Man Looking at Other Woman', this stock photo depicts a man walking with his girlfriend while looking back at another woman, much to his girlfriend's disapproval. It is used to represent disloyalty or being distracted by something new and shiny.",
    origin: "The photo was taken by photographer Antonio Guillem in 2015 in Girona, Spain. It went viral in 2017 after being posted on Twitter."
  },
  '112126428': { // Distracted Boyfriend (Wait, ID might be different, using generic for safety)
    history: "A generic placeholder for history.",
    origin: "A generic placeholder for origin."
  },
  '61579': { // One Does Not Simply
    history: "Featuring Boromir from 'The Lord of the Rings: The Fellowship of the Ring', this meme uses the phrase 'One does not simply...' followed by a difficult task.",
    origin: "The line is spoken by Sean Bean's character Boromir in the 2001 film during the Council of Elrond."
  }
};

@Injectable({
  providedIn: 'root'
})
export class MemeService {
  private apiUrl = 'https://api.imgflip.com/get_memes';

  constructor(private http: HttpClient) { }

  getMemes(): Observable<Meme[]> {
    return this.http.get<ImgflipResponse>(this.apiUrl).pipe(
      map(response => {
        if (response.success) {
          return response.data.memes.map(meme => ({
            ...meme,
            history: MOCK_HISTORY[meme.id]?.history || 'History not available for this meme yet.',
            origin: MOCK_HISTORY[meme.id]?.origin || 'Origin unknown.'
          }));
        }
        return [];
      })
    );
  }

  getMemeById(id: string): Observable<Meme | undefined> {
    return this.getMemes().pipe(
      map(memes => memes.find(m => m.id === id))
    );
  }

  getTrendingMemes(count: number = 6): Observable<Meme[]> {
    return this.getMemes().pipe(
      map(memes => memes.slice(0, count))
    );
  }
}
