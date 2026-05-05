import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark d-none d-lg-block" style="z-index: 2000;">
      <div class="container-fluid">
        <a routerLink="/" class="nav-link">
          <strong>TRANSCENDENCE</strong>
        </a>
        <button class="navbar-toggler" type="button" data-mdb-collapse-init data-mdb-target="#navbar"
          aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
          <i class="fas fa-bars"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbar">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-4 ms-4">
            <li class="nav-item active">
              <a routerLink="/profile" class="nav-link">
                Profile
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="/settings" class="nav-link">
                Settings
              </a>
            </li>
            <li class="nav-item">
              <a routerLink="/chat" class="nav-link">
                Chat
              </a>
            </li>
          </ul>
          <div class="d-flex gap-2 ms-auto">
            <a routerLink="/languages" class="btn btn-primary">Languages</a>
            <a routerLink="/login" class="btn btn-secondary">Login</a>
            <a routerLink="/register" class="btn btn-primary">Register</a>
          </div>
        </div>
      </div>
    </nav>
  </header>
  <main class="main">
  <div class="content">
    <h1> Welcome to our project !</h1>
    <h2>This is the Transcendence project.</h2>
    <h2>📌 Git & Trello Rules</h2>
    <h3>1. 🧩 Tools</h3>
    <h4>Trello → task management & progress tracking</h4>
    <h4>Git → source code & versioning</h4>
    <h3>_____________________________</h3>
    <h3>2. 🌿 Main Branch (main)</h3>
    <h4>Production branch <br>
    Only stable and tested versions <br>
    Pull Request required before merge <br>
    2 approvals required <br>
    Approvals reset if new commits are pushed <br>
    Force push not allowed</h4>
    <h3>_____________________________</h3>
    <h3>🟡 Dev Branch (dev)</h3>
    <h4>Development branch<br>
        Default branch<br>
        Pull Request required before merge<br>
        2 approvals required<br>
        Approvals reset if new commits are pushed<br>
        Force push not allowed<br>
    </h4>
    <h3>_____________________________</h3>
    <h3>4. 🌱 Feature Branches</h3>
    <h4>One branch per feature<br>
        Created from latest version of dev<br>
        git checkout dev<br>
        git pull origin dev<br>
        git checkout -b feature/T12-chat-send-message<br></h4>
    <h3>_____________________________</h3>
    <h3>5. 🔗 Rule</h3>
    <h4>1 Trello card = 1 branch = 1 PR</h4>
    <h3>_____________________________</h3>
    <h3>6. 📋 Trello Cards</h3>
    <h4>#T12 - Chat: send message backend<br>
        #T13 - Upload avatar<br>
        #T14 - i18n setup<br></h4>
    <h3>_____________________________</h3>
    <h3>7. 🌿 Git Branch Naming</h3>
    <h4>feature/T12-chat-send-message<br>
        feature/T13-upload-avatar<br>
        fix/T14-i18n-bug<br>
        Format: type/TrelloID-description<br></h4>
    <h3>_____________________________</h3>
    <h3>8. 💬 Commit Messages</h3>
    <h4>feat(T12): implement websocket message handler<br>
        feat(T13): add avatar upload endpoint<br>
        Format: type(TrelloID): short description<br></h4>
    <h3>_____________________________</h3>
    <h3>9. 🔀 Pull Requests</h3>
    <h4>Title : [T12] Chat - send message backend <br>
        Description: <br>

        What was done <br>
        How to test <br>
        Screenshoots (if necessary) <br>
    </h4>
    <h3>_____________________________</h3>
    <h3> Buttons fun</h3>
    <div class="buttons">
      <a routerLink="/settings" class="btn btn-light">Secret Button</a>
      <button type="button" class="btn btn-secondary">Lot</button>
      <button type="button" class="btn btn-success">Of</button>
      <button type="button" class="btn btn-danger">Buttons</button>
      <button type="button" class="btn btn-warning">Here</button>
      <button type="button" class="btn btn-info">Kinda</button>
      <button type="button" class="btn btn-light">Fun</button>
      <button type="button" class="btn btn-dark">Lol</button>
    </div>
  </div>
</main>`,
  styleUrl: './home.css'
})
export class HomeComponent {

}

