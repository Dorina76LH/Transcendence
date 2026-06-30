import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
	selector: 'user-profile',
	imports: [CommonModule, NavbarComponent],
	template: `
<app-navbar></app-navbar>
<main class="Profile">
	<div class="card border-secondary p-4" style="width: 450px;">
		<h2 class="text-center mb-4">Profile overview</h2>
		<div class="text-center mb-4">
			<img [src]="profile?.avatar_url || 'Zoliac.png'" class="rounded-circle border border-secondary" style="width:100px; height:100px; object-fit: cover;">
		</div>
		<div class="mb-3">
			<label class="form-label">Username</label>
			<p>{{ profile?.username || '...' }}</p>
		</div>
		<div class="mb-3">
			<label class="form-label">Email</label>
			<p>{{ profile?.email || '...' }}</p>
		</div>
		<p class="text-danger text-center" *ngIf="errorMessage">{{ errorMessage }}</p>
	</div>
</main>`,
	styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
	profile: any = null;
	errorMessage = '';

	constructor(private userService: UserService, private router: Router, private cdr: ChangeDetectorRef) {}

	ngOnInit() {
		this.userService.getProfile().subscribe({
			next: (data: any) => {
				this.profile = data;
				this.cdr.detectChanges();
			},
			error: (err) => {
				this.errorMessage = 'Unable to load profile';
				this.cdr.detectChanges();
			}
		});
	}
}
