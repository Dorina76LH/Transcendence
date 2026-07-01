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
	avatar_url?: string;
}

export interface Friendship {
	id: number;
	friend: FriendUser;
	created_at: string;
}

export interface FriendRequest {
	id: number;
	from_user: FriendUser;
	to_user: FriendUser;
	status: string;
}

interface SearchUser {
	id: number;
	username: string;
	avatar_url?: string;
}

@Component({
	selector: "app-friends",
	imports: [CommonModule, NavbarComponent, FormsModule],
	template: `
<app-navbar></app-navbar>
	<main class="d-flex justify-content-center py-5" style="min-height: calc(100vh - 56px);">
		<div class="card border-secondary p-4 w-100" style="max-width: 1000px;">
			
			<h4 class="mb-3">Friend list</h4>
			<div *ngIf="loading">Loading...</div>
			<div *ngIf="error" class="text-danger">{{ error }}</div>
			<div class="d-flex flex-column gap-2" *ngIf="!loading && !error">
				<div *ngFor="let friendship of friends" class="mb-2">
					<div class="d-flex align-items-center w-100 border border-secondary rounded p-2 bg-dark">
						<div class="d-flex align-items-center flex-grow-1" (click)="toggleMenu(friendship)" style="cursor: pointer;">
							
							<img [src]="friendship.friend.avatar_url || 'Zoliac.png'" 
								 class="rounded-circle border border-secondary me-3 flex-shrink-0" 
								 style="width:40px; height:40px; object-fit: cover;">
							
							<span class="fw-semibold text-white">{{ friendship.friend.username }}</span>
						</div>
						<span class="me-3">
							<span class="badge rounded-circle bg-success" style="width:10px;height:10px;display:inline-block;"></span>
						</span>
						<div *ngIf="selectedFriend?.id === friendship.id" class="d-flex gap-1 align-items-center animate__animated animate__fadeIn">
							<button class="btn btn-sm btn-outline-primary" (click)="action('chat', friendship)">💬 Chat</button>
							<button class="btn btn-sm btn-outline-danger" (click)="action('remove', friendship)">❌ Remove</button>
						</div>
						<button *ngIf="selectedFriend?.id !== friendship.id" class="btn btn-sm btn-outline-secondary" (click)="toggleMenu(friendship)">
							⚙️ Actions
						</button>
					</div>
				</div>
				<div *ngIf="friends.length === 0">You don't have any friends right now.</div>
			</div>
			
			<hr class="border-secondary my-4">
			
			<h4 class="mb-3">Add a friend</h4>
			<div class="section">
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
						
						<img [src]="user.avatar_url || 'Zoliac.png'" 
							 class="rounded-circle border border-secondary me-2" 
							 style="width:40px; height:40px; object-fit: cover;">
						
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
					No users found.
				</div>
			</div>
			
			<hr class="border-secondary my-4">
			
			<h4 class="mb-3">Received requests</h4>
			<div *ngIf="receivedRequests.length === 0" class="mb-2">No pending requests.</div>
			<div class="d-flex flex-column gap-2">
				<div *ngFor="let req of receivedRequests"
					class="d-flex align-items-center justify-content-between border border-secondary rounded p-2">
					<div class="d-flex align-items-center">
						
						<img [src]="req.from_user.avatar_url || 'Zoliac.png'" 
							 class="rounded-circle border border-secondary me-3" 
							 style="width:40px; height:40px; object-fit: cover;">
						
						<span class="fw-semibold">{{ req.from_user.username }}</span>
					</div>
					<div class="d-flex gap-2">
						<button class="btn btn-sm btn-outline-success" (click)="acceptRequest(req)">✓ Accept</button>
						<button class="btn btn-sm btn-outline-danger" (click)="declineRequest(req)">✗ Decline</button>
					</div>
				</div>
			</div>
			
			<hr class="border-secondary my-4">
			
			<h4 class="mb-3">Sent requests</h4>
			<div *ngIf="sentRequests.length === 0">No pending sent requests.</div>
			<div class="d-flex flex-column gap-2">
				<div *ngFor="let req of sentRequests"
					class="d-flex align-items-center justify-content-between border border-secondary rounded p-2">
					<div class="d-flex align-items-center">
						
						<img [src]="req.to_user.avatar_url || 'Zoliac.png'" 
							 class="rounded-circle border border-secondary me-3" 
							 style="width:40px; height:40px; object-fit: cover;">
						
						<span class="fw-semibold">{{ req.to_user.username }}</span>
					</div>
					<button class="btn btn-sm btn-outline-secondary" (click)="cancelRequest(req)">✗ Cancel</button>
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

	receivedRequests: FriendRequest[] = [];
	sentRequests: FriendRequest[] = [];

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

		this.loadReceivedRequests();
		this.loadSentRequests();
	}

	loadReceivedRequests() {
		this.userService.getReceivedFriendRequests().subscribe({
			next: (data: any) => this.receivedRequests = data.results ?? data,
			error: (err : any) => console.error(err)
		});
	}

	loadSentRequests() {
		this.userService.getSentFriendRequests().subscribe({
			next: (data: any) => {
				this.sentRequests = data.results ?? data;
				this.sentRequests.forEach(r => this.requestSent[r.to_user?.id] = true);
			},
			error: (err : any) => console.error(err)
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
			next: (results: any) => {
				this.searchResults = results.results ?? results;
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
				this.loadSentRequests();
			},
			error: (err: any) => {
				const msg = err?.error?.to_user_id?.[0] || err?.error?.detail || 'Error while sending request.';
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

	acceptRequest(req: FriendRequest) {
		this.userService.acceptFriendRequest(req.id).subscribe({
			next: () => {
				this.receivedRequests = this.receivedRequests.filter(r => r.id !== req.id);
				this.userService.getUserFriends().subscribe({
					next: (data: any) => {
						this.friends = data.results ?? data;
						this.friends.forEach(f => this.requestSent[f.friend.id] = true);
					}
				});
			},
			error: (err : any) => console.error(err)
		});
	}

	declineRequest(req: FriendRequest) {
		this.userService.declineFriendRequest(req.id).subscribe({
			next: () => this.receivedRequests = this.receivedRequests.filter(r => r.id !== req.id),
			error: (err : any) => console.error(err)
		});
	}

	cancelRequest(req: FriendRequest) {
		this.userService.cancelFriendRequest(req.id).subscribe({
			next: () => {
				this.sentRequests = this.sentRequests.filter(r => r.id !== req.id);
				const req_id = this.sentRequests.find(r => r.id === req.id)?.to_user?.id;
				if (req_id) delete this.requestSent[req_id];
			},
			error: (err : any) => console.error(err)
		});
	}

	toggleMenu(friendship: Friendship) {
		this.selectedFriend = this.selectedFriend?.id === friendship.id ? null : friendship;
	}

	action(type: string, friendship: Friendship) {
		switch (type) {
			case 'chat':
				this.router.navigate(['/chat'], { queryParams: { with: friendship.friend.id } });
				break;
			case 'remove':
				this.userService.removeFriend(friendship.friend.id).subscribe({
					next: () => {
						this.friends = this.friends.filter(f => f.id !== friendship.id);
						delete this.requestSent[friendship.friend.id];
					},
					error: (err : any) => console.error(err)
				});
				break;
		}
		this.selectedFriend = null;
	}
}