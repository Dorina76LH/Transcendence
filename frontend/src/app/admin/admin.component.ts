import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { UserService } from '../user.service';

interface LoggedUser {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterLink, AdminDashboardComponent],
  template: `
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container-fluid">
          <a routerLink="/admin-panel" class="nav-link">
            <strong>TRANSCENDENCE ADMIN</strong>
          </a>

          <div class="ms-auto d-flex gap-2">
            <a href="/admin/" class="btn btn-secondary" target="_blank" rel="noopener noreferrer">
              Django admin
            </a>
            <button type="button" class="btn btn-danger" (click)="logout()">Logout</button>
          </div>
        </div>
      </nav>
    </header>

    <main class="AdminPage" *ngIf="isAdmin; else accessDenied">
      <section class="admin-content">
        <app-admin-dashboard></app-admin-dashboard>
      </section>
    </main>

    <ng-template #accessDenied>
      <main class="AdminPageAccess">
        <div class="card border-secondary p-4">
          <h1>Acess denied</h1>
          <p>This page is reserved for admin users.</p>
          <a routerLink="/" class="btn btn-primary">Back home</a>
        </div>
      </main>
    </ng-template>
  `,
  styleUrl: './admin.css',
})
export class AdminComponent implements OnInit {
  currentUser: LoggedUser | null = null;
  isAdmin = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      return;
    }
    this.currentUser = JSON.parse(storedUser) as LoggedUser;
    this.isAdmin = this.currentUser.role === 'admin';
  }

  logout() {
    this.userService.logout().subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }

  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
