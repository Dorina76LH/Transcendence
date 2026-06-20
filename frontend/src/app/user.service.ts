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
		return this.http.get(`${this.url}/admin/`, {headers : {isAdmin: 'adminState'}} );
	}

	getUserFriends() {
		return this.http.get(`${this.url}/friends/`);
	}

	logout() {
		const refresh = localStorage.getItem('refresh');
		return this.http.post(`${this.url}/auth/logout/`, { refresh });
	}
	refreshToken() {
		const refresh = localStorage.getItem('refresh');
		return this.http.post(`${this.url}/auth/token/refresh/`, { refresh });
	}
}