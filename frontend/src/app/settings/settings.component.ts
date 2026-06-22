import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';

import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// gives access to *ngIf
// CommonModule no longer needed with Angular 17+ @if syntax

// gives access to [(ngModel)]
import { FormsModule } from '@angular/forms';

// for our services with setup2FA, enable2FA etc.
import { UserService } from '../user.service';

@Component({
	selector: 'user-settings',
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
<main class="Settings">
	<div class="Content">
		<div>
			<h1>Settings Page</h1>
			<h2>This is the actual settings page, still in progress, but I got the page lol</h2>
			<p>Languages setting page :</p>
			<a routerLink="/languages" class="btn btn-secondary">🇪🇸 / 🇫🇷 / 🇬🇧</a>
			<button class="btn btn-secondary me-3" (click)="toggleDarkMode()">
				{{ isDarkMode ? ' ☀️ ' : ' 🌙 ' }}
			</button>
			<!-- <a routerLink="/profile-settings" class="btn btn-secondary"> ⚙️ </a> -->
		</div>

		<!-- 2FA SECTION -->
		<div class="twofa-section">
			<h2>Two-Factor Authentication (2FA)</h2>

			<span *ngIf="profileLoading" class="spinner-border spinner-border-sm me-2"></span>

			<!-- Success / error messages -->
			<p *ngIf="twoFaMessage" class="text-success">{{ twoFaMessage }}</p>
			<p *ngIf="twoFaError" class="text-danger">{{ twoFaError }}</p>

			<!-- 2FA is NOT enabled : show activation flow -->
			<ng-container *ngIf="!profileLoading && !is2faEnabled">

				<!-- Step 1 : button to generate QR code -->
				<ng-container *ngIf="!qrCode">
					<button class="btn btn-primary" [disabled]="setupLoading" (click)="startTwoFaSetup()">
						<span *ngIf="setupLoading" class="spinner-border spinner-border-sm me-2"></span>
						Enable 2FA
					</button>
				</ng-container>

				<!-- Step 2 : QR code displayed after clicking "Enable 2FA" -->
				<ng-container *ngIf="qrCode">
					<p>Scan this QR code with Google Authenticator :</p>
					<img [src]="qrCode" alt="QR Code 2FA" width="200" />

					<div class="mt-3">
						<input
							type="text"
							inputmode="numeric"
							[(ngModel)]="otpCode"
							placeholder="Enter 6-digit code"
							maxlength="6"
							class="form-control w-auto d-inline-block me-2"
							(input)="filterDigits($event)"
						/>
						<button class="btn btn-success" [disabled]="confirmLoading" (click)="confirmEnableTwoFa()">
							Confirm
						</button>
					</div>
					<small [class]="totpSeconds <= 5 ? 'text-danger' : 'text-secondary'">
						Code expires in {{ totpSeconds }}s
					</small>
				</ng-container>
			</ng-container>

			<!-- 2FA IS enabled : show deactivation flow -->
			<ng-container *ngIf="!profileLoading && is2faEnabled">
				<p class="text-success">2FA is currently active on your account.</p>
				<div class="mt-2">
					<input
						type="text"
						inputmode="numeric"
						[(ngModel)]="otpCode"
						placeholder="Enter 6-digit code to disable"
						maxlength="6"
						class="form-control w-auto d-inline-block me-2"
						(input)="filterDigits($event)"
					/>
					<button class="btn btn-danger" (click)="confirmDisableTwoFa()">
						Disable 2FA
					</button>
				</div>
				<small [class]="totpSeconds <= 5 ? 'text-danger' : 'text-secondary'">
					Code expires in {{ totpSeconds }}s
				</small>
			</ng-container>
		</div>

	</div>
</main>`,
styleUrl: './settings.css',
encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit, OnDestroy {
	isDarkMode = localStorage.getItem('darkMode') === 'true';

	// --- 2FA state ---
	is2faEnabled = false; // 2FA is active on this account ?
	profileLoading = true; // true until getProfile() completes (prevents premature enable click)
	qrCode: string | null = null; // received image, code QR(base64) received de 2fa/setup/
	otpCode = ''; //  // 6 digit code, typed by user
	twoFaMessage = ''; // success message
	twoFaError = ''; // error message
	totpSeconds = 30;
	setupLoading = false;
	confirmLoading = false;
	private totpTimer: any;

	// In settings.component.ts, we wanna use UserServices'methodes like setup2FA()
	// we need to create an instance of Userservice for this.
	// instead of doing it manually we inject dependencies.
	// angular has an automatical system which handles this for us.
	// we just need to declare what we need within the parameters of constructor.
	constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}

	ngOnInit() {
		document.body.classList.toggle('dark-mode', this.isDarkMode);

		// Fetch current profile to know if 2FA is already enabled
		this.userService.getProfile().subscribe({
			next: (user: any) => {
				this.is2faEnabled = user.is_2fa_enabled;
				this.profileLoading = false;
				if (this.is2faEnabled) this.startTotpTimer();
				this.cdr.detectChanges();
			},
			error: () => {
				this.profileLoading = false;
				this.cdr.detectChanges();
			}
		});
	}

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

	toggleDarkMode() {
		this.isDarkMode = !this.isDarkMode;
		localStorage.setItem('darkMode', String(this.isDarkMode));
		document.body.classList.toggle('dark-mode', this.isDarkMode);
		console.log("The website is now on darkmode");
	}

	// Step 1: ask the server for a QR code to scan
	// we delete the old success message if there is one
	// we delete the old error message if there is one
	// we send the POST /2fa/setup/ request to the server
	// next:(..) The server's answer
	// we store the the received QR code to display it on the HTML
	startTwoFaSetup() {
		this.twoFaMessage = '';
		this.twoFaError = '';
		this.setupLoading = true;
		this.userService.setup2FA().subscribe({
			next: (res: any) => {
				this.qrCode = res.qr_code;
				this.setupLoading = false;
				this.startTotpTimer();
				this.cdr.detectChanges();
			},
			error: () => {
				this.setupLoading = false;
				this.twoFaError = 'Could not start 2FA setup.';
				this.cdr.detectChanges();
			}
		});
	}

	// Step 2: confirm the code from the authenticator app
	// deletes the old success message
	// deletes the old error message
	// sends POST /2fa/enable/ with the typed code by user
	confirmEnableTwoFa() {
		this.twoFaMessage = '';
		this.twoFaError = '';
		this.confirmLoading = true;
		this.userService.enable2FA(this.otpCode).subscribe({
			next: () => {
				this.is2faEnabled = true;
				this.qrCode = null;
				this.otpCode = '';
				this.confirmLoading = false;
				this.twoFaMessage = '2FA successfully enabled.';
				this.cdr.detectChanges();
			},
			error: () => {
				this.confirmLoading = false;
				this.twoFaError = 'Invalid or expired code.';
				this.cdr.detectChanges();
			}
		});
	}

	// Disable 2FA (requires a valid code too)
	// why the branches : next ? error ?
	// a http request can have 2 issues 
		// the server answered successfully 
		// the server answered with an error 
	// its like the frontend version of try/except in python/django
	confirmDisableTwoFa() {
		this.twoFaMessage = '';
		this.twoFaError = '';
		this.userService.disable2FA(this.otpCode).subscribe({
			next: () => {
				this.is2faEnabled = false;
				this.otpCode = '';
				this.twoFaMessage = '2FA successfully disabled.';
				clearInterval(this.totpTimer);
				this.cdr.detectChanges();
			},
			error: () => {
				this.twoFaError = 'Invalid or expired code.';
				this.cdr.detectChanges();
			}
		});
	}
}