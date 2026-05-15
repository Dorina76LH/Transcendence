# 📘 Backend Theory & Architecture - Transcendence

This document details the technical logic and architecture of the Transcendence Django backend, from low-level network protocols to framework orchestration.

---
## 🌐 1. Network Fundamentals: HTTP vs WebSockets

### HTTP (HyperText Transfer Protocol)
HTTP is a **stateless** request/response protocol. In this project, it handles all standard data management (CRUD).

* **Statelessness:** The server does not "remember" previous requests. Each exchange is independent, which is why we use **JWT (JSON Web Tokens)** to identify the user at every request.
* **Anatomy of a Request:**
    * **Start Line:** Method (GET, POST, PUT, DELETE) + URL + HTTP Version.
    * **Headers:** Metadata (e.g., `Content-Type: application/json`, `Authorization: Bearer <token>`).
    * **Body:** The actual data payload (JSON).
* **Response Structure:**
    * **Status Code:** Categorized indicators:
        *   `1xx`: Informational.
        *   `2xx` (Success): **200 OK**, **201 Created**.
        *   `3xx` (Redirection): **301 Moved Permanently**, **304 Not Modified**.
        *   `4xx` (Client Error): **400 Bad Request**, **401 Unauthorized**, **404 Not Found**.
        *   `5xx` (Server Error): **500 Internal Server Error**.
    * **Body:** Usually returning JSON data or error messages.

### 📊 HTTP Status Codes (The Survival List)

| Code | Meaning | Project Context |
| :--- | :--- | :--- |
| **200 OK** | Success | Standard data retrieval. |
| **201 Created** | Resource created | User registration or message sent. |
| **304 Not Modified** | Cached | Efficient loading of static assets. |
| **400 Bad Request** | Client Error | Invalid form data (Serializer error). |
| **401 Unauthorized** | Auth Error | Missing or expired JWT token. |
| **403 Forbidden** | Permission Error | User trying to edit someone else's profile. |
| **404 Not Found** | Missing Resource | Wrong URL or resource doesn't exist. |
| **500 Internal Error** | Server Error | Python/Django code crashed. |

---

## 🏗️ 2. API Design & REST Architecture

An **API (Application Programming Interface)** allows the Frontend (Angular) and Backend (Django) to communicate. We follow the **REST** (Representational State Transfer) style.

### REST Principles
*   **Resources:** Everything is a resource identified by a **URI** (e.g., `/api/users/`).
*   **Intention:** The HTTP method defines the action.
*   **JSON:** The universal format used for exchanging data.

| Action | HTTP Method | CRUD Equivalent | Intent |
| :--- | :--- | :--- | :--- |
| **Create** | `POST` | **C**reate | Register a new user or send a chat message. |
| **Read** | `GET` | **R**ead | Fetch user profile or message history. |
| **Update** | `PUT` / `PATCH` | **U**pdate | `PUT` (Full update) or `PATCH` (Partial update). |
| **Delete** | `DELETE` | **D**elete | Remove a friend or a resource. |

---

## 🐍 3. The Django Engine (Deep Dive)

### The Request Flow (The Restaurant Metaphor)
1.  **URL (The Menu):** The entry point. It maps the path to the correct **View**.
2.  **VIEW (The Waiter):** The coordinator. It receives the `Request` object, checks permissions (Is the user logged in?), and hands the data to the Chef.
3.  **SERIALIZER (The Chef):** The translator and quality controller.
    *   **De-serialization:** JSON → Python objects.
    *   **Validation:** Level 1 (Required fields/Types) & Level 2 (Business logic, e.g., "Is this email unique?").
    *   **Serialization:** Python objects → JSON for the final response.
4.  **MODEL (The Pantry):** The single source of truth defining the database structure.

### 🗃️ ORM & The Shape Sorter (Data Integrity)
*   **Object-Relational Mapping (ORM):** Translates Python code into SQL. We manipulate objects (`User.objects.get(id=1)`) instead of writing raw SQL queries.
*   **The Shape Sorter:** The Model acts as a box with specific holes. A `CharField` is a star-shaped hole; an `EmailField` is a round hole. If the data "shape" doesn't match, the **Database (PostgreSQL)** rejects it.
*   **Migrations:** Version control for the database. `makemigrations` creates the plan, and `migrate` applies it to the DB.

### 👤 Custom User Model
We extended Django's `AbstractUser` to include:
*   **is_online:** Updated via WebSocket connect/disconnect signals.
*   **Friends:** A `ManyToManyField` for social networking.
*   **Avatar Management:** A hybrid system using **ImageField** for uploads and **DiceBear API** (@property) as a fallback generator.

---

## 🔐 4. Authentication: JWT (The Digital Badge)

**JWT (JSON Web Token)** is a stateless authentication method. The server doesn't need to store "sessions"; it trusts the cryptographic **Signature**.

### Token Structure: `Header.Payload.Signature`
*   **Header:** Identifies the hashing algorithm (e.g., HMAC SHA256).
*   **Payload:** Contains encoded user info (User ID, Expiration). *Note: This is public data, never store passwords here.*
*   **Signature:** A unique hash created using the server's `SECRET_KEY`. If the payload is tampered with, the signature fails validation.

### Token Strategy
*   **Access Token:** Short-lived (e.g., 60 mins). Sent in the `Authorization` header for every request.
*   **Refresh Token:** Long-lived. Used only to request a new Access Token, minimizing security risks if an Access Token is stolen.

---

## 🐳 5. Infrastructure: Dockerization

We use **Docker** to ensure the project runs exactly the same on every machine.

*   **Image:** A read-only template containing the OS, Python, and dependencies.
*   **Container:** A running instance of an image—an isolated environment.
*   **Docker Compose:** The orchestrator. It launches and connects our services:
    *   `db`: PostgreSQL database.
    *   `backend`: Django application (running Gunicorn/Daphne).
    *   `frontend`: Angular application (served by Nginx).
*   **Reproducibility:** Fixes the "it works on my machine" issue by standardizing the entire environment.

---

### 🔐 6. Security: SSL vs TLS
We use **HTTPS** (HTTP + Encryption) to ensure data privacy and integrity:
*   **SSL (Secure Sockets Layer):** The legacy security protocol (now deprecated).
*   **TLS (Transport Layer Security):** The modern successor. It encrypts the data stream and authenticates the server using certificates, preventing "Man-in-the-Middle" (MITM) attacks.

---

### ⚡ 7. WebSockets (Real-Time Communication)
Unlike HTTP's "one-shot" connection, WebSockets provide a **persistent, full-duplex** bridge.
*   **The Handshake:** The connection starts as an HTTP request but "Upgrades" to a WebSocket (`ws://` or `wss://`) via **Django Channels/Daphne**.
*   **Bidirectional:** Both client and server can send data at any time without waiting for a request.
*   **Use Case:** Essential for the **Live Chat**, **Notifications**, and **Game State** where immediate data delivery is required.

---

### 🚀 8. Essential Developer Cheat Sheet

```bash
# Build and start all services
docker compose up --build

# Run migrations inside the container
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate

# Check logs in real-time (Crucial for debugging 500 errors)
docker compose logs -f backend

# Clean up environment (Fixes space issues on /goinfre)
docker system prune -a --volumes

# Access the Database CLI
docker exec -it db psql -U user -d dbname
```

---
