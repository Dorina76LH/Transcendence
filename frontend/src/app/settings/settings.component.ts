import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
	selector: 'user-settings',
	imports: [FormsModule, CommonModule, NavbarComponent],
	template: `
<app-navbar></app-navbar>
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
		</div>

		<!-- 2FA SECTION -->
		<div class="twofa-section">
			<h2>Two-Factor Authentication (2FA)</h2>

			<span *ngIf="profileLoading" class="spinner-border spinner-border-sm me-2"></span>

			<p *ngIf="twoFaMessage" class="text-success">{{ twoFaMessage }}</p>
			<p *ngIf="twoFaError" class="text-danger">{{ twoFaError }}</p>

			<ng-container *ngIf="!profileLoading && !is2faEnabled">
				<ng-container *ngIf="!qrCode">
					<button class="btn btn-primary" [disabled]="setupLoading" (click)="startTwoFaSetup()">
						<span *ngIf="setupLoading" class="spinner-border spinner-border-sm me-2"></span>
						Enable 2FA
					</button>
				</ng-container>

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
	is2faEnabled = false;
	profileLoading = true;
	qrCode: string | null = null;
	otpCode = '';
	twoFaMessage = '';
	twoFaError = '';
	totpSeconds = 30;
	setupLoading = false;
	confirmLoading = false;
	private totpTimer: any;

	constructor(private userService: UserService, private router: Router, private cdr: ChangeDetectorRef) {}

	ngOnInit() {
		document.body.classList.toggle('dark-mode', this.isDarkMode);
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
	}

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
