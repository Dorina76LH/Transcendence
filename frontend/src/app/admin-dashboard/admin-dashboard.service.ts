import { Injectable } from '@angular/core';
import { HTTPClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TopActiveUser {
	id: number;
	username : string;
	email : string;
	messages_count : number;
}

export interface AdminDashboard {
	total_users: number;
	online_users: number;
	total_conversation: number;
	total_messages: number;
	messages_today: number;
	total_friendships: number;
	pending_friend_request: number;
	top_active_users: TopActiveUser[];
}

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {
  private url = '/api/analytics/admin-dashboard/';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<AdminDashboard> {
    const token = localStorage.getItem('token');
    return this.http.get<AdminDashboard>(this.url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}