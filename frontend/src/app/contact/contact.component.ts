import { Component } from "@angular/core";
import { NavbarComponent } from '../navbar/navbar.component';

@Component ({
	selector: 'app-chat',
	imports: [NavbarComponent],
	template: `
<app-navbar></app-navbar>
<main>
	<div class="Content">
		<h4>Well I think this page is made for the user to contact the people that made this project, so I mean</h4>
		<h4>Here's my email : lpatin@student.42lehavre.fr </h4>
	</div>
</main>`,
	styleUrl: './contact.css'
})
export class ContactComponent {}
