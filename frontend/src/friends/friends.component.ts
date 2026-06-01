import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component ({
	selector: "app-root",
	imports: [RouterLink, CommonModule],
	template: `
<header>
	<nav class="navbar navbar-expand-lg navbar-dark">
		<div class="container-fluid">
			<a routerLink="/" class="nav-link"><strong>TRANSCENDENCE</strong></a>
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
					<li class="nav-item"><a routerLink="/profile" class="nav-link">Profile</a></li>
					<li class="nav-item"><a routerLink="/settings" class="nav-link">Settings</a></li>
					<li class="nav-item"><a routerLink="/chat" class="nav-link">Chat</a></li>
					<li class="nav-item"><a routerLink="/friends" class="nav-link">Friends</a></li>
				</ul>
				<div class="d-flex gap-2">
					<a routerLink="/login" class="btn btn-secondary">Login</a>
					<a routerLink="/register" class="btn btn-primary">Register</a>
				</div>
			</div>
		</div>
	</nav>
</header>
<main class="d-flex justify-content-center py-5" style="min-height: calc(100vh - 56px);">
	<div class="card border-secondary p-4 w-100" style="max-width: 1000px;">
		<h4 class="mb-3">Friend list</h4>
		<div class="d-flex flex-column gap-2">
			<div *ngFor="let friend of friends" class="position-relative">
				<button class="btn d-flex align-items-center w-100 border border-secondary rounded"
							(click)="toggleMenu(friend)">
					<div class="rounded-circle bg-secondary me-3 flex-shrink-0" style="width:40px;height:40px;"></div>
					<span class="fw-semibold">{{ friend }}</span>
					<span class="ms-auto">
						<span class="badge bg-success rounded-circle" style="width:10px;height:10px;display:inline-block;"></span>
					</span>
				</button>
				<div *ngIf="selectedFriend === friend"
						class="card border-secondary p-2"
						style="z-index: 100; position: auto; right: auto; width: auto;">
					<div class="d-flex flex-column gap-1 justify-content-center align-items-center">
						<button class="btn btn-sm btn-outline-light text-start" (click)="action('profile', friend)">
							👤 View profile
						</button>
						<button class="btn btn-sm btn-outline-primary text-start" (click)="action('chat', friend)">
							💬 Send message
						</button>
						<button class="btn btn-sm btn-outline-warning text-start" (click)="action('block', friend)">
							🚫 Block Friend
						</button>
						<button class="btn btn-sm btn-outline-danger text-start" (click)="action('remove', friend)">
							❌ Remove friend
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>`,
styleUrl: "./friends.css",
})

export class FriendsComponent {
  friends = ['Friend 1', 'Friend 2', 'Friend 3', 'Friend 4', 'Friend 5'];
  selectedFriend = '';

  toggleMenu(friend: string) {
    this.selectedFriend = this.selectedFriend === friend ? '' : friend;
  }

  action(type: string, friend: string) {
    console.log(`Action: ${type} on ${friend}`);
    this.selectedFriend = '';
  }
}