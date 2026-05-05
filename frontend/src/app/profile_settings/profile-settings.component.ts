import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'user-profile-settings',
  imports: [RouterLink, FormsModule],
  template: `
<header>
  <nav class="navbar navbar-expand-lg navbar-dark d-none d-lg-block" style="z-index: 2000;">
    <div class="container-fluid">
      <a routerLink="/" class="nav-link">
        <strong>TRANSCENDENCE</strong>
      </a>
      <button class="navbar-toggler" type="button" data-mdb-collapse-init data-mdb-target="#navbar"
        aria-controls="navbar" aria-expanded="true" aria-label="Toggle navigation">
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
<main class="d-flex justify-content-center align-items-center" style="min-height: calc(100vh - 56px);">
  <div class="card border-secondary p-4" style="width: 450px;">
    <h2 class="text-center mb-4">Profile Settings</h2>
    <div class="text-center mb-4">
      <div class="position-relative d-inline-block">
        <img [src]="user.avatarUrl" class="rounded-circle border border-secondary" 
             style="width:100px; height:100px; object-fit: cover;">
        <button class="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle">
          <i class="fas fa-camera fa-xs"></i>
        </button>
      </div>
    </div>
    <form (ngSubmit)="saveProfile()">
      <div class="mb-3">
        <label class="form-label">Username</label>
        <input class="form-control border-secondary rounded-pill" 
               type="text" [(ngModel)]="user.username" name="username" placeholder="Enter username">
      </div>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input class="form-control border-secondary rounded-pill" 
               type="email" [(ngModel)]="user.email" name="email" placeholder="Enter email">
      </div>
      <div class="mb-3">
        <label class="form-label">Biography</label>
        <textarea class="form-control border-secondary" 
                  style="border-radius: 15px;" rows="3" 
                  [(ngModel)]="user.bio" name="bio" placeholder="Tell us about yourself..."></textarea>
      </div>
      <div class="d-grid gap-2 mt-4">
        <button type="submit" class="btn btn-primary rounded-pill">Save changes</button>
        <button type="button" class="btn btn-outline-secondary rounded-pill">Cancel</button>
      </div>
    </form>

  </div>
</main>`,
styleUrl: './profile-settings.css',
})
export class ProfileSettingsComponent {
  user = {
    username: 'TEST',
    email: 'test@transcendence.com',
    bio: 'testing my code',
    avatarUrl: 'assets/Zoliac.png'
  };

  saveProfile() {
    console.log('Données enregistrées :', this.user);
    alert('Profil mis à jour avec succès !');
  }
}