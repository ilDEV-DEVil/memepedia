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
  createdDate?: string; // Creation date of the meme
}

interface ImgflipResponse {
  success: boolean;
  data: {
    memes: Meme[];
  };
}

const MOCK_HISTORY: { [key: string]: { history: string; origin: string; createdDate: string; }; } = {
  '181913649': { // Drake Hotline Bling
    history: "The 'Drake Hotline Bling' meme is derived from the music video for Drake's 2015 hit single 'Hotline Bling'. The specific frames used show Drake looking disgusted/rejecting something in one frame, and then looking pleased/approving in the next.",
    origin: "The music video was released on October 19, 2015. The meme format quickly gained popularity on 4chan and Reddit as a way to express preference for one thing over another.",
    createdDate: "2015-10-19"
  },
  '87743020': { // Distracted Boyfriend
    history: "Also known as 'Man Looking at Other Woman', this stock photo depicts a man walking with his girlfriend while looking back at another woman, much to his girlfriend's disapproval. It is used to represent disloyalty or being distracted by something new and shiny.",
    origin: "The photo was taken by photographer Antonio Guillem in 2015 in Girona, Spain. It went viral in 2017 after being posted on Twitter.",
    createdDate: "2015-11-02"
  },
  '112126428': { // Distracted Boyfriend (Wait, ID might be different, using generic for safety)
    history: "A popular image macro format used across social media.",
    origin: "Became popular in the early 2010s.",
    createdDate: "2010-06-15"
  },
  '61579': { // One Does Not Simply
    history: "Featuring Boromir from 'The Lord of the Rings: The Fellowship of the Ring', this meme uses the phrase 'One does not simply...' followed by a difficult task.",
    origin: "The line is spoken by Sean Bean's character Boromir in the 2001 film during the Council of Elrond.",
    createdDate: "2001-12-19"
  },
  '101470': { // Ancient Aliens
    history: "Features Giorgio A. Tsoukalos from the History Channel show 'Ancient Aliens', used to suggest far-fetched explanations.",
    origin: "The show premiered in 2010, and the meme gained popularity around 2011.",
    createdDate: "2011-04-20"
  },
  '563423': { // That Would Be Great
    history: "Features Bill Lumbergh from the 1999 film 'Office Space', used to make passive-aggressive requests.",
    origin: "From the cult classic film Office Space, became a meme in the mid-2000s.",
    createdDate: "2005-03-15"
  },
  '438680': { // Batman Slapping Robin
    history: "Shows Batman slapping Robin, used to shut down bad ideas or statements.",
    origin: "From a 1960s Batman comic panel, became popular online in 2008.",
    createdDate: "2008-07-22"
  },
  '61520': { // Futurama Fry
    history: "Shows Fry from Futurama squinting suspiciously, used to express uncertainty or skepticism.",
    origin: "From the Futurama episode 'The Lesser of Two Evils' (2000), became a meme around 2011.",
    createdDate: "2011-01-10"
  },
  '101511': { // Don't You Squidward
    history: "Features Squidward from SpongeBob, used with 'Don't you [X]' to express annoyance.",
    origin: "From SpongeBob SquarePants, gained meme popularity in 2012.",
    createdDate: "2012-05-08"
  },
  '124822590': { // Left Exit 12 Off Ramp
    history: "Shows a car taking a sudden exit, representing choosing an unexpected or wrong option.",
    origin: "Became popular in 2017 as a way to show making bad decisions.",
    createdDate: "2017-03-14"
  },
  '217743513': { // UNO Draw 25 Cards
    history: "Shows someone choosing an extreme option rather than doing something simple.",
    origin: "Gained popularity in 2018 from the card game UNO.",
    createdDate: "2018-11-20"
  },
  '131087935': { // Running Away Balloon
    history: "Shows a person trying to catch a balloon while ignoring another, representing misplaced priorities.",
    origin: "Became popular in 2017 as a variation of the distracted boyfriend format.",
    createdDate: "2017-08-05"
  },
  '91538330': { // X, X Everywhere
    history: "Features Buzz and Woody from Toy Story, used to point out something that's everywhere.",
    origin: "From Toy Story (1995), became a meme format in 2010.",
    createdDate: "2010-11-30"
  },
  '4087833': { // Waiting Skeleton
    history: "Shows a skeleton waiting, used to represent waiting for something that takes forever.",
    origin: "Became popular around 2012 on Reddit and 4chan.",
    createdDate: "2012-09-18"
  },
  '135256802': { // Epic Handshake
    history: "Shows two muscular arms shaking hands, representing unlikely alliances or agreements.",
    origin: "From the 1987 film Predator, became a meme in 2017.",
    createdDate: "2017-06-12"
  },
  '178591752': { // Tuxedo Winnie The Pooh
    history: "Shows Pooh Bear in regular form vs fancy tuxedo, representing basic vs sophisticated versions.",
    origin: "Gained popularity in 2019 as a classier alternative to Drake meme.",
    createdDate: "2019-02-07"
  },
  '226297822': { // Panik Kalm Panik
    history: "Three-panel meme showing panic, calm, then panic again as a situation develops.",
    origin: "Became popular in 2019, featuring the 'Meme Man' character.",
    createdDate: "2019-05-15"
  },
  '222403160': { // Bernie I Am Once Again Asking
    history: "Features Bernie Sanders from his 2020 campaign, used for repeated requests.",
    origin: "From Bernie Sanders' 2020 presidential campaign video.",
    createdDate: "2020-01-28"
  },
  '131940431': { // Gru's Plan
    history: "Four-panel meme showing Gru's plan going wrong, used for plans with unexpected outcomes.",
    origin: "From Despicable Me (2010), became a meme format in 2017.",
    createdDate: "2017-07-09"
  },
  '188390779': { // Woman Yelling at Cat
    history: "Combines a woman yelling with a confused cat at dinner table, used for arguments or contrasts.",
    origin: "Merged from two separate images, went viral in 2019.",
    createdDate: "2019-05-01"
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
            origin: MOCK_HISTORY[meme.id]?.origin || 'Origin unknown.',
            createdDate: MOCK_HISTORY[meme.id]?.createdDate || 'Unknown'
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

  getMemesByYear(year: number): Observable<Meme[]> {
    return this.getMemes().pipe(
      map(memes => memes.filter(meme => {
        if (!meme.createdDate || meme.createdDate === 'Unknown') return false;
        const memeYear = new Date(meme.createdDate).getFullYear();
        return memeYear === year;
      }))
    );
  }

  getAvailableYears(): Observable<number[]> {
    return this.getMemes().pipe(
      map(memes => {
        const years = memes
          .filter(meme => meme.createdDate && meme.createdDate !== 'Unknown')
          .map(meme => new Date(meme.createdDate!).getFullYear());
        return [...new Set(years)].sort((a, b) => b - a); // Descending order
      })
    );
  }
}
