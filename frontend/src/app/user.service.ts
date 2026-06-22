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

	setup2FA() {
		return this.http.post(`${this.url}/auth/2fa/setup/`, {});
	}

	enable2FA(otpCode: string) {
		return this.http.post(`${this.url}/auth/2fa/enable/`, { otp_code: otpCode });
	}

	disable2FA(otpCode: string) {
		return this.http.post(`${this.url}/auth/2fa/disable/`, { otp_code: otpCode });
	}

	verify2FA(preAuthToken: string, otpCode: string) {
		return this.http.post(`${this.url}/auth/2fa/verify/`, { pre_auth_token: preAuthToken, otp_code: otpCode });
	}
	refreshToken() {
		const refresh = localStorage.getItem('refresh');
		return this.http.post(`${this.url}/auth/token/refresh/`, { refresh });
	}
}