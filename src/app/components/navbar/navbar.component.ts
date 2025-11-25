import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    template: `
    <nav class="navbar">
      <div class="container">
        <a routerLink="/" class="logo">Memepedia</a>
        <ul class="nav-links">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a></li>
          <li><a routerLink="/memes" routerLinkActive="active">All Memes</a></li>
        </ul>
      </div>
    </nav>
  `,
    styles: [`
    @import '../../../styles/variables';

    .navbar {
      background-color: $surface-color;
      padding: $spacing-md 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.5);
      position: sticky;
      top: 0;
      z-index: 1000;

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 $spacing-md;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .logo {
        font-size: 1.5rem;
        font-weight: bold;
        color: $primary-color;
      }

      .nav-links {
        list-style: none;
        display: flex;
        gap: $spacing-lg;
        margin: 0;
        padding: 0;

        li a {
          font-weight: 500;
          transition: color 0.3s;

          &:hover, &.active {
            color: $secondary-color;
          }
        }
      }
    }
  `]
})
export class NavbarComponent { }
