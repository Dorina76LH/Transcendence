import { Component } from "@angular/core";
import { ViewportScroller } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
	selector: 'app-ppts',
	imports: [NavbarComponent],
	template: `
	<app-navbar></app-navbar>
	<main class="terms-container">
		<div class="logo-container">
			<div class="logo-icon"></div>
		</div>
		<header class="terms-header">
			<h1>TERMS AND CONDITIONS</h1>
			<p class="last-updated">Last updated: <strong>June 15, 2026</strong></p>
		</header>
		<hr>
		<section class="terms-section">
			<h2>AGREEMENT TO OUR LEGAL TERMS</h2>
			<p>We are <strong>Transcendence</strong> , a company registered in France at 20 Quai frissard, Le Havre, Normandie 76600.</p>
			<p>We operate the website <a href="https://transcendence.com" target="_blank" class="legal-link">https://transcendence.com</a>, as well as any other related products and services that refer or link to these legal terms.</p>
			<p>You can contact us by phone at <a href="tel:+33622194307" class="legal-link">+33 6 22 19 43 07</a>, email at <a href="mailto:lpatin@student.42lehavre.fr" class="legal-link">lpatin@student.42lehavre.fr</a>, or by mail to 20 Quai frissard, Le Havre, Normandie 76600, France.</p>
			<p>These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity, and Transcendence, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. <strong>IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.</strong></p>
			<p>We will provide you with prior notice of any scheduled changes to the Services you are using. The modified Legal Terms will become effective upon posting or notifying you by <a href="mailto:lpatin@student.42lehavre.fr" class="legal-link">lpatin@student.42lehavre.fr</a>, as stated in the email message. By continuing to use the Services after the effective date of any changes, you agree to be bound by the modified terms.</p>
			<p>The Services are intended for users who are at least 13 years of age. All users who are minors in the jurisdiction in which they reside (generally under the age of 18) must have the permission of, and be directly supervised by, their parent or guardian to use the Services. If you are a minor, you must have your parent or guardian read and agree to these Legal Terms prior to you using the Services.</p>
		</section>
		<nav class="table-of-contents">
			<h2>TABLE OF CONTENTS</h2>
			<ol>
				<li><a href="#" (click)="scrollToSection('services', $event)">OUR SERVICES</a></li>
				<li><a href="#" (click)="scrollToSection('ip', $event)">INTELLECTUAL PROPERTY RIGHTS</a></li>
				<li><a href="#" (click)="scrollToSection('userreps', $event)">USER REPRESENTATIONS</a></li>
				<li><a href="#" (click)="scrollToSection('userreg', $event)">USER REGISTRATION</a></li>
				<li><a href="#" (click)="scrollToSection('prohibited', $event)">PROHIBITED ACTIVITIES</a></li>
				<li><a href="#" (click)="scrollToSection('ugc', $event)">USER GENERATED CONTRIBUTIONS</a></li>
				<li><a href="#" (click)="scrollToSection('license', $event)">CONTRIBUTION LICENSE</a></li>
				<li><a href="#" (click)="scrollToSection('socialmedia', $event)">SOCIAL MEDIA</a></li>
				<li><a href="#" (click)="scrollToSection('sitemanage', $event)">SERVICES MANAGEMENT</a></li>
				<li><a href="#" (click)="scrollToSection('privacy', $event)">PRIVACY POLICY</a></li>
				<li><a href="#" (click)="scrollToSection('copyright', $event)">COPYRIGHT INFRINGEMENTS</a></li>
				<li><a href="#" (click)="scrollToSection('termination', $event)">TERM AND TERMINATION</a></li>
				<li><a href="#" (click)="scrollToSection('modifications', $event)">MODIFICATIONS AND INTERRUPTIONS</a></li>
				<li><a href="#" (click)="scrollToSection('law', $event)">GOVERNING LAW</a></li>
				<li><a href="#" (click)="scrollToSection('disputes', $event)">DISPUTE RESOLUTION</a></li>
				<li><a href="#" (click)="scrollToSection('corrections', $event)">CORRECTIONS</a></li>
				<li><a href="#" (click)="scrollToSection('disclaimer', $event)">DISCLAIMER</a></li>
				<li><a href="#" (click)="scrollToSection('liability', $event)">LIMITATIONS OF LIABILITY</a></li>
				<li><a href="#" (click)="scrollToSection('indemnification', $event)">INDEMNIFICATION</a></li>
				<li><a href="#" (click)="scrollToSection('userdata', $event)">USER DATA</a></li>
				<li><a href="#" (click)="scrollToSection('electronic', $event)">ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</a></li>
				<li><a href="#" (click)="scrollToSection('california', $event)">CALIFORNIA USERS AND RESIDENTS</a></li>
				<li><a href="#" (click)="scrollToSection('misc', $event)">MISCELLANEOUS</a></li>
				<li><a href="#" (click)="scrollToSection('contact', $event)">CONTACT US</a></li>
			</ol>
		</nav>
		<section id="services" class="terms-section">
			<h2>1. OUR SERVICES</h2>
			<p>The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.</p>
			<p>The Services are not tailored to comply with industry-specific regulations (Health Insurance Portability and Accountability Act (HIPAA), Federal Information Security Management Act (FISMA), etc.), so if your interactions would be subjected to such laws, you may not use the Services. You may not use the Services in a way that would violate the Gramm-Leach-Bliley Act (GLBA).</p>
		</section>
		<section id="ip" class="terms-section">
			<h2>2. INTELLECTUAL PROPERTY RIGHTS</h2>
			<h3>Our intellectual property</h3>
			<p>We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the Content)...</p>
		</section>
		<section id="userreps" class="terms-section">
			<h2>3. USER REPRESENTATIONS</h2>
			<p>By using the Services, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Legal Terms...</p>
		</section>
		<section id="userreg" class="terms-section">
			<h2>4. USER REGISTRATION</h2>
			<p>You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate.</p>
		</section>
		<section id="prohibited" class="terms-section">
			<h2>5. PROHIBITED ACTIVITIES</h2>
			<p>You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
		</section>
		<section id="ugc" class="terms-section">
			<h2>6. USER GENERATED CONTRIBUTIONS</h2>
			<p>The Services may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, and may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Services.</p>
		</section>
		<section id="license" class="terms-section">
			<h2>7. CONTRIBUTION LICENSE</h2>
			<p>By posting your Contributions to any part of the Services, you automatically grant, and you represent and warrant that you have the right to grant, to us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and license to host, use, copy, disclose, sell, resell, publish, broadcast, and distribute such Contributions.</p>
		</section>
		<section id="socialmedia" class="terms-section">
			<h2>8. SOCIAL MEDIA</h2>
			<p>As part of the functionality of the Services, you may link your account with online accounts you have with third-party service providers (each such account, a Third-Party Account).</p>
		</section>
		<section id="sitemanage" class="terms-section">
			<h2>9. SERVICES MANAGEMENT</h2>
			<p>We reserve the right, but not the obligation, to: (1) monitor the Services for violations of these Legal Terms; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms.</p>
		</section>
		<section id="privacy" class="terms-section">
			<h2>10. PRIVACY POLICY</h2>
			<p>We care about data privacy and security. Please review our Privacy Policy. By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms.</p>
		</section>
		<section id="copyright" class="terms-section">
			<h2>11. COPYRIGHT INFRINGEMENTS</h2>
			<p>We respect the intellectual property rights of others. If you believe that any material available on or through the Services infringes upon any copyright you own or control, please immediately notify us using the contact information provided below.</p>
		</section>
		<section id="termination" class="terms-section">
			<h2>12. TERM AND TERMINATION</h2>
			<p>These Legal Terms shall remain in full force and effect while you use the Services. WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES.</p>
		</section>
		<section id="modifications" class="terms-section">
			<h2>13. MODIFICATIONS AND INTERRUPTIONS</h2>
			<p>We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Services.</p>
		</section>
		<section id="law" class="terms-section">
			<h2>14. GOVERNING LAW</h2>
			<p>These Legal Terms and your use of the Services are governed by and construed in accordance with the laws of France, without regard to its conflict of law principles.</p>
		</section>
		<section id="disputes" class="terms-section">
			<h2>15. DISPUTE RESOLUTION</h2>
			<p>Any legal action of whatever nature brought by either you or us shall be commenced or prosecuted in the courts located in Le Havre, France, and you hereby consent to, and waive all defenses of lack of personal jurisdiction and forum non conveniens.</p>
		</section>
		<section id="corrections" class="terms-section">
			<h2>16. CORRECTIONS</h2>
			<p>There may be information on the Services that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and various other information. We reserve the right to correct any errors, inaccuracies, or omissions.</p>
		</section>
		<section id="disclaimer" class="terms-section">
			<h2>17. DISCLAIMER</h2>
			<p>THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED.</p>
		</section>
		<section id="liability" class="terms-section">
			<h2>18. LIMITATIONS OF LIABILITY</h2>
			<p>IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT.</p>
		</section>
		<section id="indemnification" class="terms-section">
			<h2>19. INDEMNIFICATION</h2>
			<p>You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand.</p>
		</section>
		<section id="userdata" class="terms-section">
			<h2>20. USER DATA</h2>
			<p>We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services.</p>
		</section>
		<section id="electronic" class="terms-section">
			<h2>21. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</h2>
			<p>Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically satisfy any legal requirement that such communication be in writing.</p>
		</section>
		<section id="california" class="terms-section">
			<h2>22. CALIFORNIA USERS AND RESIDENTS</h2>
			<p>If any complaint with us is not satisfactorily resolved, you can contact the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs in writing.</p>
		</section>
		<section id="misc" class="terms-section">
			<h2>23. MISCELLANEOUS</h2>
			<p>These Legal Terms and any policies or operating rules posted by us on the Services or in respect to the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision.</p>
		</section>
		<section id="contact" class="terms-section">
			<h2>24. CONTACT US</h2>
			<p>In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:</p>
			<p>
				<strong>Transcendence</strong><br>
				20 Quai frissard<br>
				Le Havre, Normandie 76600<br>
				France<br>
				Phone: +33 6 22 19 43 07<br>
				Email: <a href="mailto:lpatin@student.42lehavre.fr" class="legal-link">lpatin@student.42lehavre.fr</a>
			</p>
		</section>
	</main>`,
styleUrl: './ppts.css'
})

export class PPTSComponent {
  constructor(private scroller: ViewportScroller) {}
  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    this.scroller.scrollToAnchor(sectionId);
  }
}