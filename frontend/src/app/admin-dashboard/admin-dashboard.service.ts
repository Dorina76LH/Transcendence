import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TopActiveUser {
  id: number;
  username: string;
  email: string;
  messages_count: number;
}

export interface MessagesByDay {
  date: string;
  count: number;
}

export interface UserStatus {
  label: string;
  value: number;
}

export interface DateRange {
  start_date: string;
  end_date: string;
}

export interface AdminDashboard {
  date_range: DateRange;
  generated_at: string;
  total_users: number;
  online_users: number;
  offline_users: number;
  total_conversations: number;
  total_messages: number;
  messages_today: number;
  messages_in_range: number;
  new_users_in_range: number;
  total_friendships: number;
  pending_friend_requests: number;
  top_active_users: TopActiveUser[];
  messages_by_day: MessagesByDay[];
  user_status: UserStatus[];
}

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {
  private url = '/api/analytics/admin-dashboard/';

  constructor(private http: HttpClient) {}

  getDashboard(startDate?: string, endDate?: string): Observable<AdminDashboard> {
    const token = localStorage.getItem('token');
    let params = new HttpParams();

    if (startDate) {
      params = params.set('start_date', startDate);
    }

    if (endDate) {
      params = params.set('end_date', endDate);
    }

    return this.http.get<AdminDashboard>(this.url, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
  }
}
