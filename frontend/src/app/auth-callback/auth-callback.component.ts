import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';

@Component({
	selector: 'app-auth-callback',
	imports: [CommonModule, RouterLink],
	template: `
		<div class="d-flex justify-content-center align-items-center" style="min-height: 100vh;">
			<div class="text-center">
				<div *ngIf="error" class="text-danger">
					<p>{{ error }}</p>
					<a routerLink="/login" class="btn btn-secondary mt-3">Back to login</a>
				</div>
				<div *ngIf="!error">
					<div class="spinner-border text-primary mb-3"></div>
					<p class="text-secondary">Logging you in...</p>
				</div>
			</div>
		</div>
	`,
})
export class OAuthCallbackComponent implements OnInit {
	error = '';

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private userService: UserService
	) {}

	ngOnInit() {
		if (localStorage.getItem('token')) {
			this.router.navigate(['/']);
			return;
		}

		const params = this.route.snapshot.queryParamMap;
		const code     = params.get('code');
		const state    = params.get('state');
		const provider = params.get('provider') ?? sessionStorage.getItem('oauth_provider');

		const savedState = sessionStorage.getItem('oauth_state');
		sessionStorage.removeItem('oauth_state');
		sessionStorage.removeItem('oauth_provider');

		if (!savedState || state !== savedState) {
			this.error = 'Authentication session expired or invalid. Please try again.';
			return;
		}

		if (!code || !provider) {
			this.error = 'Missing OAuth parameters.';
			return;
		}

		this.userService.socialLogin(provider, code).subscribe({
			next: (response: any) => {
				localStorage.setItem('token', response.access);
				localStorage.setItem('refresh', response.refresh);
				this.router.navigate(['/']);
			},
			error: () => {
				this.error = 'Authentication failed. Please try again.';
			}
		});
	}
}
