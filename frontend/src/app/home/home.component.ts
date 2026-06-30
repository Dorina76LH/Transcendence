import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
	selector: 'app-home',
	imports: [NavbarComponent],
	template: `
<app-navbar></app-navbar>
<main class="main">
	<div class="content">
		<div class="d-flex flex-column align-items-center text-center px-4" style="max-width: 900px; margin: auto;">
			<img src="favicon.ico" style="min-height: calc(20vh - 56px);">
			<h1>Welcome to our <b><i>Transcendence</i></b> project !</h1>
			<h2 class="mt-4">This project is the biggest project of the common core in the 42 shcool, one of the last projects.</h2>
			<h4 class="mt-3"><i>Transcendence</i> is a group project, which is intended to boost our
				creativity, self-confidence, adaptability to new technologies, and teamwork skills.</h4>
			<h4 class="mt-3">In this project, the main goal is to make a website, which is made by mixing frontend and backend abilities.</h4>
			<h4 class="mt-2">For the frontend, we used Angular, a framework to make a website that is communicating with the backend easily.</h4>
			<h4 class="mt-2">This framework is mainly used for its ability to make components, which are the pages themselves
				for this project, since the structure of a page in this project is written inside of a component.</h4>
			<h4 class="mt-2">For the backend, we used the Django framework, which is a framework that is using the python
				language. We mainly used Django for the communication between the database and the frontend, also, we have
				an admin panel that is used to monitor everything on the website.</h4>
			<h4 class="mt-2">Also, we used a framework for the database that is PostGreSQL, that allows us to have a panel,
				that makes us able to add new tables and new values to the table with a graphical
				 user interface, which makes work even easier.</h4>
			<h4 class="mt-2">This project's goal is to make a completely working chat between 2 users, that are friends,
				making a fully working login and register system, and making a complete profile customization and overview
				system, which makes the website user friendly, easy to use, and instinctive.</h4>
		</div>
	</div>
</main>`,
	styleUrl: './home.css'
})
export class HomeComponent {}
