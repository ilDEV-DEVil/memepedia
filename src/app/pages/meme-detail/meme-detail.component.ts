import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MemeService, Meme } from '../../services/meme.service';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-meme-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './meme-detail.component.html',
  styleUrls: ['./meme-detail.component.scss']
})
export class MemeDetailComponent implements OnInit {
  meme$!: Observable<Meme | undefined>;

  constructor(
    private route: ActivatedRoute,
    private memeService: MemeService
  ) { }

  ngOnInit() {
    this.meme$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return this.memeService.getMemeById(id!);
      })
    );
  }
}
