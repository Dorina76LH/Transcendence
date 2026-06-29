import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
	private url = '/api';

	constructor(private http: HttpClient) {}

	updateProfile(userData: any) {
		return this.http.patch(`${this.url}/auth/me/`, userData);
	}

	login(email: string, password: string) {
		return this.http.post(`${this.url}/auth/login/`, { email, password });
	}

	register(firstName: string, surname: string, email: string, password: string) {
		return this.http.post(`${this.url}/auth/register/`, { firstName, surname, email, password });
	}

	getProfile() {
		return this.http.get(`${this.url}/auth/me/`);
	}

	getAdmin() {
		return this.http.get(`${this.url}/admin/`, { headers: { isAdmin: 'adminState' } });
	}

	logout() {
		const refresh = localStorage.getItem('refresh');
		return this.http.post(`${this.url}/auth/logout/`, { refresh });
	}

	refreshToken() {
		const refresh = localStorage.getItem('refresh');
		return this.http.post(`${this.url}/auth/token/refresh/`, { refresh });
	}

	getUserFriends() {
		return this.http.get(`${this.url}/friends/friends/`);
	}

	removeFriend(friendUserId: number) {
		return this.http.delete(`${this.url}/friends/${friendUserId}/`);
	}

	searchUsers(query: string) {
		return this.http.get(`${this.url}/users/search/?q=${query}`);
	}

	sendFriendRequest(toUserId: number) {
		return this.http.post(`${this.url}/friends/friend-requests/sent/`, { to_user_id: toUserId });
	}

	getReceivedFriendRequests() {
		return this.http.get(`${this.url}/friends/friend-requests/received/`);
	}

	getSentFriendRequests() {
		return this.http.get(`${this.url}/friends/friend-requests/sent/`);
	}

	acceptFriendRequest(requestId: number) {
		return this.http.post(`${this.url}/friends/friend-requests/${requestId}/accept/`, {});
	}

	declineFriendRequest(requestId: number) {
		return this.http.post(`${this.url}/friends/friend-requests/${requestId}/reject/`, {});
	}

	cancelFriendRequest(requestId: number) {
		return this.http.delete(`${this.url}/friends/friend-requests/${requestId}/cancel/`);
	}
}