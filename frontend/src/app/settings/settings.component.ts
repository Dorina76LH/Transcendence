import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'user-settings',
  imports: [RouterLink],
  template: `
<header>
  <nav class="navbar navbar-expand-lg navbar-dark">
    <div class="container-fluid">
      <a routerLink="/" class="nav-link">
        <strong>TRANSCENDENCE</strong>
      </a>
      <button class="navbar-toggler" type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbar" 
              aria-controls="navbar" 
              aria-expanded="false" 
              aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbar">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-4 ms-4">
          <li class="nav-item">
            <a routerLink="/profile" class="nav-link">Profile</a>
          </li>
          <li class="nav-item">
            <a routerLink="/settings" class="nav-link">Settings</a>
          </li>
          <li class="nav-item">
            <a routerLink="/chat" class="nav-link">Chat</a>
          </li>
          <li class="nav-item">
            <a routerLink="/friends" class="nav-link">Friends</a>
          </li>
        </ul>
        <div class="d-flex gap-2">
          <a routerLink="/login" class="btn btn-secondary">Login</a>
          <a routerLink="/register" class="btn btn-primary">Register</a>
        </div>
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
      <a routerLink="/languages" class="btn btn-secondary">🇪🇸 / 🇫🇷 / 🇬🇧</a>
      <button class="btn btn-secondary me-3" (click)="toggleDarkMode()">
          {{ isDarkMode ? ' ☀️ ' : ' 🌙 ' }}
      </button>
      <a routerLink="/profile-settings" class="btn btn-secondary"> ⚙️ </a>
    </div>
  </div>
</main>`,
styleUrl: './settings.css',
encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit {
  isDarkMode = localStorage.getItem('darkMode') === 'true';
  ngOnInit() {
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', String(this.isDarkMode));
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }
}