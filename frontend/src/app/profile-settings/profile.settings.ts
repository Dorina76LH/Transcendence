import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserService } from '../user.service';


interface UserProfile {
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	avatar_url: string;
}

@Component({
	selector: 'user-profile-settings',
	imports: [FormsModule, CommonModule, NavbarComponent],
	template: `
<app-navbar></app-navbar>
<main class="d-flex justify-content-center py-5" style="min-height: calc(100vh - 56px);">
<div class="card border-secondary p-4" style="width: 450px;">
	<h5 class="mb-4">Profile Settings</h5>
	<div class="text-center mb-4">
		<div class="position-relative d-inline-block">
			<img src="{{MEDIA_URL}}/avatars/kekw.jpg"
				class="rounded-circle border border-secondary"
				style="width:100px; height:100px; object-fit: cover;">
			<button class="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle"
				(click)="avatarInput.click()">
				<i class="fas fa-camera fa-xs"></i>
			</button>
			<input #avatarInput type="file" accept="image/*"
				style="display:none" (change)="onAvatarSelected($event)">
		</div>
		<p class="small mt-2">{{ user.username }}</p>
	</div>
	<div class="mb-3">
		<label class="form-label">First name</label>
		<input class="form-control border-secondary rounded-pill"
			type="text" [(ngModel)]="user.first_name" name="first_name">
	</div>
	<div class="mb-3">
		<label class="form-label">Last name</label>
		<input class="form-control border-secondary rounded-pill"
			type="text" [(ngModel)]="user.last_name" name="last_name">
	</div>
	<div class="mb-3">
		<label class="form-label">Email</label>
		<input class="form-control border-secondary rounded-pill"
			type="email" [(ngModel)]="user.email" name="email">
	</div>
	<div class="mb-3">
		<label class="form-label">Username <span class="small">(cannot be changed)</span></label>
		<input class="form-control border-secondary rounded-pill text-muted"
			type="text" [value]="user.username" disabled>
	</div>

	<div *ngIf="success" class="alert alert-success py-2">Changes saved ✓</div>
	<div *ngIf="error" class="alert alert-danger py-2">{{ error }}</div>

	<div class="d-grid gap-2 mt-2">
		<button class="btn btn-primary rounded-pill"
			(click)="saveProfile()" [disabled]="loading">
			{{ loading ? 'Saving...' : 'Save changes' }}
		</button>
		<button class="btn btn-outline-secondary rounded-pill"
			(click)="router.navigate(['/profile'])">
			Cancel
		</button>
	</div>
</div>
</main>`,
	styleUrl: './profile-settings.css',
})
export class ProfileSettingsComponent implements OnInit {
	user: UserProfile = {
		username: '',
		email: '',
		first_name: '',
		last_name: '',
		avatar_url: '',
	};
	previewUrl = '';
	selectedFile: File | null = null;
	loading = false;
	success = false;
	error = '';

	constructor(public userService: UserService, public router: Router) {}

	ngOnInit() {
		this.userService.getProfile().subscribe({
			next: (data: any) => {
				this.user.username		= data.username   ?? '';
				this.user.email			= data.email      ?? '';
				this.user.first_name	= data.first_name ?? '';
				this.user.last_name		= data.last_name  ?? '';
				this.user.avatar_url	= data.avatar_url ?? '';
			},
			error: () => this.error = 'Failed to load profile.'
		});
	}

	onAvatarSelected(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;
		this.selectedFile = file;
		const reader = new FileReader();
		reader.onload = () => this.previewUrl = reader.result as string;
		reader.readAsDataURL(file);
	}

	saveProfile() {
		this.loading = true;
		this.success = false;
		this.error   = '';

		const formData = new FormData();
		formData.append('email',		this.user.email);
		formData.append('first_name',	this.user.first_name);
		formData.append('last_name',	this.user.last_name);
		if (this.selectedFile) {
			formData.append('avatar',	this.selectedFile);
		}

		this.userService.updateProfile(formData).subscribe({
			next: (data: any) => {
				this.user.avatar_url	= data.avatar_url ?? this.user.avatar_url;
				this.previewUrl			= '';
				this.selectedFile		= null;
				this.success			= true;
				this.loading			= false;
				setTimeout(() => this.success = false, 3000);
			},
			error: (err) => {
				this.error	= err.error?.email?.[0]
							?? err.error?.detail
							?? 'Failed to save changes.';
				this.loading = false;
			}
		});
	}
}