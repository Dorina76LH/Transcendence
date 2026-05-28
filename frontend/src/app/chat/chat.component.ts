// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// interface ChatMessage {
//   message: string;
//   message_id: number;
//   sender_id: number;
//   username: string;
//   created_at: string;
// }

// @Component({
//   selector: 'app-chat',
//   imports: [RouterLink, FormsModule, CommonModule],
//   template: `
// <header>
//   <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
//     <div class="container-fluid">
//       <a routerLink="/" class="nav-link text-white">
//         <strong>TRANSCENDENCE</strong>
//       </a>
//       <div class="collapse navbar-collapse" id="navbar">
//         <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-4 ms-4">
//           <li class="nav-item"><a routerLink="/profile" class="nav-link text-white-50">Profile</a></li>
//           <li class="nav-item"><a routerLink="/settings" class="nav-link text-white-50">Settings</a></li>
//           <li class="nav-item"><a routerLink="/chat" class="nav-link text-white">Chat</a></li>
//           <li class="nav-item"><a routerLink="/friends" class="nav-link text-white-50">Friends</a></li>
//         </ul>
//       </div>
//     </div>
//   </nav>
// </header>

// <main class="main">
//   <div class="container-fluid h-100">
//     <div class="row h-100">

//       <div class="col-2 border-end border-secondary py-3">
//         <div class="d-flex flex-column py-3" style="overflow-y: auto; height: 400px;">
//           <button class="btn d-flex align-items-center mb-3 w-100" (click)="selectFriend('Friend 1', 1)">
//             <div class="rounded-circle bg-secondary me-2" style="width:40px;height:40px;"></div>
//             <h5 class="mb-0">Friend 1</h5>
//           </button>
//           <button class="btn d-flex align-items-center mb-3 w-100" (click)="selectFriend('Friend 2', 2)">
//             <div class="rounded-circle bg-secondary me-2" style="width:40px;height:40px;"></div>
//             <h5 class="mb-0">Friend 2</h5>
//           </button>
//           <button class="btn d-flex align-items-center mb-3 w-100" (click)="selectFriend('Friend 3', 3)">
//             <div class="rounded-circle bg-secondary me-2" style="width:40px;height:40px;"></div>
//             <h5 class="mb-0">Friend 3</h5>
//           </button>
//         </div>
//       </div>

//       <div class="col d-flex flex-column py-3">
//         <h5 class="border-bottom border-secondary pb-2">
//           {{ selectedFriend ? 'Chat with ' + selectedFriend : 'Select a friend' }}
//         </h5>

//         <div class="flex-grow-1 overflow-auto mb-2 p-3 rounded shadow-inner" style="max-height: 500px; background-color: #e9ecef;">
//           <div *ngFor="let msg of messages" class="mb-3 d-flex flex-column">
//             <small class="text-dark-50 mb-1" style="font-size: 0.8rem; font-weight: 600;">
//               {{ msg.username }} • {{ msg.created_at | date:'shortTime' }}
//             </small>
//             <div class="p-2 px-3 rounded bg-white text-dark border border-secondary-subtle shadow-sm" style="max-width: 70%; width: fit-content;">
//               {{ msg.message }}
//             </div>
//           </div>
//         </div>

//         <div class="d-flex gap-2">
//           <input
//             class="form-control border-secondary text-dark bg-white"
//             [(ngModel)]="inputMessage"
//             (keyup.enter)="sendMessage()"
//             [disabled]="!selectedFriend"
//             placeholder="Your message ...">
//           <button class="btn btn-primary" [disabled]="!selectedFriend" (click)="sendMessage()">Send</button>
//         </div>
//       </div>

//       <div class="col-2 border-start border-secondary py-3">
//         <h5>Chatting with :</h5>
//         <div class="py-2"><strong>{{ selectedFriend || '...' }}</strong></div>
//       </div>

//     </div>
//   </div>
// </main>`,
//   styleUrl: './chat.css'
// })
// // export class ChatComponent {
// //   selectedFriend = '';

// //   selectFriend(name: string) {
// //     this.selectedFriend = name;
// //   }

// //   private socket!: WebSocket;
// //   messages: string[] = [];
// //   inputMessage = '';

// //   ngOnInit() {
// //     this.socket = new WebSocket('wss://localhost:8443/ws/chat/');
// //     this.socket.onmessage = (event) => {
// //       const data = JSON.parse(event.data);
// //       this.messages.push(data.message);
// //     };
// //   }
// //   sendMessage() {
// //   const messageToSend = this.inputMessage.trim();
// //   if (messageToSend && this.selectedFriend) {
// //     if (this.socket && this.socket.readyState === WebSocket.OPEN) {
// //       const payload = {
// //         message: messageToSend,
// //         to: this.selectedFriend,
// //         timestamp: new Date().toISOString()
// //       };
// //       this.socket.send(JSON.stringify(payload));
// //       this.messages.push(`Me : ${messageToSend}`);
// //       this.inputMessage = '';
// //     } else {
// //       console.log("Connection lost. Can't send the message.");
// //     }
// //   } else if (!this.selectedFriend) {
// //     console.log("Choose a friend first.");
// //   }
// // }
// //   ngOnDestroy() {
// //     this.socket.close();
// //   }
// // }
// export class ChatComponent implements OnInit, OnDestroy {
//   selectedFriend = '';
//   private socket!: WebSocket;
//   messages: ChatMessage[] = [];
//   inputMessage = '';

//   ngOnInit() {
//   }

//   selectFriend(name: string, conversationId: number) {
//     this.selectedFriend = name;
//     this.messages = [];
//     if (this.socket) {
//       this.socket.close();
//     }
//     this.socket = new WebSocket(`wss://localhost:8443/ws/chat/conversations/${conversationId}/`);
//     this.socket.onmessage = (event) => {
//       const data: ChatMessage = JSON.parse(event.data);
//       this.messages.push(data);
//     };
//     this.socket.onerror = (err) => {
//       console.error('Erreur WebSocket:', err);
//     };
//     this.socket.onclose = (event) => {
//       console.log(`Socket fermé (Code: ${event.code})`);
//     };
//   }

//   sendMessage() {
//     const messageToSend = this.inputMessage.trim();
//     if (messageToSend && this.selectedFriend) {
//       if (this.socket && this.socket.readyState === WebSocket.OPEN) {
//         const payload = {
//           message: messageToSend
//         };
//         this.socket.send(JSON.stringify(payload));
//         this.inputMessage = '';
//       } else {
//         console.warn("Impossible d'envoyer, le WebSocket n'est pas connecté.");
//       }
//     }
//   }

//   ngOnDestroy() {
//     if (this.socket) {
//       this.socket.close();
//     }
//   }
// }

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface ChatMessage {
  message: string;
  message_id: number;
  sender_id: number;
  username: string;
  created_at: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  template: `
<header>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a routerLink="/" class="nav-link text-white">
        <strong>TRANSCENDENCE</strong>
      </a>
      <div class="collapse navbar-collapse" id="navbar">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-4 ms-4">
          <li class="nav-item"><a routerLink="/profile" class="nav-link text-white-50">Profile</a></li>
          <li class="nav-item"><a routerLink="/settings" class="nav-link text-white-50">Settings</a></li>
          <li class="nav-item"><a routerLink="/chat" class="nav-link text-white">Chat</a></li>
          <li class="nav-item"><a routerLink="/friends" class="nav-link text-white-50">Friends</a></li>
        </ul>
      </div>
    </div>
  </nav>
</header>

<main class="main">
  <div class="container-fluid h-100">
    <div class="row h-100">

      <div class="col-2 border-end border-secondary py-3">
        <div class="d-flex flex-column py-3" style="overflow-y: auto; height: 400px;">
          <button class="btn d-flex align-items-center mb-3 w-100" (click)="selectFriend('Friend 1', 1)">
            <div class="rounded-circle bg-secondary me-2" style="width:40px;height:40px;"></div>
            <h5 class="mb-0">Friend 1</h5>
          </button>
          <button class="btn d-flex align-items-center mb-3 w-100" (click)="selectFriend('Friend 2', 2)">
            <div class="rounded-circle bg-secondary me-2" style="width:40px;height:40px;"></div>
            <h5 class="mb-0">Friend 2</h5>
          </button>
          <button class="btn d-flex align-items-center mb-3 w-100" (click)="selectFriend('Friend 3', 3)">
            <div class="rounded-circle bg-secondary me-2" style="width:40px;height:40px;"></div>
            <h5 class="mb-0">Friend 3</h5>
          </button>
        </div>
      </div>

      <div class="col d-flex flex-column py-3">
        <h5 class="border-bottom border-secondary pb-2">
          {{ selectedFriend ? 'Chat with ' + selectedFriend : 'Select a friend' }}
        </h5>

        <div class="flex-grow-1 overflow-auto mb-2 p-3 rounded shadow-inner" style="max-height: 500px; background-color: #e9ecef;">
          <div *ngFor="let msg of messages" class="mb-3 d-flex flex-column">
            <small class="text-dark-50 mb-1" style="font-size: 0.8rem; font-weight: 600;">
              {{ msg.username }} • {{ msg.created_at | date:'shortTime' }}
            </small>
            <div class="p-2 px-3 rounded bg-white text-dark border border-secondary-subtle shadow-sm" style="max-width: 70%; width: fit-content;">
              {{ msg.message }}
            </div>
          </div>
        </div>

        <div class="d-flex gap-2">
          <input
            class="form-control border-secondary text-dark bg-white"
            [(ngModel)]="inputMessage"
            (keyup.enter)="sendMessage()"
            [disabled]="!selectedFriend"
            placeholder="Your message ...">
          <button class="btn btn-primary" [disabled]="!selectedFriend" (click)="sendMessage()">Send</button>
        </div>
      </div>

      <div class="col-2 border-start border-secondary py-3">
        <h5>Chatting with :</h5>
        <div class="py-2"><strong>{{ selectedFriend || '...' }}</strong></div>
      </div>

    </div>
  </div>
</main>`,
  styleUrl: './chat.css'
})
export class ChatComponent implements OnInit, OnDestroy {
  selectedFriend = '';
  private socket!: WebSocket;
  messages: ChatMessage[] = [];
  inputMessage = '';

  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit() {
  }

  selectFriend(name: string, conversationId: number) {
    this.selectedFriend = name;
    this.messages = [];

    if (this.socket) {
      this.socket.close();
    }

    this.socket = new WebSocket(`wss://localhost:8443/ws/chat/conversations/${conversationId}/`);

    this.socket.onmessage = (event) => {
      const data: ChatMessage = JSON.parse(event.data);
      this.messages.push(data);
	  this.cdr.detectChanges();
    };

    this.socket.onerror = (err) => {
      console.error('Erreur WebSocket:', err);
    };

    this.socket.onclose = (event) => {
      console.log(`Socket fermé proprement (Code: ${event.code})`);
    };
  }

  sendMessage() {
    const messageToSend = this.inputMessage.trim();

    if (messageToSend && this.selectedFriend) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        const payload = {
          message: messageToSend
        };
        this.socket.send(JSON.stringify(payload));
        this.inputMessage = '';
      } else {
        console.warn("Impossible d'envoyer, le WebSocket n'est pas connecté.");
      }
    }
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.close();
    }
  }
}