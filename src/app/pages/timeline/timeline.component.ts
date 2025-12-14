import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MemeService, Meme } from '../../services/meme.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-timeline',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
    memes: Meme[] = [];
    filteredMemes: Meme[] = [];
    availableYears: number[] = [];
    selectedYear: number | null = null;
    loading = true;

    constructor(private memeService: MemeService) { }

    ngOnInit() {
        // Get all available years
        this.memeService.getAvailableYears().subscribe(years => {
            this.availableYears = years;
        });

        // Get all memes
        this.memeService.getMemes().subscribe(memes => {
            // Filter only memes with valid dates and sort by date (oldest first for storyline)
            this.memes = memes
                .filter(meme => meme.createdDate && meme.createdDate !== 'Unknown')
                .sort((a, b) => {
                    const dateA = new Date(a.createdDate!).getTime();
                    const dateB = new Date(b.createdDate!).getTime();
                    return dateA - dateB; // Ascending order (oldest first)
                });

            this.filteredMemes = [...this.memes];
            this.loading = false;
        });
    }

    selectYear(year: number | null) {
        this.selectedYear = year;

        if (year === null) {
            // Show all memes
            this.filteredMemes = [...this.memes];
        } else {
            // Filter by year
            this.filteredMemes = this.memes.filter(meme => {
                const memeYear = new Date(meme.createdDate!).getFullYear();
                return memeYear === year;
            });
        }
    }

    getMemeYear(meme: Meme): number {
        return new Date(meme.createdDate!).getFullYear();
    }

    // Determine if card should be on left or right (alternating)
    isLeft(index: number): boolean {
        return index % 2 === 0;
    }

    // Format date for display
    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
    }
}
