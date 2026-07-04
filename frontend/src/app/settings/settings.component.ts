import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
	selector: 'user-settings',
	imports: [CommonModule, NavbarComponent, FormsModule, RouterLink],
	template: `
<app-navbar></app-navbar>
<main class="Settings">
	<div class="d-flex flex-column flex-md-row" style="min-height: calc(100vh - 56px);">
		
		<div class="p-3 w-100 style-sidebar" style="max-width: 100%;">
			<h6 class="text-uppercase mb-3 d-none d-md-block" style="font-size: 0.75rem; letter-spacing: 0.1em;">Settings</h6>
			
			<ul class="nav flex-row flex-md-column gap-1 pb-3 pb-md-0 border-bottom border-md-bottom-0 border-md-end border-secondary pe-0 pe-md-3 overflow-x-auto flex-nowrap">
				<li class="nav-item flex-grow-1 flex-md-grow-0">
					<button class="btn btn-sm w-100 text-start text-md-start text-center" 
						[class.btn-secondary]="activeTab === 'appearance'"
						[class.btn-outline-secondary]="activeTab !== 'appearance'"
						(click)="activeTab = 'appearance'">🌙<span class="d-none d-sm-inline"> Appearance</span></button>
				</li>
				<li class="nav-item flex-grow-1 flex-md-grow-0">
					<button class="btn btn-sm w-100 text-start text-md-start text-center"
						[class.btn-secondary]="activeTab === 'account'"
						[class.btn-outline-secondary]="activeTab !== 'account'"
						(click)="activeTab = 'account'">👤<span class="d-none d-sm-inline"> Account</span></button>
				</li>
				<li class="nav-item flex-grow-1 flex-md-grow-0">
					<button class="btn btn-sm w-100 text-start text-md-start text-center"
						[class.btn-secondary]="activeTab == '2fa'"
						[class.btn-outline-secondary]="activeTab !== '2fa'"
						(click)="activeTab = '2fa'">📝​<span class="d-none d-sm-inline"> 2fa</span></button>
				</li>
			</ul>
		</div>
		
		<div class="p-4 flex-grow-1">
			<div *ngIf="activeTab === 'appearance'">
				<h4 class="mb-3">Appearance</h4>
				<div class="d-flex align-items-center gap-3">
					<span>Dark mode</span>
					<button class="btn btn-secondary" (click)="toggleDarkMode()">
						{{ isDarkMode ? '☀️ Light' : '🌙 Dark' }}
					</button>
				</div>
			</div>
			
			<div *ngIf="activeTab === 'language'">
			  <h4 class="mb-3">Language</h4>
			  <a routerLink="/languages" class="btn btn-secondary">🇪🇸 / 🇫🇷 / 🇬🇧</a>
			</div>
			
			<div *ngIf="activeTab === 'account'">
				<h4 class="mb-3">Account</h4>
				<a routerLink="/profile-settings" class="btn btn-primary">User profile settings</a>
			</div>
			
			<div *ngIf="activeTab == '2fa'">
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
							<img [src]="qrCode" alt="QR Code 2FA" class="img-fluid mb-2" style="max-width: 200px;" />

							<div class="mt-3 d-flex flex-column flex-sm-row gap-2 align-items-stretch align-items-sm-center">
								<input
									type="text"
									inputmode="numeric"
									[(ngModel)]="otpCode"
									placeholder="Enter 6-digit code"
									maxlength="6"
									class="form-control w-100 w-sm-auto"
									(input)="filterDigits($event)"
									(keyup.enter)="confirmEnableTwoFa()"
								/>
								<button class="btn btn-success w-100 w-sm-auto" [disabled]="confirmLoading" (click)="confirmEnableTwoFa()">
									Confirm
								</button>
							</div>
							<div class="mt-1">
								<small [class]="totpSeconds <= 5 ? 'text-danger' : 'text-secondary'">
									Code expires in {{ totpSeconds }}s
								</small>
							</div>
						</ng-container>
					</ng-container>

					<ng-container *ngIf="!profileLoading && is2faEnabled">
						<p class="text-success">2FA is currently active on your account.</p>
						<div class="mt-2 d-flex flex-column flex-sm-row gap-2 align-items-stretch align-items-sm-center">
							<input
								type="text"
								inputmode="numeric"
								[(ngModel)]="otpCode"
								placeholder="Enter 6-digit code to disable"
								maxlength="6"
								class="form-control w-100 w-sm-auto"
								(input)="filterDigits($event)"
								(keyup.enter)="confirmDisableTwoFa()"
							/>
							<button class="btn btn-danger w-100 w-sm-auto" (click)="confirmDisableTwoFa()">
								Disable 2FA
							</button>
						</div>
						<div class="mt-1">
							<small [class]="totpSeconds <= 5 ? 'text-danger' : 'text-secondary'">
								Code expires in {{ totpSeconds }}s
							</small>
						</div>
					</ng-container>
				</div>
			</div>
		</div>
	</div>
</main>`,
styleUrl: './settings.css',
encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit, OnDestroy {
	activeTab = 'appearance';
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
