import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'user-profile',
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
<main class="Profile">
  <div class="card border-secondary p-4" style="width: 450px;">
    <h2 class="text-center mb-4">Profile overview</h2>
    <div class="text-center mb-4">
      <div class="position-relative d-inline-block">
        <img src="assets/Zoliac.png" class="rounded-circle border border-secondary" 
             style="width:100px; height:100px; object-fit: cover;">
          <i class="fas fa-camera fa-xs"></i>
      </div>
    </div>
      <div class="mb-3">
        <label class="form-label">Username</label>
      </div>
      <div class="mb-3">
        <label class="form-label">Email</label>
      </div>
      <div class="mb-3">
        <label class="form-label">Biography</label>
      </div>
      <div class="d-grid gap-2 mt-4">
      </div>
  </div>
</main>`,
styleUrl: './profile.css',
})
export class ProfileComponent {

}
