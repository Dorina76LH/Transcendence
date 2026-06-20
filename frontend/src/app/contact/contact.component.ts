import { RouterLink } from "@angular/router";
import { Component } from "@angular/core";

@Component ({
	selector: 'app-chat',
	imports: [RouterLink],
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
					<a routerLink="/login" class="btn btn-secondary">Login</a>
					<a routerLink="/register" class="btn btn-primary">Register</a>
				</div>
			</div>
		</div>
	</nav>
</header>
<main>
	<div class="Content">
		<h4>Well I think this page is made for the user to contact the people that made this project, so I mean</h4>
		<h4>Here's my email : lpatin@student.42lehavre.fr </h4>
	</div>
</main>`,
styleUrl: './contact.css'
})

export class ContactComponent {

}