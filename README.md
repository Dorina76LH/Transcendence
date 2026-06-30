*This project has been created as part of the 42 curriculum by [aeudes], [doberes], [jvega], [llan], [lpatin]*

# ft_transcendence - Advanced Web Platform

## 📝 Description
**ft_transcendence** is a high-end single-page application (SPA) designed to provide a secure and scalable social environment. The project emphasizes advanced backend architecture, real-time communication, and rigorous security protocols. Users can interact through a live chat, manage their profiles with OAuth security, and navigate a platform designed for high performance and responsiveness.

### Key Features:
*   **Real-time Social Hub:** Instant messaging and live notifications using WebSockets.
*   **Microservices Architecture:** A modular backend designed for scalability and isolation.
*   **Security Hardened:** Infrastructure protected by a WAF, HashiCorp Vault for secrets, and GDPR compliance.
*   **User-Centric Design:** Multi-language support and a custom-made component system.

---

## 🛠 Technical Stack
*   **Frontend:** **Angular** (TypeScript) with a custom-made Design System.
*   **Backend:** **Django** (Python) implemented using a **Microservices** architecture.
*   **Database:** **PostgreSQL** (Relational Database) managed via the **Django ORM**.
*   **Infrastructure:** Docker & Docker Compose, HashiCorp Vault (Secrets), and WAF/ModSecurity.
*   **Real-time:** WebSockets (Django Channels) for instant data synchronization.

---

## 📊 Database Schema
The platform uses **PostgreSQL** as its primary data store. The schema is managed through the **Django ORM**, ensuring robust relational integrity.

### Key Entities:
*   **User Model:** Core credentials, role-based access control (RBAC), and Google OAuth links.
*   **Social Graph:** Many-to-Many relationships for friend lists and blocked users.
*   **Chat System:** Entities for private rooms, message history, and online status tracking.
*   **Media:** Managed file storage for user avatars and shared media.

---

## 🚀 Instructions

### Prerequisites
*   **Docker & Docker Compose** (Latest version).
*   **Node.js** (for Angular development environment).
*   **Google Cloud Console** (for OAuth Client ID and Secret).
*   **Vault Token** (if running with HashiCorp Vault enabled).

### Installation & Execution
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-repo/ft_transcendence.git](https://github.com/your-repo/ft_transcendence.git)
    cd ft_transcendence

2.  **Environment Setup:**
    Create a .env file at the root based on .env.example and fill in your secrets.

3.  **Launch with Docker:**
    docker-compose up --build -d

4.  **Access:**
   * 8080 -> port 80  on nginx -> HTTP
   * 8443 -> port 443 on nginx -> HTTPS
    The application will be accessible at 'https://localhost:8443' ?
     The application will be accessible at 'https://localhost:8080' ?

---

## 👥 Team Information
| Member | Role | Responsibilities |
| :--- | :--- | :--- |
| **[Your Name]** | Tech Lead / Backend | Microservices architecture, Django/PostgreSQL setup, and Security Hardening. |
| **[Name 2]** | Frontend Developer | Angular components, Design System, and i18n implementation. |
| **[Name 3]** | PM / DevOps | Task coordination, Vault/WAF setup, and OAuth integration. |

---

## 📈 Project Management

### 🌿 Git & Workflow Rules
We followed a strict **"1 Trello card = 1 branch = 1 PR"** policy to ensure code quality:
*   **Main Branches:** `main` (Production) and `dev` (Integration).
*   **Feature Branches:** Named `feature/TrelloID-description` (e.g., `feature/T12-chat-setup`).
*   **Commit Format:** `type(TrelloID): description` (e.g., `feat(T12): implement websocket handler`).
*   **PR Policy:** Every Pull Request required **2 approvals** and passed tests before merging.

### 🧩 Tools
*   **Trello:** Visual task management and progress tracking.
*   **Git:** Source control and versioning.
*   **Discord:** Daily sync-ups and real-time team communication.

---

## 🗂️ Modules Selection

### Major Modules (2pts each)
*   **Backend as Microservices:** Decoupled services for authentication, chat, and user data.
*   **Real-time Features:** Live interaction using WebSockets.
*   **User Interaction:** Friendship system, user blocking, and profiles.
*   **Standard User Management:** Robust auth + **Google OAuth** + Two Factor Auth integration.
*   **Advanced Permissions System:** Complex Role-Based Access Control (RBAC).
*   **Security Hardening:** WAF implementation + **HashiCorp Vault** for secrets.

### Minor Modules (1pt each)
*   **Frontend Framework:** Use of **Angular**.
*   **Backend Framework:** Use of **Django**.
*   **ORM:** Persistent data management via Django ORM.
*   **Notification System:** Real-time user alerts.
*   **File Upload & Management:** Secure media handling.
*   **Advanced Search:** Complex filtering for users and messages.
*   **Multiple Languages:** Full i18n support.
*   **GDPR Compliance:** Data privacy and deletion features.
*   **Custom Design System:** Reusable UI components built from scratch.
*   **Additional Browser Support:** Optimized cross-browser compatibility.

---

## 💡 Individual Contributions
### [Your Name]
*   **Contributions:** Designed the Backend Microservices architecture and implemented the core Authentication service.
*   **Challenges:** Managing cross-origin resource sharing (CORS) and authentication headers between micro-units.
*   **Solution:** Configured a centralized gateway and used a shared JWT secret across services for token verification.

---

## 📚 Resources & AI Disclosure

### Resources
*   [Angular Official Docs](https://angular.io/docs)
*   [Django REST Framework](https://www.django-rest-framework.org/)
*   [HashiCorp Vault Guide](https://developer.hashicorp.com/vault/docs)
*   [Git Official Documentation](https://git-scm.com/docs)
*   [PostgreSQL Official Documentation](https://www.postgresql.org/docs/)
*   [Docker Official Documentation](https://docs.docker.com/)

### 🤖 AI Usage
AI was utilized as a technical collaborator for:
*   **Documentation:** Generating and translating the README and Theory files.


---
