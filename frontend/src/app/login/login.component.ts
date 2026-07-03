import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { environment } from '../../environments/environment';

@Component({
	selector: 'user-login',
	imports: [FormsModule, CommonModule, NavbarComponent],
template: `
<app-navbar></app-navbar>
<main class="d-flex justify-content-center align-items-center" style="min-height: calc(100vh - 56px);">
	<div class="card border-secondary p-4" style="width: 450px;">

		<ng-container *ngIf="!requires2fa">
		<h2 class="text-center mb-4">Login</h2>
		
		<form (ngSubmit)="login()">
			<div class="mb-3">
				<label class="form-label">Email</label>
				<input class="form-control border-secondary rounded-pill"
						type="email"
						placeholder="Enter your email"
						[(ngModel)]="email" name="email">
			</div>
			<div class="mb-3">
				<label class="form-label">Password</label>
				<input class="form-control border-secondary rounded-pill"
						type="password"
						placeholder="Enter your password"
						[(ngModel)]="password" name="password">
			</div>
			<p class="text-danger text-center" *ngIf="errorMessage">{{ errorMessage }}</p>
			<div class="d-grid mt-4">
				
				<button type="submit" class="btn btn-primary rounded-pill" [disabled]="loading">
					<span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
					Login
				</button>
				
			</div>
		</form>

		<div class="d-flex align-items-center my-3">
			<hr class="flex-grow-1">
			<span class="mx-2 text-secondary" style="font-size: 0.85rem;">or</span>
			<hr class="flex-grow-1">
		</div>

		<div class="d-grid gap-2">
			<button type="button" class="btn btn-outline-secondary rounded-pill" (click)="loginWithGoogle()">
				Login with Google
			</button>
			<button type="button" class="btn btn-outline-secondary rounded-pill" (click)="loginWith42()">
				Login with 42
			</button>
		</div>
		</ng-container>

		<ng-container *ngIf="requires2fa">
			<h2 class="text-center mb-2">Two-Factor Authentication</h2>
			<p class="text-center text-secondary mb-4" style="font-size: 0.9rem;">Enter the 6-digit code from your authenticator app.</p>
			
			<form (ngSubmit)="verify2FA()">
				<div class="mb-3">
					<label class="form-label">Authentication code</label>
					<input id="otpInput"
							class="form-control border-secondary rounded-pill text-center"
							type="text"
							inputmode="numeric"
							placeholder="000000"
							maxlength="6"
							[(ngModel)]="otpCode" name="otpCode"
							(input)="filterDigits($event)"> <div class="text-center mt-2">
						<small [class]="totpSeconds <= 5 ? 'text-danger' : 'text-secondary'">
							Code expires in {{ totpSeconds }}s
						</small>
					</div>
				</div>
				<p class="text-danger text-center" *ngIf="errorMessage">{{ errorMessage }}</p>
				<div class="d-grid mt-4">
					<button type="submit" class="btn btn-primary rounded-pill" [disabled]="loading">
						<span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
						Verify
					</button>
				</div>
				<div class="text-center mt-3">
					<button type="button" class="btn btn-link btn-sm text-secondary" (click)="backToLogin()">Back to login</button>
				</div>
			</form>
		</ng-container>

	</div>
</main>`,
	styleUrl: './login.css',
})
export class LoginComponent implements OnDestroy {
	email = '';
	password = '';
	otpCode = '';
	errorMessage = '';
	loading = false;
	requires2fa = false;
	totpSeconds = 30;
	private preAuthToken = '';
	private totpTimer: any;

	constructor(private userService: UserService, private router: Router, private cdr: ChangeDetectorRef) {}

	ngOnDestroy() {
		clearInterval(this.totpTimer);
	}

	filterDigits(event: Event) {
		const input = event.target as HTMLInputElement;
		input.value = input.value.replace(/\D/g, '').slice(0, 6);
		this.otpCode = input.value;
	}

	private startTotpTimer() {
		this.totpSeconds = 30 - (Math.floor(Date.now() / 1000) % 30);
		this.totpTimer = setInterval(() => {
			this.totpSeconds = 30 - (Math.floor(Date.now() / 1000) % 30);
		}, 1000);
	}

	login() {
		this.errorMessage = '';
		this.loading = true;
		this.userService.login(this.email, this.password).subscribe({
			next: (response: any) => {
				this.loading = false;
				if (response.requires_2fa && response.pre_auth_token) {
					this.preAuthToken = response.pre_auth_token;
					this.requires2fa = true;
					this.cdr.detectChanges();
					this.startTotpTimer();
					setTimeout(() => document.getElementById('otpInput')?.focus(), 0);
				} else {
					localStorage.setItem('token', response.access);
					localStorage.setItem('refresh', response.refresh);
					localStorage.setItem('user', JSON.stringify(response.user));
					if (response.user?.role === 'admin') {
						this.router.navigate(['/admin-panel']);
					} else {
						this.router.navigate(['/']);
					}
				}
			},
			error: () => {
				this.loading = false;
				this.errorMessage = 'Email ou mot de passe incorrect.';
			}
		});
	}

	verify2FA() {
		this.errorMessage = '';
		this.loading = true;
		this.userService.verify2FA(this.preAuthToken, this.otpCode).subscribe({
			next: (response: any) => {
				this.loading = false;
				clearInterval(this.totpTimer);
				localStorage.setItem('token', response.access);
				localStorage.setItem('refresh', response.refresh);
				this.router.navigate(['/']);
			},
			error: (err: any) => {
				this.loading = false;
				if (err.status === 401) {
					clearInterval(this.totpTimer);
					this.preAuthToken = '';
					this.requires2fa = false;
					this.errorMessage = 'Session expired. Please log in again.';
				} else {
					this.errorMessage = 'Invalid or expired code. Please try again.';
				}
				this.cdr.detectChanges();
			}
		});
	}

	backToLogin() {
		clearInterval(this.totpTimer);
		this.requires2fa = false;
		this.preAuthToken = '';
		this.otpCode = '';
		this.errorMessage = '';
		this.loading = false;
	}

	private redirectOAuth(provider: string, authUrl: string) {
		const state = crypto.randomUUID();
		sessionStorage.setItem('oauth_state', state);
		sessionStorage.setItem('oauth_provider', provider);
		window.location.href = authUrl + `&state=${state}`;
	}

	loginWithGoogle() {
		const url = `https://accounts.google.com/o/oauth2/v2/auth`
			+ `?client_id=${environment.googleClientId}`
			+ `&redirect_uri=${encodeURIComponent(environment.oauthRedirectUri)}`
			+ `&response_type=code`
			+ `&scope=${encodeURIComponent('email profile')}`;
		this.redirectOAuth('google', url);
	}

	loginWith42() {
		const url = `https://api.intra.42.fr/oauth/authorize`
			+ `?client_id=${environment.fortyTwoClientId}`
			+ `&redirect_uri=${encodeURIComponent(environment.oauthRedirectUri)}`
			+ `&response_type=code`;
		this.redirectOAuth('42', url);
	}
}
