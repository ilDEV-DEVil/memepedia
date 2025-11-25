import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MemeService, Meme } from '../../services/meme.service';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-meme-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './meme-list.component.html',
  styleUrl: './meme-list.component.scss'
})
export class MemeListComponent implements OnInit {
  searchTerm: string = '';
  private searchTermSubject = new BehaviorSubject<string>('');

  memes$!: Observable<Meme[]>;
  filteredMemes$!: Observable<Meme[]>;

  constructor(private memeService: MemeService) { }

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

  onSearch(term: string) {
    this.searchTermSubject.next(term);
  }
}
