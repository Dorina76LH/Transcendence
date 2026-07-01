*This project has been created as part of the 42 curriculum by [aeudes], [doberes], [jvega], [llan], [lpatin]*

# ft_transcendence - Advanced Web Platform

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
* **Social, Gaming & Interactive Features:**
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

4.  **Access:**
   * 8080 -> port 80  on nginx -> HTTP
   * [Home page](https://localhost:8443/)
   * [Home page](http://localhost:8080/)
   * [Panel Admin Django](https://localhost:8443/admin/)
   * [Panel Admin PostgreSQL](http://localhost:5050/)

---

## 👥 Team Information & Roles
| Member | Role | Key Responsibilities |
| :--- | :--- | :--- |
| **Léo** (`llan`) | **Product Owner (PO) & Developer** | Defines the product vision, prioritizes features, maintains the product backlog, and makes final decisions on user stories and validation. |
| **Dorina** (`doberes`) | **Project Manager (PM) & Developer** | Facilitates team coordination, organizes meetings/sprints, tracks overall progress against deadlines, and resolves technical or organizational blockers. |
| **Jeffrey** (`jvega`) | **Technical Lead / Architect & Developer** | Supervises overall architecture design, enforces coding best practices, leads technology choices, and drives critical code reviews. |
| **Ada** (`aeudes`) | **Developer / DevOps** | Implements backend architecture, handles containerized service workflows, network isolation features, and software hardening. |
| **Lény** (`lpatin`) | **Developer / Fullstack Specialist** | Implements robust features, participates in frontend layout/component interactivity, and drives core codebase integration. |

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
* **Team Members:** 
* **How it was Implemented:** Designed a multi-container ecosystem using **Angular** for reactive standalone components on the frontend, and **Django REST Framework (DRF)** to serve securely routed APIs behind an Nginx gateway.

#### 2. Real-time Features using WebSockets (IV.1)
* **Team Members:** 
* **How it was Implemented:** Built utilizing full HTML5 WebSockets pipelines. The chat system and game loop run on asynchronous channels providing real-time updates and connection handling.

#### 3. Allow Users to Interact with Other Users (IV.1)
* **Team Members:** 
* **How it was Implemented:** Developed a backend relational system tracking direct friendship records, online/offline status toggles, and a basic chat system to send/receive messages between users alongside profile viewing.

#### 4. Standard User Management & Authentication Suite (IV.3)
* **Team Members:** 
* **How it was Implemented:** Integrated secure profile updating, traditional credentials management, and unique user identifiers linked to our backend storage.

#### 5. Advanced Permissions System (IV.3)
* **Team Members:** 
* **How it was Implemented:** Created a server-side Role-Based Access Control (RBAC) authorization middleware that dynamically validates token payloads, restricting specific views and endpoints based on user roles.

#### 6. Backend as Microservices (IV.7)
* **Team Members:** 
* **How it was Implemented:** Split the platform into decoupled containerized environments separating core logic (Authentication, Chat, Matchmaking). Services communicate via isolated internal Docker networks.

#### 7. Advanced Analytics Dashboard with Data Visualization (IV.8)
* **Team Members:** 
* **How it was Implemented:** Designed and deployed an interactive administration control panel featuring rich data visualization charts (line, bar, pie), real-time internal database counters, and customizable date range filters.

---

### ⚙️ Minor Modules (1pt each)

#### 1. ORM Database Management (IV.1)
* **Team Members:** 
* **How it was Implemented:** Leveraged Django ORM for strict database abstraction and schema generation inside a PostgreSQL container, coupled with a dedicated `pgAdmin` panel on port 5050 for team tracking.

#### 2. Custom-Made Design System (IV.1)
* **Team Members:** 
* **How it was Implemented:** Crafted a custom standalone component architecture entirely from scratch using Angular, providing at least 10 reusable and styled graphical interface components.

#### 3. Support for Additional Browsers (IV.2)
* **Team Members:** 
* **How it was Implemented:** Conducted cross-browser styling audits and layout adjustments to ensure uniform UI/UX compatibility across Google Chrome, Mozilla Firefox, and Apple Safari.

#### 4. Remote Authentication with OAuth 2.0 (IV.3)
* **Team Members:**
* **How it was Implemented:** Integrated secure Google and 42 Intra OAuth 2.0 third-party authentication protocols to provide one-click remote logins.

#### 5. Two-Factor Authentication (IV.3)
* **Team Members:** 
* **How it was Implemented:** Secured user account validation using a functional Time-based One-Time Password (TOTP) 2FA layer, scanning a secure QR code layout upon login.

#### 6. User Activity Analytics and Insights Dashboard (IV.3)
* **Team Members:** 
* **How it was Implemented:** Built automated tracking fields capturing registration timestamps, connection frequencies, and user statistics to feed data counters on the admin dashboard.

#### 7. GDPR Compliance Features (IV.8)
* **Team Members:** 
* **How it was Implemented:** Programmed dedicated account utilities enabling immediate operational data download (structured JSON format) and permanent account erasure ("Right to be Forgotten").

#### 8. Health Check and Status Page System (IV.7)
* **Team Members:** 
* **How it was Implemented:** Deployed automated container health checks monitoring the environment status and database connectivity alongside manual configuration restoration routines.

---

## 💡 Individual Contributions

### 1. The Microservices Architecture Conception vs. Framework Learning Curve
* **The Challenge:** Our team planned a decoupled Microservices infrastructure from Day 1. However, we hit a structural bottleneck when implementation began: while the infrastructure team was ready to isolate environments, the backend team had to simultaneously learn the inner workings of Django and dissect the dense core features demanded by the subject (real-time chat loops, multi-level friendship systems, and user profiles). Each developer initially prototyped their logic in separate standalone environments to "clear the path" and understand the framework. This slowed down infrastructure integration since the DevOps track had to wait for these exploratory backend components to stabilize before finalizing Docker network definitions and routing rules.
* **How it was Overcome:** We ran collaborative integration workshops where we audited the pathfinding code written by the backend team, synchronized our understanding of Django's modular app structure, and smoothly migrated the isolated logic into a clean, orchestrated multi-container architecture.
* **Lesson Learned:** For complex framework learning curves, it is highly efficient to implement a unified minimalistic skeleton on Day 1. This gives developers a shared playground to test and understand features directly within the targeted microservices infrastructure, avoiding downstream migration friction.

### 2. Underestimating the Front-End Workload
* **The Challenge:** Because basic static frontend components render rapidly in the browser, our team initially underestimated the total workload required for the user interface. We quickly realized that building a responsive Single Page Application (SPA) entirely from scratch using Angular—handling dynamic component states, standard token-based authentication protection, and fluid real-time data streaming simultaneously—required far more architectural design and development hours than anticipated.
* **How it was Overcome:** We decoupled our development pipeline. We refocused our workflows by pairing up team members through peer programming sessions to complete the modular Angular component system while strictly prioritizing essential interactive views.
* **Lesson Learned:** Visual progress does not equal structural completion. Future front-end timelines must be estimated with the same algorithmic complexity as backend microservices.

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
