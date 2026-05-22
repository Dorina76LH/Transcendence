import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private url = '/api';

  constructor(private http: HttpClient) {}

  updateProfile(userData: any) {
    return this.http.patch(`${this.url}/user/update/`, userData);
  }

  login(email: string, password: string) {
    return this.http.post(`${this.url}/auth/login/`, { email, password });
  }

  register(firstName: string, surname: string, email: string, password: string) {
    return this.http.post(`${this.url}/auth/register/`, { firstName, surname, email, password });
  }

    getProfile() {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.url}/profile/`, {headers: { Authorization: `Bearer ${token}` }});
  }
}
