import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MemeService, Meme } from '../../services/meme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  trendingMemes$!: Observable<Meme[]>;

  constructor(private memeService: MemeService) { }

  ngOnInit() {
    this.trendingMemes$ = this.memeService.getTrendingMemes();
  }
}
