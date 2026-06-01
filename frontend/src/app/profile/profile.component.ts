import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';

@Component({
	selector: 'user-profile',
	imports: [RouterLink, CommonModule],
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
<main class="Profile">
	<div class="card border-secondary p-4" style="width: 450px;">
		<h2 class="text-center mb-4">Profile overview</h2>
		<div class="text-center mb-4">
			<img [src]="profile?.avatar || 'Zoliac.png'" class="rounded-circle border border-secondary" style="width:100px; height:100px; object-fit: cover;">
		</div>
		<div class="mb-3">
			<label class="form-label">Username</label>
			<p class="text-white">{{ profile?.username || '...' }}</p>
		</div>
		<div class="mb-3">
			<label class="form-label">Email</label>
			<p class="text-white">{{ profile?.email || '...' }}</p>
		</div>
		<div class="mb-3">
			<label class="form-label">Biography</label>
			<p class="text-white">{{ profile?.biography || '...' }}</p>
		</div>
		<p class="text-danger text-center" *ngIf="errorMessage">{{ errorMessage }}</p>
	</div>
</main>`,
styleUrl: './profile.css',
})
export class ProfileComponent {
	profile: any = null;
	errorMessage = '';

	constructor(private userService: UserService) {}

	ngOnInit() {
		this.userService.getProfile().subscribe({
			next: (data: any) => {
				this.profile = data;
			},
			error: (err) => {
				this.errorMessage = 'Unable to load profile';
			}
		});
	}
}
