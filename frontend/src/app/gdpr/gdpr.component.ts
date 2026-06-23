import { RouterLink, Router } from "@angular/router";
import { Component, inject } from '@angular/core';
import { UserService } from '../user.service';

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
			<h1>GDPR Page</h1>
			<h2>This page allows you to manage your data and respect privacy regulations.</h2> 
			<div class="card bg-dark text-light border-secondary p-4 mx-auto" style="max-width: 500px;">
                <p class="small text-muted mb-4">
                    In compliance with the GDPR law, you have the right to download the data we store about your profile, or request its permanent erasure.
                </p>
                <div class="d-flex flex-column gap-3">
                    <button class="btn btn-outline-info" (click)="onExport()">
                        📥 Export My Personal Data (JSON)
                    </button>
                    <button class="btn btn-outline-danger" (click)="onDeleteAccount()">
                        ⚠️ Delete My Account (Right to be Forgotten)
                    </button>
                </div>
            </div>
		</div>
	</div>
</main>`,
styleUrl: 'gdpr.css',
})

export class GDPRComponent {
	private userService = inject(UserService);
    private router = inject(Router);

    onExport() {
        this.userService.exportGdprData().subscribe({
            next: (data: any) => {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `transcendence_export_${data.username || 'user'}.json`;
                link.click();
                window.URL.revokeObjectURL(url);
            },
            error: (err: any) => {
                console.error("Failed to export user data:", err);
                alert("An error occurred during the data export. Make sure you are logged in.");
            }
        });
    }

    onDeleteAccount() {
		console.log('Delete button clicked');

        const firstConfirm = confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.");
        if (!firstConfirm) return;

        const secondConfirm = confirm("FINAL WARNING: This will permanently erase all your profile data, chat history, and matchmaking records. Proceed?");
        if (!secondConfirm) return;

        this.userService.deleteAccount().subscribe({
            next: () => {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                alert("Your account has been successfully deleted. Goodbye!");
                this.router.navigate(['/login']);
            },
            error: (err:any) => {
                console.error("Failed to delete account:", err);
                alert("An error occurred. Your account could not be deleted.");
            }
        });
    }

}