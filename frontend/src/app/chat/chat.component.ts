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
  <div class="content w-100 px-4">
	<div class="container-fluid h-100">
	  <div class="row h-100">

		<div class="col-12 col-md-3 border-end border-secondary py-3 text-start list-container"
			 [class.hide-on-mobile]="selectedFriend !== null">
		  <h5 class="text-white mb-4 px-2 tracking-wider">Mes Amis</h5>

		  <div class="d-flex flex-column gap-1 list-box" style="overflow-y: auto; height: 430px;">

			<button *ngFor="let friend of friends"
					class="btn d-flex align-items-center w-100 text-start text-white conversation-item position-relative p-2 rounded-3"
					[class.active-room]="selectedFriend?.id === friend.id"
					(click)="selectFriend(friend)">

			  <div class="active-indicator"></div>

			  <div class="avatar-circle me-3 bg-gradient d-flex align-items-center justify-content-center shadow-sm fw-bold overflow-hidden" style="width: 40px; height: 40px; min-width: 40px; border-radius: 50%;">
				<img *ngIf="friend.avatar" [src]="friend.avatar" alt="avatar" style="width: 100%; height: 100%; object-fit: cover;">
				<span *ngIf="!friend.avatar">{{ friend.username.charAt(0).toUpperCase() }}</span>
			  </div>

			  <div class="flex-grow-1 overflow-hidden me-2">
				<h6 class="mb-0 text-truncate fw-semibold text-white">
				  {{ friend.username }}
				</h6>
				<small class="text-white-50 text-truncate d-block" style="font-size: 0.75rem;">
				  {{ friend.conversation_id ? '💬 Discussion active' : '✉️ Nouvelle discussion' }}
				</small>
			  </div>

			</button>

			<div *ngIf="friends.length === 0" class="text-center text-white-50 py-4">
			  <i class="bi bi-people-fill d-block fs-3 mb-2"></i>
			  <small>Aucun ami dans votre liste.</small>
			</div>
		  </div>
		</div>

		<div class="col-12 col-md-9 d-flex flex-column py-3 px-3 chat-main-container"
			 [class.hide-on-mobile]="selectedFriend === null">

		  <h5 class="border-bottom border-secondary pb-2 text-white text-start d-flex align-items-center justify-content-between gap-2">
			<div class="d-flex align-items-center overflow-hidden w-100">
			  <button class="btn back-button-mobile" (click)="closeChatMobile()">←</button>
			  <i class="bi bi-chat-right-text text-primary-emphasis d-none d-md-inline me-2"></i>
			  <span class="text-truncate">{{ selectedFriend ? selectedFriend.username : 'Sélectionnez un ami' }}</span>
			</div>
		  </h5>

		  <div #scrollContainer class="flex-grow-1 overflow-auto mb-3 p-3 rounded shadow-inner chat-window-box">

			<div *ngIf="selectedFriend === null" class="m-auto text-center py-5 text-muted">
			  <div class="bg-dark bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
				<i class="bi bi-chat-square-quote fs-1 text-secondary"></i>
			  </div>
			  <h5>Vos messages en direct</h5>
			  <p class="small">Sélectionnez un de vos amis à gauche pour lancer la connexion sécurisée.</p>
			</div>

			<div *ngFor="let msg of messages" class="mb-3 d-flex flex-column w-100"
				 [class.align-items-end]="isMe(msg.sender)"
				 [class.align-items-start]="!isMe(msg.sender)">

			  <small class="text-white-50 mb-1 px-2" style="font-size: 0.75rem; font-weight: 500;">
				{{ msg.sender?.username || msg.sender }} • {{ msg.created_at | date:'shortTime' }}
			  </small>

			  <div class="p-2 px-3 rounded-4 shadow-sm message-bubble border text-start"
				   [ngClass]="{
					 'bubble-other': !isMe(msg.sender),
					 'bubble-me': isMe(msg.sender)
				   }">
				{{ msg.content }}
			  </div>
			</div>
		  </div>

		  <div class="d-flex gap-2 p-1 bg-dark bg-opacity-25 rounded-pill shadow-inner">
			<input
			  class="form-control border-0 text-dark bg-white rounded-pill px-4 py-2"
			  [(ngModel)]="inputMessage"
			  (keyup.enter)="sendMessage()"
			  [disabled]="selectedFriend === null">
			<button class="btn btn-primary rounded-circle d-flex align-items-center justify-content-center p-0"
					[disabled]="selectedFriend === null || !inputMessage.trim()"
					(click)="sendMessage()"
					style="width: 40px; height: 40px; min-width: 40px;">
			  <i class="bi bi-send-fill text-white" style="font-size: 1rem; margin-left: 2px;"></i>
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
	private scrollContainer!: ElementRef;

	@ViewChild('scrollContainer') set content(content: ElementRef) {
		if (content) this.scrollContainer = content;
	}

	constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

	ngOnInit() {
		this.localUsername = localStorage.getItem('username');
		this.initChatDashboard();
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
					conversation_id: null
				}));

				this.http.get<Conversation[]>('https://localhost:8443/api/chat/conversations/').subscribe({
					next: (convsData) => {
						this.mapFriendsToConversations(convsData);
						this.cdr.detectChanges();
					},
					error: (err) => console.error('Erreur chargement conversations:', err)
				});
			},
			error: (err) => console.error('Erreur chargement amis backend:', err)
		});
	}

	mapFriendsToConversations(conversations: Conversation[]) {
		if (conversations.length > 0 && !this.detectedMyUsername) {
			const firstConv = conversations[0];
			const foundMe = firstConv.participants.find(p => !this.friends.some(f => f.id === p.id));
			if (foundMe) {
				this.detectedMyUsername = foundMe.username;
			}
		}

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

		if (friend.conversation_id) {
			this.http.get<ChatMessage[]>(`https://localhost:8443/api/chat/conversations/${friend.conversation_id}/messages/`)
				.subscribe({
					next: (history) => {
						this.messages = history;
						this.cdr.detectChanges();
						this.scrollToBottom();
					},
					error: (err) => console.error('Erreur historique:', err)
				});
		}
	}

	sendMessage() {
		const messageToSend = this.inputMessage.trim();
		if (!messageToSend || !this.selectedFriend) return;

		if (!this.selectedFriend.conversation_id) {
			this.http.post<Conversation>('https://localhost:8443/api/chat/conversations/create/', { participant_id: this.selectedFriend.id })
				.subscribe({
					next: (newConv) => {
						if (this.selectedFriend) {
							this.selectedFriend.conversation_id = newConv.id;
							this.connectToWebSocket(newConv.id);
							setTimeout(() => this.sendViaSocket(newConv.id, messageToSend), 150);
						}
					},
					error: (err) => console.error('Erreur création discussion automatique:', err)
				});
		} else {
			this.sendViaSocket(this.selectedFriend.conversation_id, messageToSend);
		}
	}

	private sendViaSocket(convId: number, text: string) {
		const socket = this.activeSockets[convId];
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(JSON.stringify({ message: text }));
			this.inputMessage = '';
			this.cdr.detectChanges();
		} else {
			console.error('Le WebSocket n\'est pas prêt ou déconnecté pour la discussion:', convId);
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
			const extractedUsername = data.username || data.sender?.username || 'Friend';

			const formattedMessage: ChatMessage = {
				content: data.content || data.message || '',
				created_at: data.created_at || new Date().toISOString(),
				sender: { username: extractedUsername }
			};

			if (this.selectedFriend && this.selectedFriend.conversation_id === conversationId) {
				this.messages.push(formattedMessage);
				this.scrollToBottom();
			}

			this.cdr.detectChanges();
		};

		socket.onerror = (err) => console.error(`Erreur WS:`, err);
		socket.onclose = () => { delete this.activeSockets[conversationId]; };
	}

	private scrollToBottom(): void {
		if (this.scrollContainer?.nativeElement) {
			Promise.resolve().then(() => {
				this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
			});
		}
	}

	ngOnDestroy() {
		Object.keys(this.activeSockets).forEach(key => {
			this.activeSockets[Number(key)].close();
		});
	}
}
