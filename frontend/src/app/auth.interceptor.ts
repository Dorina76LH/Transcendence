import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, throwError, Subject, take } from 'rxjs';

function getCookie(name: string): string {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
	return '';
}
let isRefreshing = false;
const refreshSubject = new Subject<string>();

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const http = inject(HttpClient);
	const token = localStorage.getItem('token');
	const csrfToken = getCookie('csrftoken');
	const authReq = req.clone({
		headers: req.headers
			.set('Authorization', token ? `Bearer ${token}` : '')
			.set('X-CSRFToken', csrfToken || '')
	});

	if (req.url.includes('/api/auth/token/refresh/')) {
		return next(authReq);
	}

	return next(authReq).pipe(
		catchError((error) => {
			console.log('catchError triggered, status:', error.status);
			if (error.status !== 401) {
				return throwError(() => error);
			}
			// Prevent infinite loops: If the token refresh request itself fails (returns 401),
			// it means the refresh token is expired or invalid.
			// We clear all stored tokens and redirect the user to the login page.
			if (req.url.includes('/api/auth/token/refresh/')) {
				localStorage.removeItem('token');
				localStorage.removeItem('refresh');
				window.location.href = '/login';
				return throwError(() => error);
			}
			const refresh = localStorage.getItem('refresh');
			if (!refresh) {
				return throwError(() => error);
			}
			if (isRefreshing) {
				return refreshSubject.pipe(
					take(1),
					switchMap((newToken) => {
						const retryReq = req.clone({
							headers: req.headers.set('Authorization', `Bearer ${newToken}`)
						});
						return next(retryReq);
					})
				);
			}
			isRefreshing = true;
			console.log('attempting refresh with:', refresh);

			return http.post<any>('/api/auth/token/refresh/', { refresh }).pipe(
				switchMap((response) => {
					console.log('token refreshed:', response);
					localStorage.setItem('token', response.access);
					if (response.refresh) localStorage.setItem('refresh', response.refresh);
					const retryReq = req.clone({
						headers: req.headers.set('Authorization', `Bearer ${response.access}`)
					});
					return next(retryReq);
				}),
				catchError((refreshError) => {
					console.log('refresh failed:', refreshError);
					isRefreshing = false;
					localStorage.removeItem('token');
					localStorage.removeItem('refresh');
					window.location.href = '/login';
					return throwError(() => refreshError);
				})
			);
		})
	);
};
