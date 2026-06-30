import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthGuard } from './auth.guard';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, RouterLink, CommonModule],
	template: `
<router-outlet />
<footer class="border-top border-secondary mt-auto py-3">
	<div class="container d-flex justify-content-center gap-4">
		<a routerLink="/about" class="text-secondary text-decoration-none">About us</a>
		<a routerLink="/gdpr" class="text-secondary text-decoration-none">GDPR</a>
		<a routerLink="/contact" class="text-secondary text-decoration-none">Contact</a>
	</div>
	<div class="d-flex justify-content-center gap-4">
		<a routerLink="/ppts" class="text-secondary text-decoration-none"> Privacy Policy and Terms of Service </a>
	</div>
</footer>`
})
export class AppComponent {
	constructor(public authGuard: AuthGuard, private router: Router) {}
	
	ngOnInit() {
		if (localStorage.getItem('darkMode') === 'true') {
			document.body.classList.add('dark-mode');
		}
		// add a class when user is logged in so global styles can hide login/register links
		if (localStorage.getItem('token')) {
			document.body.classList.add('logged-in');
		} else {
			document.body.classList.remove('logged-in');
		}
	}

	logout() {
		localStorage.removeItem('token');
		localStorage.removeItem('refresh');
		this.router.navigate(['/login']);
	}
}
