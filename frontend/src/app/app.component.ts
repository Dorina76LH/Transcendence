import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, RouterLink],
	template: `<router-outlet />
		<footer class="border-top border-secondary mt-auto py-3">
			<div class="container d-flex justify-content-center gap-4">
				<a routerLink="/about" class="text-secondary text-decoration-none">About us</a>
				<a routerLink="/gdpr" class="text-secondary text-decoration-none">GDPR</a>
				<a routerLink="/contact" class="text-secondary text-decoration-none">Contact</a>
			</div>
		</footer>`
})
export class AppComponent {
	ngOnInit() {
		if (localStorage.getItem('darkMode') === 'true') {
			document.body.classList.add('dark-mode');
		}
	}
}
