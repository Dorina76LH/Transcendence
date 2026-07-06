import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

interface Friend {
  id: number;
  username: string;
  avatar: string | null;
  conversation_id: number | null;
  is_online: boolean;
}

interface Conversation {
  id: number;
  participants: { id: number; username: string; avatar_url?: string | null }[];
}

interface ChatMessage {
  id?: number;
  conversation?: number;
  sender: {
	id?: number;
	username: string;
	avatar_url?: string | null;
  };
  content: string;
  created_at: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
  template: `
<app-navbar></app-navbar>

<main class="main">
  <div class="content px-4">
	<div class="container-fluid h-100">
	  <div class="row h-100">
		<div class="col-12 col-md-3 border-end border-secondary py-3 text-start list-container"
			 [class.hide-on-mobile]="selectedFriend !== null">
		  <h5 class="text-white mb-4 px-2 tracking-wider">My Friends</h5>
		  <div class="d-flex flex-column gap-1 list-box" style="overflow-y: auto; max-height: 430px;">
			<button *ngFor="let friend of friends"
					class="btn d-flex align-items-center text-start text-white conversation-item position-relative p-2 rounded-3"
					[class.active-room]="selectedFriend?.id === friend.id"
					(click)="selectFriend(friend)">
			  <div class="avatar-circle me-3 bg-gradient d-flex align-items-center justify-content-center shadow-sm fw-bold position-relative"
				   style="width: 40px; height: 40px; min-width: 40px; border-radius: 50%;">
				<img *ngIf="friend.avatar" [src]="friend.avatar" alt="avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
				<span *ngIf="!friend.avatar">{{ friend.username.charAt(0).toUpperCase() }}</span>
				<span *ngIf="friend.is_online"
					  class="position-absolute bottom-0 end-0 p-1 bg-success border border-2 border-dark rounded-circle online-badge">
				</span>
			  </div>
			  <div class="flex-grow-1 overflow-hidden me-2">
				<h6 class="mb-0 text-truncate fw-semibold text-white">{{ friend.username }}</h6>
				<small class="text-white-50 text-truncate d-block" style="font-size: 0.75rem;">
				  {{ friend.conversation_id ? '💬 Active chat' : '✉️ New chat' }}
				</small>
			  </div>
			</button>
			<div *ngIf="friends.length === 0" class="text-center text-white-50 py-4">
			  <i class="bi bi-people-fill d-block fs-3 mb-2"></i>
			  <small>No friends in your list.</small>
			</div>
		  </div>
		</div>

		<div class="col-12 col-md-9 d-flex flex-column py-3 px-3 chat-main-container"
			 [class.hide-on-mobile]="selectedFriend === null">
		  <h5 class="border-bottom border-secondary pb-2 text-white text-start d-flex align-items-center justify-content-between gap-2">
			<div class="d-flex align-items-center overflow-hidden w-100">
			  <button class="btn back-button-mobile" (click)="closeChatMobile()">←</button>
			  <span class="text-truncate">{{ selectedFriend ? selectedFriend.username : 'Select a friend' }}</span>
			</div>
		  </h5>
		  <div #scrollContainer class="flex-grow-1 overflow-auto mb-3 p-3 rounded shadow-inner chat-window-box">
			<div *ngIf="selectedFriend === null" class="m-auto text-center py-5 text-muted">
			  <h5>Your Live Messages</h5>
			</div>

			<div *ngFor="let msg of messages" class="mb-3 d-flex flex-column"
				 [class.align-items-end]="isMe(msg.sender)"
				 [class.align-items-start]="!isMe(msg.sender)">
			  <small class="text-white-50 mb-1 px-2" style="font-size: 0.75rem;">
				{{ msg.sender.username }} • {{ msg.created_at | date:'shortTime' }}
			  </small>
			  <div class="p-2 px-3 rounded-4 shadow-sm message-bubble border text-start"
				   [ngClass]="{'bubble-other': !isMe(msg.sender), 'bubble-me': isMe(msg.sender)}">
				{{ msg.content }}
			  </div>
			</div>
		  </div>
		  <div class="d-flex gap-2 p-1 bg-dark bg-opacity-25 rounded-pill shadow-inner">
			<input class="form-control border-0 text-dark bg-white rounded-pill px-4 py-2" [(ngModel)]="inputMessage" (keyup.enter)="sendMessage()" [disabled]="selectedFriend === null">
			<button type="button" class="btn btn-primary rounded-circle" [disabled]="selectedFriend === null || !inputMessage.trim()" (click)="sendMessage()" style="width: 40px; height: 40px;">
			  <i class="bi bi-send-fill text-white"></i>
			</button>
		  </div>
		</div>
	  </div>
	</div>
  </div>
</main>
  `,
  styleUrl: './chat.css'
})
export class ChatComponent implements OnInit, OnDestroy {
	friends: Friend[] = [];
	selectedFriend: Friend | null = null;
	messages: ChatMessage[] = [];
	inputMessage = '';

	private detectedMyUsername: string | null = null;
	private localUsername: string | null = null;
	private activeSockets: { [key: number]: WebSocket } = {};
	private statusSocket!: WebSocket;
	private scrollContainer!: ElementRef;
	private pollingInterval: any;

	@ViewChild('scrollContainer') set content(content: ElementRef) {
		if (content) this.scrollContainer = content;
	}

	constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

	ngOnInit() {
		const userJson = localStorage.getItem('user');
		if (userJson) {
			this.localUsername = JSON.parse(userJson).username;
		}
		this.initChatDashboard();
		this.connectToGlobalStatus();

		this.pollingInterval = setInterval(() => {
			this.checkForNewConversations();
		}, 3000);
	}

	private connectToGlobalStatus() {
		const token = localStorage.getItem('token') || '';
		this.statusSocket = new WebSocket(`wss://localhost:8443/ws/status/?token=${token}`);

		this.statusSocket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === 'status_change') {
				const friend = this.friends.find(f => f.id === data.user_id);
				if (friend) {
					friend.is_online = data.is_online;
					this.cdr.detectChanges();
				}
			}
		};
	}

	isMe(sender: any): boolean {
		if (!sender) return false;
		const target = this.detectedMyUsername || this.localUsername;
		if (!target) return false;
		const senderUsername = typeof sender === 'object' ? sender.username : sender;
		return senderUsername === target;
	}

	initChatDashboard() {
		this.http.get<any[]>('https://localhost:8443/api/friends/').subscribe({
			next: (friendships) => {
				this.friends = friendships.map(f => ({
					id: f.friend.id,
					username: f.friend.username,
					avatar: f.friend.avatar_url || null,
					is_online: f.friend.is_online || false,
					conversation_id: null
				}));
				this.http.get<Conversation[]>('https://localhost:8443/api/chat/conversations/').subscribe({
					next: (convsData) => this.mapFriendsToConversations(convsData)
				});
			}
		});
	}

	checkForNewConversations() {
		this.http.get<Conversation[]>('https://localhost:8443/api/chat/conversations/').subscribe({
			next: (convsData) => this.mapFriendsToConversations(convsData)
		});
	}

	mapFriendsToConversations(conversations: Conversation[]) {
		conversations.forEach(conv => {
			const currentUsername = this.localUsername || this.detectedMyUsername;
			const friendPart = conv.participants.find(p => p.username !== currentUsername);
			if (friendPart) {
				const friendInList = this.friends.find(f => f.id === friendPart.id);
				if (friendInList) {
					friendInList.conversation_id = conv.id;
					this.connectToWebSocket(conv.id);
				}
			}
		});
	}

	selectFriend(friend: Friend) {
		this.selectedFriend = friend;
		this.messages = [];
		if (friend.conversation_id) this.fetchMessages(friend.conversation_id);
	}

	private fetchMessages(convId: number) {
		this.http.get<ChatMessage[]>(`https://localhost:8443/api/chat/conversations/${convId}/messages/`)
			.subscribe(history => {
				this.messages = history;
				this.cdr.detectChanges();
				this.scrollToBottom();
			});
	}

	sendMessage() {
		const messageToSend = this.inputMessage.trim();
		if (!messageToSend || !this.selectedFriend) return;

		this.inputMessage = '';
		this.cdr.detectChanges();

		if (this.selectedFriend.conversation_id) {
			this.sendViaSocket(this.selectedFriend.conversation_id, messageToSend);
			return;
		}

		this.http.post<Conversation>('https://localhost:8443/api/chat/conversations/create/', {
			participant_id: this.selectedFriend.id
		}).subscribe({
			next: (newConv) => {
				if (this.selectedFriend) {
					this.selectedFriend.conversation_id = newConv.id;
					const friendInList = this.friends.find(f => f.id === this.selectedFriend!.id);
					if (friendInList) friendInList.conversation_id = newConv.id;
					this.connectToWebSocket(newConv.id);
					const interval = setInterval(() => {
						const socket = this.activeSockets[newConv.id];
						if (socket && socket.readyState === WebSocket.OPEN) {
							clearInterval(interval);
							this.sendViaSocket(newConv.id, messageToSend);
						}
					}, 50);
				}
			},
			error: (err) => {
				console.error('Erreur:', err);
				this.inputMessage = messageToSend;
				this.cdr.detectChanges();
			}
		});
	}

	private sendViaSocket(convId: number, text: string) {
		const socket = this.activeSockets[convId];
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(JSON.stringify({ message: text }));
			this.inputMessage = '';
			this.cdr.detectChanges();
		}
	}

	closeChatMobile() {
		this.selectedFriend = null;
		this.messages = [];
		this.cdr.detectChanges();
	}

	connectToWebSocket(conversationId: number) {
		if (this.activeSockets[conversationId]) return;
		const token = localStorage.getItem('token') || '';
		const socket = new WebSocket(`wss://localhost:8443/ws/chat/conversations/${conversationId}/?token=${token}`);
		this.activeSockets[conversationId] = socket;

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (this.selectedFriend && this.selectedFriend.conversation_id === conversationId) {
				 const newMessage: ChatMessage = {
					content: data.message,
					created_at: data.created_at,
				 	sender: { username: data.username }
				};

				this.messages = [...this.messages, newMessage];
				this.scrollToBottom();
				this.cdr.detectChanges();
			} else {
				console.log("Message reçu pour une autre conversation, ignoré.");
			}
		};
	}

	private scrollToBottom(): void {
		if (this.scrollContainer?.nativeElement) {
			Promise.resolve().then(() => this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight);
		}
	}

	ngOnDestroy() {
		if (this.pollingInterval) clearInterval(this.pollingInterval);
		if (this.statusSocket) this.statusSocket.close();
		Object.keys(this.activeSockets).forEach(key => this.activeSockets[Number(key)].close());
	}
}
