import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lang',
  imports: [RouterLink],
  template: `
<header>
  <nav class="navbar navbar-expand-lg navbar-dark d-none d-lg-block" style="z-index: 2000;">
    <div class="container-fluid">
      <a routerLink="/" class="nav-link">
        <strong>TRANSCENDENCE</strong>
      </a>
      <button class="navbar-toggler" type="button" data-mdb-collapse-init data-mdb-target="#navbar"
        aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
        <i class="fas fa-bars"></i>
      </button>
      <div class="collapse navbar-collapse" id="navbar">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-4 ms-4">
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
<main class="Languages">
  <div class="Content">
    <div>
      <h1>Languages Page</h1>
      <h2>This is the actual languages page, still in progress, but I got the page lol</h2>
	<h3>We'll soon have 3 more languages handled for the project, but for now we only got one</h3>
	<h3>Which is english as you can see.</h3>
    </div>
  </div>
</main>`,
  styleUrl: './languages.css',
})
export class LanguageComponent {

}
