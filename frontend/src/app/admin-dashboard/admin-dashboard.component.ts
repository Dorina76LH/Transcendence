import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminDashboard, AdminDashboardService } from './admin-dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  template: ` <main class="AdminDashboard">
    <section class="dashboard-wrapper">
      <h1>Admin dashboard</h1>

      <p *ngIf="loading">Loading...</p>
      <p class="text-danger" *ngIf="errorMessage">{{ errorMessage }}</p>

      <ng-container *ngIf="dashboard && !loading">
        <div class="dashboard-grid">
          <div class="card border-secondary p-3" *ngFor="let stat of statCards">
            <h5>{{ stat.label }}</h5>
            <h2>{{ stat.value }}</h2>
          </div>
        </div>

        <div class="card border-secondary p-4 mt-4">
          <h2>Top active users</h2>
          <table class="table table-dark table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Messages</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of dashboard.top_active_users">
                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.messages_count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-container>
    </section>
  </main>`,
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboardComponent implements OnInit {
  dashboard: AdminDashboard | null = null;
  loading = true;
  errorMessage = '';
  statCards: Array<{ label: string; value: number }> = [];

  constructor(private adminDashboardService: AdminDashboardService) {}

  ngOnInit() {
    this.adminDashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard = data;
        this.statCards = [
          { label: 'Total users', value: data.total_users },
          { label: 'Online users', value: data.online_users },
          { label: 'Conversations', value: data.total_conversations },
          { label: 'Messages', value: data.total_messages },
          { label: 'Messages today', value: data.messages_today },
          { label: 'Friendships', value: data.total_friendships },
          { label: 'Pending requests', value: data.pending_friend_requests },
        ];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load admin dashboard.';
        this.loading = false;
      },
    });
  }
}
