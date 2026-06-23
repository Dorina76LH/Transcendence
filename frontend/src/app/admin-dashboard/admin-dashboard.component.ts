import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, timer } from 'rxjs';
import { AdminDashboard, AdminDashboardService } from './admin-dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule],
  template: `
    <section class="AdminDashboard">
      <div class="dashboard-header">
        <div>
          <h1>Admin dashboard</h1>
          <p *ngIf="dashboard">Last update: {{ dashboard.generated_at }}</p>
        </div>

        <div class="admin-actions">
          <button class="btn btn-secondary" type="button" (click)="exportCsv()">Export CSV</button>
          <button class="btn btn-secondary" type="button" (click)="exportPdf()">Export PDF</button>
        </div>
      </div>

      <form class="filters card border-secondary p-3" (ngSubmit)="applyFilters()">
        <label>
          Start date
          <input class="form-control" type="date" name="startDate" [(ngModel)]="startDate" />
        </label>

        <label>
          End date
          <input class="form-control" type="date" name="endDate" [(ngModel)]="endDate" />
        </label>

        <label class="auto-refresh">
          <input
            type="checkbox"
            name="autoRefresh"
            [(ngModel)]="autoRefresh"
            (change)="toggleAutoRefresh()"
          />
          Auto-refresh
        </label>

        <button class="btn btn-primary" type="submit">Apply filters</button>
      </form>

      <p *ngIf="initialLoading">Loading...</p>
      <p *ngIf="refreshing && dashboard">Updating dashboard...</p>
      <p class="text-danger" *ngIf="errorMessage">{{ errorMessage }}</p>

      <ng-container *ngIf="dashboard">
        <div class="dashboard-grid">
          <div class="card border-secondary p-3" *ngFor="let stat of statCards">
            <h5>{{ stat.label }}</h5>
            <h2>{{ stat.value }}</h2>
          </div>
        </div>

        <div class="charts-grid">
          <div class="card border-secondary p-4">
            <h2>Messages by day</h2>
            <svg class="line-chart" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline [attr.points]="getLinePoints()"></polyline>
            </svg>
            <div class="chart-labels">
              <span *ngFor="let point of dashboard.messages_by_day">
                {{ point.date }}: {{ point.count }}
              </span>
            </div>
          </div>

          <div class="card border-secondary p-4">
            <h2>Top active users</h2>
            <div class="bar-row" *ngFor="let user of dashboard.top_active_users">
              <span>{{ user.username }}</span>
              <div class="bar-track">
                <div class="bar-fill" [style.width]="getUserBarWidth(user.messages_count)">
                  {{ user.messages_count }}
                </div>
              </div>
            </div>
            <p *ngIf="dashboard.top_active_users.length === 0">No active users yet.</p>
          </div>

          <div class="card border-secondary p-4">
            <h2>Users status</h2>
            <div class="pie-chart" [style.background]="getPieGradient()"></div>
            <p>Online: {{ dashboard.online_users }}</p>
            <p>Offline: {{ dashboard.offline_users }}</p>
          </div>
        </div>
      </ng-container>
    </section>
  `,
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  dashboard: AdminDashboard | null = null;
  initialLoading = true;
  refreshing = false;
  errorMessage = '';
  startDate = '';
  endDate = '';
  autoRefresh = true;
  statCards: Array<{ label: string; value: number }> = [];
  private refreshSubscription: Subscription | null = null;

  constructor(private adminDashboardService: AdminDashboardService) {}

  ngOnInit() {
    this.setDefaultDates();
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
  }

  setDefaultDates() {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 6);
    this.startDate = this.formatDate(start);
    this.endDate = this.formatDate(today);
  }

  formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  applyFilters() {
    this.loadDashboard();
  }

  toggleAutoRefresh() {
    if (this.autoRefresh) {
      this.startAutoRefresh();
    } else {
      this.stopAutoRefresh();
    }
  }

  startAutoRefresh() {
    this.stopAutoRefresh();
    this.refreshSubscription = timer(0, 10000).subscribe(() => {
      this.loadDashboard();
    });
  }

  stopAutoRefresh() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
      this.refreshSubscription = null;
    }
  }

  loadDashboard() {
    if (this.dashboard) {
      this.refreshing = true;
    } else {
      this.initialLoading = true;
    }
    this.errorMessage = '';

    this.adminDashboardService.getDashboard(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.dashboard = data;
        this.statCards = [
          { label: 'Total users', value: data.total_users },
          { label: 'Online users', value: data.online_users },
          { label: 'Messages today', value: data.messages_today },
          { label: 'Messages in range', value: data.messages_in_range },
          { label: 'New users in range', value: data.new_users_in_range },
          { label: 'Friendships', value: data.total_friendships },
          { label: 'Pending requests', value: data.pending_friend_requests },
        ];
        this.initialLoading = false;
        this.refreshing = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load admin dashboard.';
      this.initialLoading = false;
      this.refreshing = false;
      },
    });
  }

  getLinePoints(): string {
    const points = this.dashboard?.messages_by_day ?? [];

    if (points.length === 0) {
      return '';
    }

    const max = Math.max(...points.map((point) => point.count), 1);

    return points
      .map((point, index) => {
        const x = points.length === 1 ? 50 : (index / (points.length - 1)) * 100;
        const y = 90 - (point.count / max) * 80;
        return `${x},${y}`;
      })
      .join(' ');
  }

  getTopUserMax(): number {
    const users = this.dashboard?.top_active_users ?? [];
    return Math.max(...users.map((user) => user.messages_count), 1);
  }

  getUserBarWidth(messagesCount: number): string {
    return `${(messagesCount / this.getTopUserMax()) * 100}%`;
  }

  getPieGradient(): string {
    if (!this.dashboard || this.dashboard.total_users === 0) {
      return 'conic-gradient(#6c757d 0deg 360deg)';
    }

    const onlineDegrees = (this.dashboard.online_users / this.dashboard.total_users) * 360;
    return `conic-gradient(#198754 0deg ${onlineDegrees}deg, #6c757d ${onlineDegrees}deg 360deg)`;
  }

  exportCsv() {
    if (!this.dashboard) {
      return;
    }

    const rows = [
      ['Metric', 'Value'],
      ['Total users', this.dashboard.total_users],
      ['Online users', this.dashboard.online_users],
      ['Offline users', this.dashboard.offline_users],
      ['Total messages', this.dashboard.total_messages],
      ['Messages today', this.dashboard.messages_today],
      ['Messages in range', this.dashboard.messages_in_range],
      ['New users in range', this.dashboard.new_users_in_range],
      ['Total friendships', this.dashboard.total_friendships],
      ['Pending friend requests', this.dashboard.pending_friend_requests],
    ];

    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'admin-dashboard.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  exportPdf() {
    window.print();
  }
}
