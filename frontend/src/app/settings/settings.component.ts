import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'user-settings',
	imports: [RouterLink, CommonModule],
	template: `
<body>
	<main class="Settings">
		<div class="d-flex" style="min-height: calc(100vh - 56px);">
			<!-- Volet gauche -->
			<div class="border-end border-secondary pe-3 pt-3" style="width: 220px; min-width: 220px;">
				<h6 class="text-uppercase mb-3" style="font-size: 0.75rem; letter-spacing: 0.1em;">Settings</h6>
				<ul class="nav flex-column gap-1">
					<li class="nav-item">
						<button class="btn btn-sm w-100 text-start" 
							[class.btn-secondary]="activeTab === 'appearance'"
							[class.btn-outline-secondary]="activeTab !== 'appearance'"
							(click)="activeTab = 'appearance'">🌙 Appearance</button>
					</li>
					<li class="nav-item">
						<button class="btn btn-sm w-100 text-start"
							[class.btn-secondary]="activeTab === 'language'"
							[class.btn-outline-secondary]="activeTab !== 'language'"
							(click)="activeTab = 'language'">🌐 Language</button>
					</li>
					<li class="nav-item">
						<button class="btn btn-sm w-100 text-start"
							[class.btn-secondary]="activeTab === 'account'"
							[class.btn-outline-secondary]="activeTab !== 'account'"
							(click)="activeTab = 'account'">👤 Account</button>
					</li>
				</ul>
			</div>
			<!-- Contenu droite -->
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
					<p class="text-muted">Account settings coming soon...</p>
				</div>
			</div>
		</div>
	</main>
</body>`,
styleUrl: './settings.css',
encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit {
	activeTab = 'appearance';
	isDarkMode = localStorage.getItem('darkMode') === 'true';
	ngOnInit() {
		document.body.classList.toggle('dark-mode', this.isDarkMode);
	}
	toggleDarkMode() {
		this.isDarkMode = !this.isDarkMode;
		localStorage.setItem('darkMode', String(this.isDarkMode));
		document.body.classList.toggle('dark-mode', this.isDarkMode);
		console.log("The website is now on darkmode");
	}
}