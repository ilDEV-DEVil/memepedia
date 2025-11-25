import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MemeListComponent } from './pages/meme-list/meme-list.component';
import { MemeDetailComponent } from './pages/meme-detail/meme-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'memes', component: MemeListComponent },
    { path: 'memes/:id', component: MemeDetailComponent },
    { path: '**', redirectTo: '' }
];
