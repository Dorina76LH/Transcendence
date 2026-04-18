# Transcendence

## 📌 Git & Trello Rules

### 1. 🧩 Tools
- **Trello** → task management & progress tracking  
- **Git** → source code & versioning  

---

### 2. 🌿 Main Branch (`main`)
- Production branch  
- Only **stable and tested** versions  
- Pull Request required before merge  
- At least **1 approval required**  
- **Force push not allowed**  

---

### 3. 🟡 Dev Branch (`dev`)
- Development branch  
- Default branch  
- Pull Request required before merge  
- Approval **not mandatory**  
- **Force push not allowed**  

---

### 4. 🌱 Feature Branches  
- One branch per feature
- Created from latest version of `dev`
- git checkout dev
  git pull origin dev
  git checkout -b feature/T12-chat-send-message

---

### 5. 🔗 Rule
> **1 Trello card = 1 branch = 1 PR**

---

### 6. 📋 Trello Cards
- #T12 - Chat: send message backend
- #T13 - Upload avatar
- #T14 - i18n setup

---

### 7. 🌿 Git Branch Naming
- feature/T12-chat-send-message
- feature/T13-upload-avatar
- fix/T14-i18n-bug
- **Format:** type/TrelloID-description

---

### 8. 💬 Commit Messages
- feat(T12): implement websocket message handler
- feat(T13): add avatar upload endpoint
- **Format:** type(TrelloID): short description 

---

### 9. 🔀 Pull Requests
- Title : [T12] Chat - send message backend
- Description:
  - What was done
  - How to test
  - Screenshoots (if necessary)
