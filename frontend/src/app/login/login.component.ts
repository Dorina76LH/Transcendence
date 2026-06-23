import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'user-login',
	imports: [FormsModule, CommonModule],
	template: `
<body>
	<main class="d-flex justify-content-center align-items-center" style="min-height: calc(100vh - 56px);">
		<div class="card border-secondary p-4" style="width: 450px;">
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
					<button type="submit" class="btn btn-primary rounded-pill">Login</button>
				</div>
			</form>
		</div>
	</main>
</body>`,
styleUrl: './login.css',
})
export class LoginComponent {
	email = '';
	password = '';
	errorMessage = '';

	constructor(private userService: UserService, private router: Router) {}

	login() {
		this.userService.login(this.email, this.password).subscribe({
			next: (response: any) => {
				localStorage.setItem('token', response.access);
				localStorage.setItem('refresh', response.refresh);
				this.router.navigate(['/']);
			},
			error: (err: any) => {
				this.errorMessage = 'Incorrect email or password.';
			}
		});
	}
}
