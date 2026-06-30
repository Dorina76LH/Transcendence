import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-lang',
	imports: [NavbarComponent, CommonModule],
	template: `
<app-navbar></app-navbar>
	<main>
		<div class="p-4">
			<h4 class="mb-1">Language</h4>
			<p class="mb-4 allign-items-center justify-content-center" style="font-size: 0.9rem;">Choose your preferred language.</p>
			<div class="d-flex flex-row gap-2 justify-content-center" style="max-width: 500px;">
				<button class="btn d-flex align-items-center gap-3 border border-secondary text-start"
					[class.btn-secondary]="selectedLang === 'en'"
					[class.btn-outline-secondary]="selectedLang !== 'en'"
					(click)="selectedLang = 'en'">
					<span style="font-size: 1.4rem;">🇬🇧</span>
					<span>English</span>
					<span *ngIf="selectedLang === 'en'" class="ms-auto">✓</span>
				</button>
				<button class="btn d-flex align-items-center gap-3 border border-secondary text-start">
					<span style="font-size: 1.4rem;">🇫🇷</span>
					<span>Français</span>
				</button>
				<button class="btn d-flex align-items-center gap-3 border border-secondary text-start">
					<span style="font-size: 1.4rem;">🇪🇸</span>
					<span>Español</span>
				</button>
			</div>
		</div>
	</main>`,
  styleUrl: './languages.css',
})
export class LanguageComponent {
	selectedLang = 'en';
}
