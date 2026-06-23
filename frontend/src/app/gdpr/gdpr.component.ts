import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
	selector: 'app-gdpr',
	imports: [NavbarComponent],
	template: `
<app-navbar></app-navbar>
<main class="Languages">
	<div class="Content">
		<div>
			<h1>gdpr Page</h1>
			<h2>This page will make the user be able to delete their data, so that we respect the GDPR law.</h2>
		</div>
	</div>
</main>`,
	styleUrl: 'gdpr.css',
})
export class GDPRComponent {}
