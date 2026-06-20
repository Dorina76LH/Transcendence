import { RouterLink } from "@angular/router";
import { Component } from '@angular/core';

@Component({
	selector: 'app-gdpr',
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

export class GDPRComponent {

}