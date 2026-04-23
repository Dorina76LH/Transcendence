import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'user-settings',
  imports: [RouterLink],
  template: `
<header>
  <nav class="navbar navbar-expand-lg navbar-dark d-none d-lg-block" style="z-index: 2000;">
    <div class="container-fluid">
      <a routerLink="/" class="nav-link">
        <strong>TRANSCENDENCE</strong>
      </a>
      <button class="navbar-toggler" type="button" data-mdb-collapse-init data-mdb-target="#navbarExample01"
        aria-controls="navbarExample01" aria-expanded="false" aria-label="Toggle navigation">
        <i class="fas fa-bars"></i>
      </button>
      <div class="collapse navbar-collapse" id="navbarExample01">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item active">
            <a routerLink="/profile" class="nav-link">
              Profile
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/settings" class="nav-link">
              Settings
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/chat" class="nav-link">
              Chat
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</header>
<main class="Settings">
  <div class="Content">
    <div>
      <h1>Settings Page</h1>
      <h2>This is the actual settings page, still in progress, but I got the page lol</h2>
      <p>Languages setting page :</p>
      <div class="Language-button" style="text-align: center">
        <u><a routerLink="/languages">Languages</a></u>
      </div>
    </div>
  </div>
</main>`,
styleUrl: './settings.css',
})
export class SettingsComponent {

}
