import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';

@Component({
	selector: 'user-register',
	imports: [FormsModule, CommonModule],
	template: `
<body>
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
	</main>
</body>`,
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
