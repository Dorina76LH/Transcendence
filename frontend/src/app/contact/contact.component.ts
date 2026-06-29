import { Component } from "@angular/core";

@Component ({
	selector: 'app-contact',
	imports: [],
	template: `
<body>
	<main>
		<div class="Content" style="max-width=450px;">
			<h4>This page is for the people that have a problem, or<br> 
				that want to contact us about an issue on the website.</h4>
			<h4>User interface issue : <br>
				lpatin@student.42lehavre.fr </h4>
			<h4>Contact : <br>
				doberes@student.42lehavre.fr</h4>
			<h4>Other : <br>
				aeudes@student.42lehavre.fr <br>
				llangana@student.42lehavre.fr <br>
				jvega@student.42lehavre.fr</h4>
		</div>
	</main>
</body>`,
styleUrl: './contact.css'
})

export class ContactComponent {

}