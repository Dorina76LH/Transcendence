import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';

@Component({
	selector: 'user-register',
	imports: [RouterLink, FormsModule, CommonModule],
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
				<div class="d-flex gap-2">
					<a routerLink="/login" class="btn btn-secondary">Login</a>
					<a routerLink="/register" class="btn btn-primary">Register</a>
				</div>
			</div>
		</div>
	</nav>
</header>
<main class="d-flex justify-content-center align-items-center" style="min-height: calc(100vh - 56px);">
	<div class="card border-secondary p-4" style="width: 450px;">
		<h2 class="text-center mb-4">Register</h2>
		<div class="mb-3">
			<label class="form-label">First name</label>
			<input class="form-control border-secondary rounded-pill"
					type="text" placeholder="Enter your first name"
					[(ngModel)]="firstName">
		</div>
		<div class="mb-3">
			<label class="form-label">Surname</label>
			<input class="form-control border-secondary rounded-pill"
					type="text" placeholder="Enter your surname"
					[(ngModel)]="surname">
		</div>
		<div class="mb-3">
			<label class="form-label">Username</label>
			<input class="form-control border-secondary rounded-pill"
					type="text" placeholder="Enter your surname"
					[(ngModel)]="username">
		</div>
		<div class="mb-3">
			<label class="form-label">Email</label>
			<input class="form-control border-secondary rounded-pill"
					type="email" placeholder="Enter your email"
					[(ngModel)]="email">
		</div>
		<div class="mb-3">
			<label class="form-label">Password</label>
			<input class="form-control border-secondary rounded-pill"
					type="password" placeholder="Enter your password"
					[(ngModel)]="password">
		</div>
		<p class="text-danger text-center" *ngIf="errorMessage">{{ errorMessage }}</p>
		<p class="text-success text-center" *ngIf="successMessage">{{ successMessage }}</p>
		<div class="d-grid mt-4">
			<button (click)="register()" class="btn btn-primary rounded-pill">Register</button>
		</div>
	</div>
</main>`,
styleUrl: './register.css',
})
	export class RegisterComponent {
	firstName = '';
	surname = '';
	email = '';
	username = '';
	password = '';
	errorMessage = '';
	successMessage = '';

	constructor(private userService: UserService, private router: Router) {}

	register() {
		this.userService.register(this.firstName, this.surname, this.email, this.password).subscribe({
		next: (response: any) => {
			localStorage.setItem('token', response.access);
			localStorage.setItem('refresh', response.refresh);
			this.router.navigate(['/profile']);
		},
		error: (err : any) => {
			console.log('register error:', err.error);
			this.errorMessage = 'Registration failed. Please try again.';
		}
		});
	}
	}
