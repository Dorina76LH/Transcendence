import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  template: ` <header>
    <nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container-fluid">
        <a routerLink="/" class="nav-link">
          <strong>TRANSCENDENCE</strong>
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar"
          aria-controls="navbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbar">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-4 ms-4">
            <li class="nav-item hover-underline">
              <a routerLink="/profile" class="nav-link">Profile</a>
            </li>
            <li class="nav-item hover-underline">
              <a routerLink="/settings" class="nav-link">Settings</a>
            </li>
            <li class="nav-item hover-underline">
              <a routerLink="/chat" class="nav-link">Chat</a>
            </li>
            <li class="nav-item hover-underline">
              <a routerLink="/friends" class="nav-link">Friends</a>
            </li>
          </ul>
          <div class="d-flex gap-2">
            <ng-container *ngIf="isLoggedIn">
              <button (click)="logout()" class="btn btn-danger">Logout</button>
            </ng-container>
            <ng-container *ngIf="!isLoggedIn">
              <a routerLink="/login" class="btn btn-secondary">Login</a>
              <a routerLink="/register" class="btn btn-primary">Register</a>
            </ng-container>
          </div>
        </div>
      </div>
    </nav>
  </header>`,
})
export class NavbarComponent {
  isLoggedIn = !!localStorage.getItem('token');

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  logout() {
    this.userService.logout().subscribe({
      next: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
      },
    });
  }
}
