import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
	selector: 'app-chat',
	imports: [FormsModule, CommonModule, NavbarComponent],
	template: `
<app-navbar></app-navbar>
<main class="main">
	<div class="container-fluid h-100">
		<div class="row h-100">
			<!-- left column, friend list -->
		<div class="col-2 border-end border-secondary py-3">
			<div class="col-15 border-end border-secondary d-flex flex-column py-3" style="overflow:scroll; height:200px">
				<button class="btn d-flex align-items-center mb-3 w-100" (click)="selectFriend('Friend 1')">
					<div class="rounded-circle bg-secondary me-2" style="width:40px;height:40px;"></div>
					<h5 class="mb-0">Friend 1</h5>
				</button>
				<button class="btn d-flex align-items-center mb-3 w-100" (click)="selectFriend('Friend 2')">
					<div class="rounded-circle bg-secondary me-2" style="width:40px;height:40px;"></div>
					<h5 class="mb-0">Friend 2</h5>
				</button>
				<button class="btn d-flex align-items-center mb-3 w-100" (click)="selectFriend('Friend 3')">
					<div class="rounded-circle bg-secondary me-2" style="width:40px;height:40px;"></div>
					<h5 class="mb-0">Friend 3</h5>
				</button>
			</div>
		</div>
			<!-- whole column for the chat, on the middle -->
			<div class="col d-flex flex-column py-3">
				<h5 class="border-bottom border-secondary pb-2">
					{{ selectedFriend ? 'Chat with ' + selectedFriend : 'Select a friend' }}
				</h5>
				<!-- msg zone display -->
				<div class="flex-grow-1 overflow-auto mb-2">
					<div *ngFor="let msg of messages">
						{{ msg }}
					</div>
				</div>
				<!-- text input for chat -->
				<div class="d-flex gap-2">
					<input
						class="form-control border-secondary"
						[(ngModel)]="inputMessage"
						(keyup.enter)="sendMessage()"
						placeholder="Your message ...">
					<button class="btn btn-primary" (click)="sendMessage()">Send</button>
				</div>
			</div>
			<!-- Friends selected output on the right -->
			<div class="col-2 border-start border-secondary py-3">
				<h5>Chatting with :</h5>
				<div class="py-2">{{ selectedFriend || '...' }}</div>
			</div>
		</div>
	</div>
</main>`,
	styleUrl: './chat.css',
})
export class ChatComponent {
	selectedFriend = '';
	private socket!: WebSocket;
	messages: string[] = [];
	inputMessage = '';

	constructor(private router: Router) {}

	ngOnInit() {
		this.socket = new WebSocket('wss://localhost:8443/ws/chat/test');
		this.socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			this.messages.push(data.message);
		};
	}

	selectFriend(name: string) {
		this.selectedFriend = name;
	}

	sendMessage() {
		const messageToSend = this.inputMessage.trim();
		if (messageToSend && this.selectedFriend) {
			if (this.socket && this.socket.readyState === WebSocket.OPEN) {
				const payload = {
					message: messageToSend,
					to: this.selectedFriend,
					timestamp: new Date().toISOString()
				};
				this.socket.send(JSON.stringify(payload));
				this.messages.push(`Me : ${messageToSend}`);
				this.inputMessage = '';
			} else {
				console.log("Connection lost. Can't send the message.");
			}
		} else if (!this.selectedFriend) {
			console.log("Choose a friend first.");
		}
	}

	ngOnDestroy() {
		this.socket.close();
	}
}
