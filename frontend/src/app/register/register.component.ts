import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
	selector: 'user-register',
	imports: [FormsModule, CommonModule, NavbarComponent],
	template: `
<app-navbar></app-navbar>
	<main class="d-flex justify-content-center align-items-center" style="min-height: calc(100vh - 56px);">
		<div class="card border-secondary p-4" style="max-width:450px; width: 100%;">
			<h2 class="text-center mb-4">Register</h2>
			
			<form (ngSubmit)="register()">
				<div class="mb-3">
					<label class="form-label">Username</label>
					<input class="form-control border-secondary rounded-pill"
							type="text" placeholder="Enter your username"
							[(ngModel)]="username" name="username">
				</div>
				<div class="mb-3">
					<label class="form-label">Email</label>
					<input class="form-control border-secondary rounded-pill"
							type="email" placeholder="Enter your email"
							[(ngModel)]="email" name="email">
				</div>
				<div class="mb-3">
					<label class="form-label">Password</label>
					<input class="form-control border-secondary rounded-pill"
							type="password" placeholder="Enter your password"
							[(ngModel)]="password" name="password">
				</div>
				<div class="mb-3">
					<label class="form-label">Confirm password</label>
					<input class="form-control border-secondary rounded-pill"
							type="password" placeholder="Confirm your password"
							[(ngModel)]="confirmPassword" name="confirmPassword">
				</div>
				
				<p class="text-danger text-center" *ngIf="errorMessage">{{ errorMessage }}</p>
				<p class="text-success text-center" *ngIf="successMessage">{{ successMessage }}</p>
				
				<div class="d-grid mt-4">
					<button type="submit" class="btn btn-primary rounded-pill">Register</button>
				</div>
			</form>
		</div>
	</main>`,
styleUrl: './register.css',
})
export class RegisterComponent {
	email = '';
	username = '';
	password = '';
	confirmPassword = '';
	errorMessage = '';
	successMessage = '';

	constructor(private userService: UserService, private router: Router) {}

	register() {
		if (this.password !== this.confirmPassword) {
			this.errorMessage = 'Passwords do not match.';
			return;
		}
		this.userService.register(this.username, this.email, this.password).subscribe({
			next: (response: any) => {
				localStorage.setItem('token', response.access);
				localStorage.setItem('refresh', response.refresh);
				this.router.navigate(['/profile']);
			},
			error: (err: any) => {
				//console.log('register error:', err.error);
				this.errorMessage = 'Registration failed. Please try again.';
			}
		});
	}
}