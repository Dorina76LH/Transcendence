import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
	selector: 'app-lang',
	imports: [NavbarComponent],
	template: `
<app-navbar></app-navbar>
<main class="Languages">
	<div class="Content">
		<div>
			<h1>Languages Page</h1>
			<h2>This is the actual languages page, still in progress, but I got the page lol</h2>
			<h3>We'll soon have 3 more languages handled for the project, but for now we only got one</h3>
			<h3>Which is english as you can see.</h3>
		</div>
	</div>
</main>`,
  styleUrl: './languages.css',
})
export class LanguageComponent {}
