import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
	selector: 'app-chat',
	imports: [RouterLink, CommonModule],
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
					<ng-container *ngIf="!isLoggedIn">
						<a routerLink="/login" class="btn btn-secondary">Login</a>
						<a routerLink="/register" class="btn btn-primary">Register</a>
					</ng-container>
				</div>
			</div>
		</div>
	</nav>
</header>
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

export class AboutComponent {
	isLoggedIn = !!localStorage.getItem('token');

}