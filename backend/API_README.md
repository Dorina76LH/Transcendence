# 📑 Transcendance — Global API Documentation

This document centralizes all backend API routes. It serves as the **permanent interface contract** between the Frontend (Angular) and the Backend (Django).

> ⚠️ **Team Rule:** Any changes to a route, parameter, or JSON response must be discussed with the team and updated here *before* pushing to `dev`.
> 🌐 **Base URL:** `https://localhost/` (managed by the Nginx Reverse Proxy).

---

## ⚙️ How this API Contract is Built (Methodology)

To ensure consistency and technical accuracy, every module in this document must follow this 3-step investigation process based directly on the Django backend source code.

### Step 1: Mapping Endpoints via URL Files (`urls.py`)
The exact path is always a **mathematical addition** between the core router and the application router.
1. Check `core/urls.py` to find the application's root prefix (e.g., `path('api/auth/', include(...))`).
2. Check the specific application's `urls.py` (e.g., `apps/users/urls.py`) to find the sub-path (e.g., `path('register/', ...)`).
3. **Result:** `api/auth/` + `register/` = `api/auth/register/`.

### Step 2: Identifying HTTP Methods (Verbs) via Views (`views.py`)
To discover which HTTP verbs (`GET`, `POST`, `PATCH`, `DELETE`) a route actually accepts, look at the **class type** or **methods defined** inside `views.py`:

* **Manual Views (`APIView`):** Look at the explicit Python function names.
  * `def get(self, request):` $\rightarrow$ Accepts **GET**
  * `def post(self, request):` $\rightarrow$ Accepts **POST**
* **Generic Views (`generics.XXXXAPIView`):** DRF handles the verbs automatically based on the class name:
  * `CreateAPIView` $\rightarrow$ Accepts **POST** (Create)
  * `ListAPIView` $\rightarrow$ Accepts **GET** (List)
  * `ListCreateAPIView` $\rightarrow$ Accepts **GET** (List) + **POST** (Create)
  * `UpdateAPIView` $\rightarrow$ Accepts **PUT + PATCH** (Update - both verbs, same action)
  * `DestroyAPIView` $\rightarrow$ Accepts **DELETE** (Destroy)
    : the handler can override the same behavior(e.g. soft-delete instead of real delete - the row stays in the base, we only change its status to CANCELED)
  * `RetrieveUpdateDestroyAPIView` $\rightarrow$ Accepts **GET** (Read), **PATCH/PUT** (Update), and **DELETE** (Destroy).

  [
   * **ListAPIView** — used by FriendListView, FriendRequestReceivedView, FriendRequestSentView
   * **ListCreateAPIView** — used by FriendRequestView
   * **UpdateAPIView** — used by FriendRequestAcceptView, FriendRequestRejectView
   * **DestroyAPIView** — used by FriendRequestCancelView (overrides destroy to cancel, not delete) and FriendUnfriendView
   * **RetrieveUpdateDestroyAPIView** — used by MeView
  ]


### Step 3: Verifying Access Control (Permissions)
Authentication requirements are explicitly enforced in the view via the `permission_classes` attribute. Always check this list to document access constraints:

* `permission_classes = [AllowAny]` $\rightarrow$ **Auth Required: ❌ No**. The endpoint is public (e.g., Login, Register).
* `permission_classes = [IsAuthenticated]` $\rightarrow$ **Auth Required:  Yes**. DRF will block the request with a `401 Unauthorized` if a valid JWT token is missing.
* `permission_classes = [IsAuthenticated, IsReceiverOfRequest]` $\rightarrow$ **Auth Required:  Yes**. (When multiple permissions are listed, all must pass(AND logic))
*  `permission_classes = [IsAuthenticated, IsSenderOfRequest]` $\rightarrow$ **Auth Required:  Yes**. (When multiple permissions are listed, all must pass (AND logic))
* **Special cases:** In this project: IsReceiverOfRequest and IsSenderOfRequest are custom guards that check the relationship between the authenticated user and the specific FriendRequest object - not just whether the user is logged in.
---

## 🗺️ Applications Map

* [👤 1. Authentication & Users Module](#-1-authentication--users-module) — *Active (In Development)*
* [💬 2. Chat & Messaging Module](#-2-chat--messaging-module) — *To be documented*
* [👥 3. Friends & Relations Module](#-3-friends--relations-module) — *To be documented*
* [📊 4. Analytics & Statistics Module](#-4-analytics--statistics-module) — *To be documented*

---

## 👤 1. Authentication & Users Module

### 📋 Endpoints Overview

| Method | Endpoint | Auth Required? | Payload (Expected JSON) | Success HTTP | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **POST** | `api/auth/register/` | ❌ No | Username,<br> Email,<br> Password | `201` | Signup + Auto-login |
| **POST** | `api/auth/login/` | ❌ No | Email,<br>Password | `200` | Sign in<br>(Get JWT tokens) |
| **POST** | `api/auth/logout/` |  Yes | Refresh token (optional&nbsp;if&nbsp;cookie)| `205` | Sign out + Blacklist token |
| **GET** | `api/auth/me/` |  Yes | *None* | `200` | Fetch current user profile |
| **PATCH**| `api/auth/me/` |  Yes | Username&nbsp;(opt),<br>Email&nbsp;(opt),<br>First_name&nbsp;(opt),<br>Last_name&nbsp;(opt),<br>Avatar&nbsp;(file, opt) | `200` | Update profile / avatar |
| **DELETE**| `api/auth/me/` |  Yes | *None* | `204` | Delete&nbsp;account (GDPR&nbsp;compliance)|
| **POST** | `api/auth/token/refresh/` | ❌ No | Refresh token | `200` | Generate new Access Token |

### 💡 Important Architecture Notes for Frontend Integration

#### A. Authentication Identifier Contract (Email-Driven)
* **The Identifier is the Email:** In compliance with the backend `USERNAME_FIELD = 'email'`, the login endpoint expects the **Email** and **Password** combination. Passing a username inside the login payload will fail.

#### B. The Context-Driven Profile (`api/auth/me/`)
* **No ID required:** You do **not** need to append an ID to the URL (do not write `api/auth/me/42/`). 
* **How to use:** Simply send a `GET`, `PATCH`, or `DELETE` request to `api/auth/me/` with the `Authorization: Bearer <access_token>` header. The backend automatically identifies who you are based on the token signature.

#### C. Stateful Synchronization during Stateless Logout (`api/auth/logout/`)
* **Dual-Action:** Clicking logout triggers an instant database update setting your status to `is_online: false` (notifying chat WebSockets) and blacklists your Refresh Token simultaneously.
* **Token Invalidation:** Once a refresh token is sent to this endpoint, it is permanently killed. Your Frontend application must immediately clear the tokens from local storage or cookies and redirect the user to the landing page.

### 🔍 JSON Structures Detail (Users)

<details>
<summary><b>Detail: Registration (POST api/auth/register/)</b></summary>

**Expected Payload (POST api/auth/register/):**
```json
{
  "username": "marvin",
  "email": "marvin@student.42.fr",
  "password": "SuperSecurePassword123!"
}
```

**Success Response (201 Created):**
```json
{
  "user": {
    "id": 42,
    "username": "marvin",
    "email": "marvin@student.42.fr",
    "first_name": "",
    "last_name": "",
    "avatar_url": "https://api.dicebear.com/9.x/bottts/svg?seed=marvin",
    "is_online": true,
    "role": "user"
  },
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Expected Payload (POST api/auth/login/):**
```json
{
  "email": "marvin@student.42.fr",
  "password": "SuperSecurePassword123!"
}
```

**Success Response (200 OK):**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 42,
    "username": "marvin",
    "email": "marvin@student.42.fr",
    "first_name": "",
    "last_name": "",
    "avatar_url": "https://api.dicebear.com/9.x/bottts/svg?seed=marvin",
    "is_online": true,
    "role": "user"
  }
}
```

**Expected Payload — Partial Update (PATCH api/auth/me/):**
Note: All fields are optional. Content-Type must be multipart/form-data if an avatar file is included.
```json
{
  "username": "marvin_new", <- "I want to change my username to this"
  "first_name": "Marvin",   <- "I want to change my first_name to this"
  "last_name": "Robot"      <- "I want to change my last_name to this"
}
```

**Success Response — 200 OK:**
```json
{
  "id": 42,
  "username": "ada", <- "name changed"
  "email": "marvin@student.42.fr",
  "first_name": "Ada",
  "last_name": "Eds", <- "last name changed"
  "avatar_url": "https://api.dicebear.com/9.x/bottts/svg?seed=marvin",
  "is_online": true,
  "role": "user"
}
```

**Expected Payload (POST api/auth/logout/):**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response — 205 Reset Content (POST api/auth/logout/):**
```json
{
  "detail": "Successfully disconnected."
}
```
