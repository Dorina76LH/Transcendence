import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { NavbarComponent } from '../navbar/navbar.component';

export interface FriendUser {
    id: number;
    username: string;
    email: string;
}

export interface Friendship {
    id: number;
    friend: FriendUser;
    created_at: string;
}

interface SearchUser { id: number; username: string; }

@Component ({
	selector: "app-root",
	imports: [CommonModule, FormsModule, NavbarComponent],
	template: `
<app-navbar></app-navbar>
<main class="friends-main">
	<div class="friends-container">

		<!-- Section recherche -->
		<div class="section">
			<h5 class="section-title">Add Friend</h5>
			<div class="search-row">
				<input
					class="search-input"
					[(ngModel)]="searchQuery"
					(ngModelChange)="onSearchInput()"
					(keyup.enter)="searchUsers()"
					placeholder="Search a username...">
				<button class="btn-search" (click)="searchUsers()" [disabled]="searchQuery.length < 1">
					Search
				</button>
			</div>
			<div *ngIf="searchError" class="search-error">{{ searchError }}</div>

			<div *ngIf="searchResults.length > 0" class="search-results">
				<div *ngFor="let user of searchResults" class="result-item">
					<div class="user-avatar">{{ user.username.charAt(0).toUpperCase() }}</div>
					<span class="user-name">{{ user.username }}</span>
					<button
						class="btn-add"
						[class.sent]="requestSent[user.id]"
						[disabled]="requestSent[user.id]"
						(click)="addFriend(user)">
						{{ requestSent[user.id] ? '✓ Sent' : '+ Add' }}
					</button>
				</div>
			</div>
			<div *ngIf="searchResults.length === 0 && searched && searchQuery.length >= 2" class="no-results">
				Aucun utilisateur trouvé.
			</div>
		</div>

		<div class="divider"></div>

		<!-- Liste d'amis -->
		<div class="section">
			<h5 class="section-title">My friends</h5>
			<div *ngIf="loading" class="state-text">Chargement...</div>
			<div *ngIf="error" class="state-text error">{{ error }}</div>
			<div class="friends-list" *ngIf="!loading && !error">
				<div *ngFor="let friendship of friends" class="friend-wrapper">
					<button class="friend-item" (click)="toggleMenu(friendship)"
						[class.active]="selectedFriend?.id === friendship.id">
						<div class="user-avatar">{{ friendship.friend.username.charAt(0).toUpperCase() }}</div>
						<span class="user-name">{{ friendship.friend.username }}</span>
						<span class="status-dot"></span>
					</button>
					<div *ngIf="selectedFriend?.id === friendship.id" class="friend-menu">
						<button class="menu-btn" (click)="action('profile', friendship)">👤 View profile</button>
						<button class="menu-btn" (click)="action('chat', friendship)">💬 Send message</button>
						<button class="menu-btn warn" (click)="action('block', friendship)">🚫 Block Friend</button>
						<button class="menu-btn danger" (click)="action('remove', friendship)">❌ Remove friend</button>
					</div>
				</div>
				<div *ngIf="friends.length === 0" class="state-text">
					No friends yet.
				</div>
			</div>
		</div>
	</div>
</main>`,
	styleUrl: "./friends.css",
})
export class FriendsComponent implements OnInit {
    friends: Friendship[] = [];
    selectedFriend: Friendship | null = null;
    loading = true;
    error = '';

    searchQuery = '';
    searchResults: SearchUser[] = [];
    searchError = '';
    searched = false;
    requestSent: { [id: number]: boolean } = {};

    constructor(private userService: UserService, private router: Router) {}

    ngOnInit() {
        this.userService.getUserFriends().subscribe({
            next: (data: any) => {
                this.friends = data.results ?? data;
                this.friends.forEach(f => this.requestSent[f.friend.id] = true);
                this.loading = false;
            },
            error: (err: any) => {
                this.error = "Internal error : Cannot load friends.";
                this.loading = false;
                console.error(err);
            }
        });
        this.userService.getSentFriendRequests().subscribe({
            next: (requests: any) => {
                const list = requests.results ?? requests;
                list.forEach((r: any) => this.requestSent[r.to_user?.id ?? r.to_user_id] = true);
            },
            error: () => {}
        });
	}

    onSearchInput() {
        if (this.searchQuery.length < 1) {
            this.searchResults = [];
            this.searched = false;
            this.searchError = '';
        }
    }

    searchUsers() {
        if (this.searchQuery.length < 1) return;
        this.searchError = '';
        this.searched = false;
        this.userService.searchUsers(this.searchQuery).subscribe({
            next: (results: SearchUser[]) => {
                this.searchResults = results;
                this.searched = true;
            },
            error: () => {
                this.searchError = 'Error during search.';
            }
        });
    }

    addFriend(user: SearchUser) {
        this.userService.sendFriendRequest(user.id).subscribe({
            next: () => {
                this.requestSent[user.id] = true;
                this.searchError = '';
            },
            error: (err: any) => {
                const msg = err?.error?.to_user_id?.[0] || err?.error?.detail || 'Erreur lors de l\'envoi.';
                const alreadyDone = ['Pending request already exists.', 'You are already friends.', 'Friend request already accepted.'];
                if (alreadyDone.some(m => msg.includes(m))) {
                    this.requestSent[user.id] = true;
                    this.searchError = '';
                } else {
                    this.searchError = msg;
                }
            }
        });
    }

    toggleMenu(friendship: Friendship) {
        this.selectedFriend = this.selectedFriend?.id === friendship.id ? null : friendship;
    }

    action(type: string, friendship: Friendship) {
        switch (type) {
            case 'profile':
                this.router.navigate(['/profile', friendship.friend.id]);
                break;
            case 'chat':
                this.router.navigate(['/chat'], { queryParams: { with: friendship.friend.id } });
                break;
            case 'block':
                console.log('block', friendship.friend.id);
                break;
            case 'remove':
                console.log('remove friendship', friendship.id);
                break;
        }
        this.selectedFriend = null;
    }
}
