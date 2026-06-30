import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthGuard } from './auth.guard';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, RouterLink, CommonModule],
	template: `
<header>
	<nav class="navbar navbar-expand-lg navbar-dark">
		<div class="container-fluid">
			<a routerLink="/" class="nav-link">
				<strong>TRANSCENDENCE</strong>
			</a>
			<button class="navbar-toggler" type="button" 
						data-bs-toggle="collapse" 
						data-bs-target="#navbar" 
						aria-controls="navbar" 
						aria-expanded="false" 
						aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbar">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-4 ms-4">
					<li class="nav-item hover-underline">
						<a routerLink="/profile" class="nav-link">Profile</a>
					</li>
					<li class="nav-item hover-underline">
						<a routerLink="/settings" class="nav-link">Settings</a>
					</li>
					<li class="nav-item hover-underline">
						<a routerLink="/chat" class="nav-link">Chat</a>
					</li>
					<li class="nav-item hover-underline">
						<a routerLink="/friends" class="nav-link">Friends</a>
					</li>
				</ul>
				<ng-container *ngIf="authGuard.loggedIn(); else notLogged">
					<button (click)="logout()" class="btn btn-danger">Logout</button>
				</ng-container>

				<ng-template #notLogged>
					<button routerLink="/login" class="btn btn-secondary">Login</button>
					<button routerLink="/register" class="btn btn-primary">Register</button>
				</ng-template>
			</div>
		</div>
	</nav>
</header>
<router-outlet />
<footer class="border-top border-secondary mt-auto py-3">
	<div class="container d-flex justify-content-center gap-4">
		<a routerLink="/about" class="text-secondary text-decoration-none">About us</a>
		<a routerLink="/gdpr" class="text-secondary text-decoration-none">GDPR</a>
		<a routerLink="/contact" class="text-secondary text-decoration-none">Contact</a>
	</div>
	<div class="d-flex justify-content-center gap-4">
		<a routerLink="/ppts" class="text-secondary text-decoration-none"> Privacy Policy and Terms of Service </a>
	</div>
</footer>`
})
export class AppComponent {
	constructor(public authGuard: AuthGuard, private router: Router) {}
	
	ngOnInit() {
		if (localStorage.getItem('darkMode') === 'true') {
			document.body.classList.add('dark-mode');
		}
		// add a class when user is logged in so global styles can hide login/register links
		if (localStorage.getItem('token')) {
			document.body.classList.add('logged-in');
		} else {
			document.body.classList.remove('logged-in');
		}
	}

	logout() {
		localStorage.removeItem('token');
		localStorage.removeItem('refresh');
		this.router.navigate(['/login']);
	}
}
