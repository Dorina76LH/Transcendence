import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
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

@Component ({
	selector: "app-root",
	imports: [CommonModule, NavbarComponent],
	template: `
<app-navbar></app-navbar>
<main class="d-flex justify-content-center py-5" style="min-height: calc(100vh - 56px);">
	<div class="card border-secondary p-4 w-100" style="max-width: 1000px;">
		<h4 class="mb-3">Friend list</h4>
		<div *ngIf="loading">Loading...</div>
		<div *ngIf="error" class="text-danger">{{ error }}</div>
		<div class="d-flex flex-column gap-2" *ngIf="!loading && !error">
			<div *ngFor="let friendship of friends" class="position-relative">
				<button class="btn d-flex align-items-center w-100 border border-secondary rounded"
					(click)="toggleMenu(friendship)">
					<div class="rounded-circle bg-secondary me-3 flex-shrink-0" style="width:40px;height:40px;"></div>
						<span class="fw-semibold">{{ friendship.friend.username }}</span>
						<span class="ms-auto">
							<span class="badge bg-secondary rounded-circle" style="width:10px;height:10px;display:inline-block;"></span>
						</span>
				</button>
				<div *ngIf="selectedFriend?.id === friendship.id" class="card border-secondary p-2" style="z-index: 100; position: auto; right: auto; width: auto;">
					<div class="d-flex flex-column gap-1 justify-content-center align-items-center">
						<button class="btn btn-sm btn-outline-light text-start" (click)="action('profile', friendship)">
							👤 View profile
						</button>
						<button class="btn btn-sm btn-outline-primary text-start" (click)="action('chat', friendship)">
							💬 Send message
						</button>
						<button class="btn btn-sm btn-outline-warning text-start" (click)="action('block', friendship)">
							🚫 Block Friend
						</button>
						<button class="btn btn-sm btn-outline-danger text-start" (click)="action('remove', friendship)">
							❌ Remove friend
						</button>
				</div>
			</div>
		</div>
		<div *ngIf="friends.length === 0" class="text-muted">
			Aucun ami pour le moment.
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

    constructor(private userService: UserService, private router: Router) {}

    ngOnInit() {
        this.userService.getUserFriends().subscribe({
            next: (data: any) => {
                this.friends = data.results ?? data;
                this.loading = false;
            },
            error: (err) => {
                this.error = "Internal error : Cannot load friends.";
                this.loading = false;
                console.error(err);
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
