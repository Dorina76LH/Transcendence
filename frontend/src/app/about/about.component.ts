import { Component } from "@angular/core";
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
	selector: 'app-chat',
	imports: [NavbarComponent],
	template: `
<app-navbar></app-navbar>
<main>
	<div class="content">
		<h3>This transcendence project was made by a group of 5 people :</h3>
		<h4>-Jeffrey Vega (jvega)</h4>
		<h4>-Dorina Béres (doberes)</h4>
		<h4>-Léo Langanay (llangana)</h4>
		<h4>-Ada Eudes (aeudes)</h4>
		<h4>-Leny Patin (lpatin)</h4>
		<div class="border-top">
			<br>
			<h3>The role of each of us : </h3>
			<h4>-Jeffrey was doing all of the chat components on the backend <br>
				He basically was the technical lead of the project.</h4>
			<h4>-Dorina was on the backend, she worked on the database and she was<br>
				 the project manager.</h4>
			<h4>-Léo was on the DevOPs part, which is making the infrastructure <br>
				of the project, he was the Product Owner.</h4>
			<h4>-Ada did a bit of the DevOPs part, and also worked on the database</h4>
			<h4>-Lény has done all of the frontend, the GUI, the pages, the text</h4>
		</div>
		<div class="border-top">
		<br>
		<h4>We all worked together to make a good website for our project, we did everything to make <br>
			all components work together, to make them communicate smoothly and without errors</h4>
		</div>
	</div>
</main>`,
	styleUrl: './about.css'
})
export class AboutComponent {}
