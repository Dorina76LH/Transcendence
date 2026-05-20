import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
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
          <li class="nav-item">
            <a routerLink="/profile" class="nav-link">Profile</a>
          </li>
          <li class="nav-item">
            <a routerLink="/settings" class="nav-link">Settings</a>
          </li>
          <li class="nav-item">
            <a routerLink="/chat" class="nav-link">Chat</a>
          </li>
          <li class="nav-item">
            <a routerLink="/friends" class="nav-link">Friends</a>
          </li>
        </ul>
        <div class="d-flex gap-4 ms-4 me-5">
          <input placeholder="oui">
        </div>
        <div class="d-flex gap-2">
          <a routerLink="/login" class="btn btn-secondary">Login</a>
          <a routerLink="/register" class="btn btn-primary">Register</a>
        </div>
      </div>
    </div>
  </nav>
</header>
  <main class="main">
  <div class="content">
    <!-- <h1> Welcome to our project !</h1>
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
    <h3>_____________________________</h3> -->
    <div class="d-flex flex-column align-items-center text-center px-4" style="max-width: 900px; margin: auto;">
      <img src="favicon.ico" style="min-height: calc(20vh - 56px);">
      <h1>Welcome to our <b><i>Transcendence</i></b> project !</h1>

      <h2 class="mt-4">This project is the biggest project of the common core in the 42 shcool, one of the last projects.</h2>

      <h4 class="mt-3"><i>Transcendence</i> is a group project, which is intended to boost our 
        creativity, self-confidence, adaptability to new technologies, and teamwork skills.</h4>

      <h4 class="mt-3">In this project, the main goal is to make a website, which is made by mixing frontend and backend abilities.</h4>

      <h4 class="mt-2">For the frontend, we used Angular, a framework to make a website that is communicating with the backend easily.</h4>

      <h4 class="mt-2">This framework is mainly used for its ability to make components, which are the pages themselves
         for this project, since the structure of a page in this project is written inside of a component.</h4>

      <h4 class="mt-2">For the backend, we used the Django framework, which is a framework that is using the python 
        language. We mainly used Django for the communication between the database and the frontend, also, we have 
        an admin panel that is used to monitor everything on the website.</h4>

      <h4 class="mt-2">Also, we used a framework for the database that is PostGreSQL, that allows us to have a panel, 
        that makes us able to add new tables and new values to the table with a graphical
         user interface, which makes work even easier.</h4>

      <h4 class="mt-2">This project's goal is to make a completely working chat between 2 users, that are friends, 
        making a fully working login and register system, and making a complete profile customization and overview 
        system, which makes the website user friendly, easy to use, and instinctive.</h4>
    </div>
  </div>
</main>`,
  styleUrl: './home.css'
})
export class HomeComponent {

}

