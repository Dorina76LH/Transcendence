*This project has been created as part of the 42 curriculum by [aeudes], [doberes], [jvega], [llan], [lpatin]*

# ft_transcendence - Advanced Web Platform

## Makefile Commands
The project Makefile provides short commands to run and maintain the Docker-based environment:

| Command | Description |
| :--- | :--- |
| `make`| Checks required dependencies, makes the dependency script executable, then builds and starts all Docker Compose services in detached mode. |
| `make down` | Stops and removes the Docker Compose containers and network created for the project. |
| `make re` | Restarts the project from scratch by running `make down` followed by `make all`. |
| `make clean` | Stops the project and removes unused Docker data with `docker system prune -af`. |
| `make backup` | Creates a timestamped PostgreSQL database dump inside `infra/backups/`. |
| `make restore` | Restores the PostgreSQL database from the most recent SQL backup found in `infra/backups/`. |

## 📝 Description
**ft_transcendence** is a high-end single-page application (SPA) designed to provide a secure and scalable social environment. The project emphasizes advanced backend architecture, real-time communication, and rigorous security protocols. Users can interact through a live chat, manage their profiles with OAuth security, and navigate a platform designed for high performance and responsiveness.

### Key Features:
* **Security Hardening & Infrastructure Isolation (Microservices):**
    * **Decoupled Microservices Architecture:** Independent backend environments separating core systems (Authentication, Chat, Matchmaking) into modular services for high scalability and isolation.
    * **ModSecurity (WAF):** Integrated into the Nginx reverse proxy to analyze incoming HTTP traffic and block common exploits (SQLi, XSS).
    * **Database Network Isolation:** The PostgreSQL database container is locked inside an isolated internal Docker network. It has no exposed public ports and is strictly accessible *only* by the backend microservices.
    * **Automated Health Checks:** Continuous runtime container monitoring to immediately detect, log, and recover from service failures or unexpected container crashes.
    * **Django Built-in Guards:** Automated SQL injection prevention (via ORM), XSS protection, clickjacking middleware, and cryptographically salted password hashing (PBKDF2) ensuring user credentials are never stored in plain text.
* **Privacy & Advanced Authentication:**
    * **OAuth 2.0 Integration:** Secure and seamless third-party authentication via Google and 42 Intra.
    * **Two-Factor Authentication (2FA):** Enhanced account protection layer to secure user identities.
    * **GDPR Compliance:** Dedicated privacy controls allowing immediate profile data export (JSON format) and permanent account erasure ("Right to be Forgotten").
* **Socia & Interactive Features:**
    * **Social Graph System:** Full-featured friendship network allowing users to send requests, track friends, and block profiles with strict real-time status isolation.
    * **Interactive Chat & Sound Alerts:** Real-time messaging platform equipped with immediate audio notifications (custom "plouf" sound effects) to enhance user engagement.
    * **Admin Dashboard:** Dedicated administrative control panel enabling authorized profiles to manage global system metrics, user data, and site statistics.
    * **Dynamic Avatars (Dicebear):** Automatic assignment of a unique, custom-generated default avatar for every new user via the Dicebear API upon registration.
    * **Custom Component Architecture:** A responsive and lightweight UI interface built completely from scratch using Angular, optimized for high performance.

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

    | or |

    make

4.  **Access:**
   * 8080 -> port 80  on nginx -> HTTP
   * [Home page](https://localhost:8443/)
   * [Home page](http://localhost:8080/)
   * [Panel Admin Django](https://localhost:8443/admin/)
   * [Panel Admin PostgreSQL](http://localhost:5050/)

---

## 👥 Team Information & Roles

| Member | Role | Responsibilities |
| :--- | :--- | :--- |
| **[aeudes]** | Developer / Backend | OAuth 2.0 (Google & 42) (backend + frontend), Two-Factor Authentication (2FA) (backend + frontend), Friends system (backend), Logout, Navbar centralization. |
| **[doberes]** | PM / Developer | Core Django setup, Custom User Model, REST Auth API (Register, Login, Me), GDPR Compliance (backend + frontend), Admin Panel localization & layout theme, Trello agile workflow setup & card monitoring. |
| **[llan]** | PO / Infrastructure & Dev | Multi-network containerized environment isolation (`gateway` & `internal`), Nginx Reverse Proxy routing (HTTPS/TLS), automated OpenSSL certificate script, WSS reverse proxy configuration, and Chat frontend components (Angular). |
| **[jvega]** | Tech Lead / Developer Fullstack | Technical stack selection, global module architecture design, chat (backend), dashboard (backend + frontend), taskforce frontend. |
| **[lpatin]** | Frontend Developer | Angular SPA architecture & core layout initialization (11 pages, Bootstrap 5), robust HTTP JWT Interceptor (automatic refresh, RxJS race condition queue), interactive Friends UI system, and FormData/multipart profile upload integration. |


> 💡 **Shared Developer Responsibilities:** Every team member actively participated in writing code for assigned features, performing thorough peer reviews on active Pull Requests, conducting baseline runtime testing, and logging issues on Trello.


### 📊 Git Contribution & Verification
To ensure complete transparency and verify the active contribution of each team member, you can run the following standard Git command at the root of the repository to display the commit count per contributor:

```bash
git shortlog -sn --all
```

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

## 🧩 Modules Matrix & Implementation Details

> 📊 **Agile Project Management:** Our team utilized an industry-standard Trello board to track user stories, assign tasks, and manage module progress. Each feature listed below corresponds directly to a tracked card and its verified contributors: **[View our Project Trello Board](https://trello.com/invite/b/69e0a04fb8bc3307cb0afcbd/ATTI3992b0cdebbe4d9dfd741841b2ec4bfdA68A2498/transcendence)**.

## 🧩 Modules Matrix & Implementation Details

### 📈 Points Calculation Summary
* **7 Major Modules** × 2 points = **14 points**
* **8 Minor Modules** × 1 point = **8 points**
* **Total Project Score:** **22 points** *(Exceeds the 14 point curriculum requirement)*

---

### 🧱 Major Modules (2pts each)

#### 1. Integrated Fullstack Frameworks (IV.1)
#### 2. Real-time Features using WebSockets (IV.1)
#### 3. Allow Users to Interact with Other Users (IV.1)
#### 4. Standard User Management & Authentication Suite (IV.3)
#### 5. Advanced Permissions System (IV.3)
#### 6. Backend as Microservices (IV.7)
#### 7. Advanced Analytics Dashboard with Data Visualization (IV.8)

---

### ⚙️ Minor Modules (1pt each)

#### 1. ORM Database Management (IV.1)
#### 2. Custom-Made Design System (IV.1)
#### 3. Support for Additional Browsers (IV.2)
#### 4. Remote Authentication with OAuth 2.0 (IV.3)
#### 5. Two-Factor Authentication (IV.3)
#### 6. User Activity Analytics and Insights Dashboard (IV.3)
#### 7. GDPR Compliance Features (IV.8)
#### 8. Health Check and Status Page System (IV.7)

---

## 💡 Individual Contributions

### 👩‍💻 [aeudes] — Ada

* **🌿 Branches:** feature/backend-users-auth, feature/backend-friends-auth, feature/backend-oauth, feature/backend-2fa, feature/frontend-oauth, feature/frontend-add-friend, feature/frontend-2fa
* **🛠️ Contributions:**
  * **Logout:** Logout endpoint.
  * **OAuth 2.0 (backend + frontend):** Google and 42 intra login integration — backend OAuth views with CSRF state validation, and frontend redirect handling, callback processing, and OAuth login buttons.
  * **Two-Factor Authentication (2FA) (backend + frontend):** TOTP setup endpoint with QR code generation (pyotp), OTP verification, enable/disable endpoints. Pre-auth token gate: users with 2FA enabled receive a temporary pre_auth_token and must complete OTP before a real JWT is issued. Frontend: QR code display, OTP input form, and 2FA enable/disable UI.
  * **Friends system (backend):** Complete FriendRequest CRUD (send, accept, reject, cancel), Friendship creation on acceptance, filtered list endpoints (sent / received / all). Add-friend button Angular component.
  * **Navbar:** Centralized all navigation into a single NavbarComponent, eliminating duplicated code across pages.
* **🧠 Challenges:**
  * **Pre-auth 2FA gate:** Needed to block JWT issuance mid-login without breaking the request flow. Solved by issuing a short-lived pre_auth_token exchanged for a real JWT only after the user submits a valid OTP.
  * **OAuth CSRF protection:** Each OAuth redirect generates a random state parameter verified server-side before processing the authorization code.

### 🦺 [llan] — Léo

* **🔒 Infrastructure & Security:** The project is built upon a containerized architecture secured by an Nginx reverse proxy, ensuring component isolation and encrypted traffic.
* **🌐 Network Architecture & Isolation:** The infrastructure utilizes two distinct Docker networks to enforce the principle of least privilege:
  * **`gateway` network (Public):** Connects only the `nginx`, `frontend`, and `backend` containers. This is the only network exposed to the outside world.
  * **`internal` network (Private):** Isolates critical services (`backend`, `redis`, `postgresql`). These services remain entirely invisible to the outside; communication between the backend, database, and cache occurs within this non-encrypted private network.
  * > **Note:** No direct access (e.g., port 8000 for Django or 5432 for Postgres) is exposed to the host machine. All traffic must pass through Nginx.
* **🔑 HTTPS & TLS Implementation:** Encryption is centralized at the `transcendence_nginx` container, acting as the unique TLS/SSL termination point.
  * **Certificate Management:** Upon container startup, the `./tools/setup_ssl.sh` script (utilizing `openssl`) automatically generates private keys and self-signed certificates.
  * **Security:** Certificates are mounted via an internal volume at `/etc/nginx/ssl/`.
  * **Protocol:** The service listens on port **8443** (HTTPS) and enforces TLS v1.2/1.3 protocols.
* **🔀 Reverse Proxy Configuration:** Nginx handles intelligent routing between services:
  * **Frontend (Angular):** Routes the root `/` with HTTP/1.1 support.
  * **API & Admin (Django/Daphne):** Transparent routing for `/api/` and `/admin/` paths.
  * **WebSockets (WSS):** The `/ws/` block is configured to manage asynchronous chat traffic by injecting `Upgrade` and `Connection` headers, enabling secure communication via `wss://`.
  * **Static Files:** Direct access to assets via a shared volume (`static_volume`), bypassing the backend to optimize performance.
* **✅ Validation Procedure (Check-list):** Before launching the infrastructure, ensure the following validations are met:

| Step | Action | Expected Outcome |
| :--- | :--- | :--- |
| **Prerequisites** | Run the control script | No conflicts on ports 8080/8443 |
| **HTTPS** | Access `https://localhost:8443` | Frontend loads with a valid (self-signed) certificate |
| **Isolation** | Attempt direct access `http://localhost:8000` | Connection failure (Port hidden) |
| **Database** | Attempt direct access `localhost:5432` | Connection failure (Isolated in internal network) |

## 🛡️ Health Check & Backups

The system is engineered for maximum uptime and reliability, featuring automated health monitoring, robust data persistence, and a proven "Zero-Loss" disaster recovery workflow.

### 1. Health Monitoring & Service Orchestration
To prevent cascading failures during startup, the infrastructure employs a strict service-dependency protocol:

* **Docker Native Healthcheck:** The database container performs a `pg_isready` check every 5 seconds. The `backend` service is configured to depend on this healthy state before attempting to initialize.
* **Entrypoint Guard:** An automated `netcat` (`nc -z db 5432`) loop in the `entrypoint.sh` script halts database migrations until the SQL port is fully open and responsive, ensuring a stable database connection from the very first millisecond.
* **Visual Status Dashboard:** **PGAdmin 4** is integrated into the stack (accessible via port **5050**), serving as a real-time monitoring dashboard to track database load, memory usage, and active connections.

### 2. Data Integrity & Persistence
Data is shielded from the volatile lifecycle of containers through strict isolation:

* **Isolated Persistence:** All critical data resides in named Docker volumes (`postgres_data`). This ensures that even if containers are destroyed or updated, the database content remains intact on the host storage.
* **Snapshot-Ready Backups:** Using `make backup`, the system triggers an industry-standard `pg_dump` of the live database, allowing for consistent, "hot" snapshots without interrupting user sessions or the chat service.

### 3. Disaster Recovery Plan (The "Zero-Loss" Protocol)
In the event of a catastrophic system failure, the architecture supports a rapid, two-step restoration process:

1. **Cold Reconstruction:** Use `docker compose up -d` to rebuild the entire containerized environment from scratch.
2. **Automated Injection:** Run `make restore` to automatically detect the latest snapshot and inject it into the fresh database instance.

| Feature | Tool / Command | Purpose |
| :--- | :--- | :--- |
| **Health Check** | `pg_isready` | Ensures DB availability before backend starts |
| **Status Page** | PGAdmin 4 (Port 5050) | Real-time monitoring of DB load and health |
| **Backup** | `make backup` | Automated, non-disruptive hot snapshots |
| **Recovery** | `make restore` | Instant data re-injection for full system recovery |

---

### 💡 Resilience Best Practice
* **Routine Maintenance:** It is recommended to run `make backup` periodically or before any major structural code changes.


---

* **🛠️ Maintenance Notes:**
  * **Persistence:** Database data is persisted via the `postgres_data` volume.
  * **Security:** Private keys are excluded from version control via `.gitignore`.

### 🛠️ [doberes] — Dorina

* **🌿 Branches:** `readme/dorina`, `backend/init-django`, `backend/core-setup`, `feature/backend-rgpd`, `feature/migration-chat-core`, `backend/feat-send-gdpr-export-by-mail`, `feature/backend-i18n-admin-panel`
* **🛠️ Contributions:**
  * **Core Setup & Project Architecture:** Initialized the primary Django framework configuration, created the `users` and migrated the `chat` application, and driven the core branch fusion with Jeffrey before hand-off to infrastructure.
  * **User Account Lifecycle (`apps/users/`):** Implemented the custom PostgreSQL User Model from scratch and co-developed the base RESTful authentication funnel (routing architecture, serializers, and views for Register, Login, Me, and Refresh) with Ada.
  * **Profile CRUD & Dynamic Avatars:** Built the generic `MeView` (`GET`, `PATCH`, `DELETE`) for profile adjustments and hooked the Dicebear API to generate default vector avatars using username seeds.
  * **GDPR Compliance:** Built a centralized `UserExportView` (APIView) compiling multi-app data into a single JSON payload and integrated an automated confirmation email upon account deletion and data export.
  * **Admin Panel Customization & Localization:** Configured the global visual theme, applied custom layouts and filters for the User model, and implemented internal translations (`gettext_lazy`, `i18n`).
  * **Project Management & QA Habits:** Created and maintained the global Trello workspace boards. Initiated development quality standards by self-imposing detailed PR logs.
* **🧠 Challenges:**
  * **Blank-Slate Framework Architecture:** Orchestrating an optimal fullstack boilerplate architecture from scratch without prior framework exposure.
  * *Lesson Learned:* Starting with an ultra-minimal setup and integrating application dependencies iteratively prevents structural overhead.

### 💻 [jvega] — Jeffrey

* **🌿 Branches:** `fix/dashboardAdmin`, `feature/dashboardv2`, `feat/merge_friends`, `feature/dashboard`, `feature/migration-chat-core-v2`, `test/chat-websocket-page`, `init/backend_chat`, `feature/migration-chat-core`   
* **🛠️ Contributions:**
  * **Core Setup & Installations:** Prepared base Django installation, PostgreSQL database hooks, Redis, and WebSockets environment configuration. Handed over Docker configurations to Leo for a unified multi-network container integration.
  * **Real-time Chat Engine (`backend/apps/chat/`):** Designed and developed the entire chat application. Implemented `Conversation` and `Message` models, REST serializers, views (listing/creating rooms and messages), and WebSocket routing using Django Channels consumers. Added strict access control ensuring only authenticated chat participants can fetch histories or establish real-time socket sessions. Registered all systems under Django Admin.
  * **Advanced Analytics Dashboard Backend (`backend/apps/analytics/`):** Created custom administrative endpoints (`/api/analytics/admin-dashboard/`) secured under a custom role-based permission system (`IsAdminRole`). Implemented date range queries (`start_date`, `end_date`) and aggregate pipelines compiling key site-wide telemetry data.
  * **Admin UI & Visualization (`frontend/src/app/admin-dashboard/`):** Built the complete responsive frontend dashboard from scratch. Added visual metric cards, multi-axis data graphs (messages by day, top 5 active users, online/offline status splits), and auto-refresh intervals every 10 seconds. Protected the view layer with an Angular `AuthGuard` ensuring automated dashboard redirection upon administrative JWT detection, while serving access-denied warnings for standard profiles.
  * **Data Export Utilities:** Implemented automated native client-side data exporters including Excel-ready structural CSV generation, and custom CSS print stylesheets designed for beautiful A4 PDF compilation.
  * **Avatar File Upload Management:** Engineered local user avatar upload pipelines (Commit `f921027e`). Built frontend preview components, updated profile persistence payloads using `FormData`, configured Django media handler structures (`MEDIA_URL`/`MEDIA_ROOT`), and set up the shared Docker `media_volume` mounted directly under Nginx `/media/` paths.

### 🎨 [lpatin] — Lény

* **🌿 Branches:** `feature/frontend-init`, `feature/frontend-design-system`, `feature/frontend-core-wiring`
* **🛠️ Contributions:**
  * **Global UI Initialization:** Designed and initialized the entire frontend boilerplate, establishing structural layouts, global dark/light visual style guidelines, and root typography rules.
  * **Custom Design System:** Built a library of modular, highly reusable component architectures (buttons, input handlers, container cards, form validation modules, and notification overlays) guaranteeing user interface visual cohesion across all microservice pages.
  * **Core API Integration:** Integrated basic UI structures directly onto core backend API route pipelines, configuring data bindings and interceptors to parse model objects back into interactive Angular views.

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
