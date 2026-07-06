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
* **Generic Views (`generics.XXXXAPIView`):** DRF handles the verbs automatically based on the class architecture.

| DRF View Type / Class | Active HTTP Method(s) | Default Action & Framework Behavior / Code Signature |
| :--- | :--- | :--- |
| **Manual Views** (`APIView`) | *Custom* | Bound manually via explicit Python functions:<br>• `def get(self, request):` $\rightarrow$ Accepts **GET**<br>• `def post(self, request):` $\rightarrow$ Accepts **POST** |
| `CreateAPIView` | **POST** | **Create:** Handles resource creation. |
| `ListAPIView` | **GET** | **List:** Handles listing collections of resources. |
| `ListCreateAPIView` | **GET** / **POST** | **List + Create:** Combines resource listing and creation workflows. |
| `UpdateAPIView` | **PUT** / **PATCH** | **Update:** Both verbs trigger the same underlying action. |
| `DestroyAPIView` | **DELETE** | **Destroy:** Handles resource deletion. The handler can override this behavior (e.g., soft-delete instead of real delete—the row stays in the base, we only change its status to `CANCELED`). |
| `RetrieveUpdateDestroyAPIView` | **GET** / **PATCH** / **PUT** / **DELETE** | **Read, Update, and Destroy:** Encompasses the full lifecycle of a single specific resource. |
  
### Step 3: Verifying Access Control (Permissions)
Authentication requirements are explicitly enforced in the view via the `permission_classes` attribute. Always check this list to document access constraints:

* `permission_classes = [AllowAny]`<br>$\rightarrow$ **Auth Required: ❌ No**. The endpoint is public (e.g., Login, Register).
* `permission_classes = [IsAuthenticated]`<br>$\rightarrow$ **Auth Required:  Yes**. DRF will block the request with a `401 Unauthorized` if a valid JWT token is missing.
* `permission_classes = [IsAuthenticated, IsReceiverOfRequest]` <br>$\rightarrow$ **Auth Required:  Yes**. (When multiple permissions are listed, all must pass(AND logic))
*  `permission_classes = [IsAuthenticated, IsSenderOfRequest]`<br> $\rightarrow$ **Auth Required:  Yes**. (When multiple permissions are listed, all must pass (AND logic))
* `Special cases = [IsReceiverOfRequest, IsSenderOfRequest]`<br>$\rightarrow$ In this project IsReceiverOfRequest and IsSenderOfRequest are custom guards that check the relationship between the authenticated user and the specific FriendRequest object - not just whether the user is logged in.
---

## 🗺️ Applications Map

* [👤 1. Authentication & Users Module](#-1-authentication--users-module) — *Active (In Development)*
* [💬 2. Chat & Messaging Module](#-2-chat--messaging-module) — *Active*
* [👥 3. Friends & Relations Module](#-3-friends--relations-module) — *To be documented*
* [📊 4. Analytics & Statistics Module](#-4-analytics--statistics-module) — *Active*

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
| **GET** | `api/auth/me/export/` |  Yes | *None* | `200` | Monolithic JSON account export (GDPR portability) |
| **POST** | `api/auth/token/refresh/` | ❌ No | Refresh token | `200` | Generate new Access Token |

### 🔍 Backend Implementation Mapping (Users)

> 🔒 **Global Policy:** `permission_classes = [IsAuthenticated]` is enforced across all user context endpoints except register, login, and token refresh (`AllowAny`).

| Endpoint | Django View Class | DRF Generic Class | Active HTTP Verbs | Custom Behavior / Notes |
| :--- | :--- | :--- | :--- | :--- |
| `api/auth/register/` | `RegisterView` | `CreateAPIView` | **POST** | Validates uniqueness of email/username, triggers auto-login payload. |
| `api/auth/login/` | `LoginView` | `APIView` | **POST** | Custom handling for email/password validation against `USERNAME_FIELD`. |
| `api/auth/logout/` | `LogoutView` | `APIView` | **POST** | Updates `is_online = False` and blacklists the refresh token. |
| `api/auth/me/` | `MeView` | `RetrieveUpdateDestroyAPIView` | **GET** / **PATCH** / **PUT** / **DELETE** | Context-driven. Routes all actions without exposing user IDs in the URL. |
| `api/auth/me/export/` | `UserExportView` | `APIView` | **GET** | Monolithic manual drive compilation aggregation across Users, Friends, and Chat apps. |
| `api/auth/token/refresh/`| `TokenRefreshView` | SimpleJWT Base | **POST** | Standard SimpleJWT token rotation implementation. |

### 💡 Important Architecture Notes for Frontend Integration

#### A. Authentication Identifier Contract (Email-Driven)
* **The Identifier is the Email:** In compliance with the backend `USERNAME_FIELD = 'email'`, the login endpoint expects the **Email** and **Password** combination. Passing a username inside the login payload will fail.

#### B. The Context-Driven Profile (`api/auth/me/`)
* **No ID required:** You do **not** need to append an ID to the URL (do not write `api/auth/me/42/`). 
* **How to use:** Simply send a `GET`, `PATCH`, or `DELETE` request to `api/auth/me/` with the `Authorization: Bearer <access_token>` header. The backend automatically identifies who you are based on the token signature.

#### C. Stateful Synchronization during Stateless Logout (`api/auth/logout/`)
* **Dual-Action:** Clicking logout triggers an instant database update setting your status to `is_online: false` (notifying chat WebSockets) and blacklists your Refresh Token simultaneously.
* **Token Invalidation:** Once a refresh token is sent to this endpoint, it is permanently killed. Your Frontend application must immediately clear the tokens from local storage or cookies and redirect the user to the landing page.

#### D. GDPR Multi-App Monolithic Export (`api/auth/me/export/`)
* **Single Request Portability:** In compliance with GDPR Article 20, hitting this route returns all profile data, social connections, active friendships, friend requests, rooms joined, and textual history in a singular nested JSON object.

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
  "username": "marvin_new", <- I want to change my username to this
  "first_name": "Marvin",   <- I want to change my first_name to this
  "last_name": "Robot"      <- I want to change my last_name to this
}
```

**Success Response — 200 OK:**
```json
{
  "id": 42,
  "username": "marvin_new", <- changed
  "email": "marvin@student.42.fr",
  "first_name": "Marvin",   <- changed
  "last_name": "Robot",     <- changed
  "avatar_url": "https://api.dicebear.com/9.x/bottts/svg?seed=marvin",
  "is_online": true,
  "role": "user"
}
```

**Success Response - 200 OK (GET api/auth/suer/me/export):**
```json
{
  "id": 42,
  "username": "marvin",
  "email": "marvin@student.42.fr",
  "role": "user",
  "is_online": true,
  "date_joined": "2026-06-19T13:20:00Z",
  "last_login": "2026-06-19T14:15:22Z",
  "social_accounts": [
    {
      "provider": "google",
      "uid": "123456789",
      "created_at": "2026-06-19T13:20:00Z"
    }
  ],
  "friends_data": {
    "active_friendships": [
      {
        "id": 1,
        "friend": { "id": 5, "username": "Arthur", "email": "dent@earth.com" },
        "created_at": "2026-06-19T13:25:00Z"
      }
    ],
    "friend_requests_history": []
  },
  "chat_data": {
    "conversations_joined": [
      {
        "id": 12,
        "participants": [
          { "id": 42, "username": "marvin", "email": "marvin@student.42.fr" },
          { "id": 5, "username": "Arthur", "email": "dent@earth.com" }
        ],
        "created_at": "2026-06-19T13:24:00Z"
      }
    ],
    "messages_sent": [
      {
        "id": 156,
        "conversation": 12,
        "sender": { "id": 42, "username": "marvin" },
        "content": "J'ai la capacité de calculer l'itinéraire idéal, mais vous préférez parler météo.",
        "created_at": "2026-06-19T13:24:30Z"
      }
    ]
  }
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
</details>

---

## 💬 2. Chat & Messaging Module

### 📋 Endpoints Overview

| Method / Protocol | Endpoint | Auth Required? | Payload (Expected JSON) | Success HTTP / Event | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `api/chat/conversations/` | ✅ Yes | *None* | `200` | List every conversation where the current user is a participant |
| **POST** | `api/chat/conversations/create/` | ✅ Yes | `participant_id` | `200` | Create a one-to-one conversation with another user, or return the existing conversation |
| **GET** | `api/chat/conversations/<conversation_id>/messages/` | ✅ Yes | *None* | `200` | Load the ordered message history of one conversation |
| **POST** | `api/chat/messages/` | ✅ Yes | `conversation`, `content` | `201` | REST fallback for creating a message inside a conversation |
| **WebSocket** | `ws/chat/conversations/<conversation_id>/?token=<access_token>` | ✅ Yes | `{ "message": "..." }` | `chat_message` event | Send and receive real-time messages for one conversation |


### 🔍 Backend Implementation Mapping (Chat & Messaging)

> 🔒 **Global Policy:** REST endpoints use `permission_classes = [IsAuthenticated]`. The conversation WebSocket uses `JWTAuthMiddleware` and only accepts users who belong to the target conversation.

| Endpoint | Django Class | DRF / Channels Class | Active Method(s) | Custom Behavior / Notes |
| :--- | :--- | :--- | :--- | :--- |
| `api/chat/conversations/` | `ConversationListView` | `ListAPIView` | **GET** | Filters `Conversation` rows with `participants=request.user`, ordered by newest `created_at`. |
| `api/chat/conversations/create/` | `ConversationCreateView` | `CreateAPIView` | **POST** | Validates `participant_id`, rejects self-conversations, returns an existing two-user conversation if found, otherwise creates one. |
| `api/chat/conversations/<conversation_id>/messages/` | `MessageListView` | `ListAPIView` | **GET** | Returns only messages from conversations where the authenticated user is a participant, ordered by oldest `created_at`. |
| `api/chat/messages/` | `MessageCreateView` | `CreateAPIView` | **POST** | Saves `sender=request.user`. Rejects the request if the user is not a participant of the target conversation. |
| `ws/chat/conversations/<conversation_id>/?token=<access_token>` | `ChatConversationConsumer` | `AsyncWebsocketConsumer` | **CONNECT** / **RECEIVE** | Validates the JWT query token, checks conversation membership, persists each non-empty message, then broadcasts it to the room group. 

### 💡 Important Architecture Notes for Frontend Integration

#### A. Conversation Discovery First
* **Start with `GET api/chat/conversations/`:** This gives the frontend all conversations already linked to the current user.
* **No manual user filtering needed:** The backend only returns conversations where the JWT owner is a participant.

#### B. One-to-One Conversation Creation
* **Payload contract:** `POST api/chat/conversations/create/` expects the other user's ID as `participant_id`.
* **Idempotent behavior:** If a conversation already exists with that participant, the backend returns the existing conversation instead of creating a duplicate.
* **Current status code:** The view returns `200 OK` for both existing and newly created conversations because the custom `create()` method returns `Response(...)` without an explicit `201` status.

#### C. Message History and Live Messages are Split
* **History:** Use `GET api/chat/conversations/<conversation_id>/messages/` when opening a chat room.
* **Live sending:** Use `wss://localhost:8443/ws/chat/conversations/<conversation_id>/?token=<access_token>` and send `{ "message": "hello" }`.
* **Persistence:** WebSocket messages are written to the `Message` table before being broadcast.

#### D. WebSocket Authentication Contract
* **Token location:** The access token is passed in the query string as `?token=<access_token>`.
* **Connection refusal:** Anonymous users or users who are not participants of the conversation are disconnected immediately.

### 🔍 JSON Structures Detail (Chat & Messaging)

<details>
<summary><b>Detail: List Conversations (GET api/chat/conversations/)</b></summary>

**Success Response (200 OK):**
```json
[
  {
    "id": 12,
    "participants": [
      {
        "id": 42,
        "username": "marvin",
        "email": "marvin@student.42.fr"
      },
      {
        "id": 5,
        "username": "arthur",
        "email": "arthur@student.42.fr"
      }
    ],
    "created_at": "2026-06-19T13:24:00Z"
  }
]
```
</details>

<details>
<summary><b>Detail: Create or Reuse Conversation (POST api/chat/conversations/create/)</b></summary>

**Expected Payload:**
```json
{
  "participant_id": 5
}
```

**Success Response (200 OK):**
```json
{
  "id": 12,
  "participants": [
    {
      "id": 42,
      "username": "marvin",
      "email": "marvin@student.42.fr"
    },
    {
      "id": 5,
      "username": "arthur",
      "email": "arthur@student.42.fr"
    }
  ],
  "created_at": "2026-06-19T13:24:00Z"
}
```

**Possible Errors:**
```json
{
  "detail": "User not found."
}
```

```json
{
  "detail": "You cannot create a conversation with yourself."
}
```
</details>

<details>
<summary><b>Detail: Message History (GET api/chat/conversations/&lt;conversation_id&gt;/messages/)</b></summary>

**Success Response (200 OK):**
```json
[
  {
    "id": 156,
    "conversation": 12,
    "sender": {
      "id": 42,
      "username": "marvin",
      "email": "marvin@student.42.fr"
    },
    "content": "Hello Arthur.",
    "created_at": "2026-06-19T13:24:30Z"
  }
]
```
</details>

<details>
<summary><b>Detail: Create Message through REST (POST api/chat/messages/)</b></summary>

**Expected Payload:**
```json
{
  "conversation": 12,
  "content": "Hello Arthur."
}
```

**Success Response (201 Created):**
```json
{
  "id": 156,
  "conversation": 12,
  "sender": {
    "id": 42,
    "username": "marvin",
    "email": "marvin@student.42.fr"
  },
  "content": "Hello Arthur.",
  "created_at": "2026-06-19T13:24:30Z"
}
```
</details>

<details>
<summary><b>Detail: Conversation WebSocket</b></summary>

**Connection URL:**
```text
wss://localhost:8443/ws/chat/conversations/12/?token=<access_token>
```

**Client Message:**
```json
{
  "message": "Hello Arthur."
}
```

**Broadcast Event:**
```json
{
  "message": "Hello Arthur.",
  "message_id": 156,
  "sender_id": 42,
  "username": "marvin",
  "created_at": "2026-06-19T13:24:30.000000+00:00"
}
```
</details>

---

## 👥 3. Friends & Relations Module

### 📋 Endpoints Overview

| Method | Endpoint | Auth Required? | Payload (Expected JSON) | Success HTTP | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `api/friends/` | ✅ Yes | *None* | `200` | List all accepted friends of the current user |
| **GET** | `api/friends/friend-requests/` | ✅ Yes | *None* | `200` | List all friend requests (sent + received) |
| **POST** | `api/friends/friend-requests/` | ✅ Yes | `to_user` (user id) | `201` | Send a friend request |
| **GET** | `api/friends/friend-requests/received/` | ✅ Yes | *None* | `200` | List pending requests received |
| **GET** | `api/friends/friend-requests/sent/` | ✅ Yes | *None* | `200` | List pending requests sent |
| **PATCH** | `api/friends/friend-requests/<id>/accept/` | ✅ Yes | *None* | `200` | Accept a received request |
| **PATCH** | `api/friends/friend-requests/<id>/reject/` | ✅ Yes | *None* | `200` | Reject a received request |
| **DELETE** | `api/friends/friend-requests/<id>/cancel/` | ✅ Yes | *None* | `200` | Cancel a sent request (soft: sets status to `CANCELED`, row kept) |
| **DELETE** | `api/friends/<friend_id>/` | ✅ Yes | *None* | `204` | Remove an accepted friend (hard delete of the Friendship row) |

### 🔍 Backend Implementation Mapping (Friends & Relations)

> 🔒 **Global Policy:** `permission_classes = [IsAuthenticated]` is mandatory across this entire module.

| Endpoint | Django View Class | DRF Generic Class | Active HTTP Verbs | Custom Guards & Notes |
| :--- | :--- | :--- | :--- | :--- |
| `api/friends/` | `FriendListView` | `ListAPIView` | **GET** | Filters `Friendship` rows where the current user is on either side (`user_id` or `friend_user_id`). |
| `api/friends/friend-requests/` | `FriendRequestView` | `ListCreateAPIView` | **GET** / **POST** | GET returns all requests where current user is sender or receiver. POST validates and creates a new request. |
| `api/friends/friend-requests/received/` | `FriendRequestReceivedView` | `ListAPIView` | **GET** | Filters requests where `to_user == request.user` and `status == PENDING`. |
| `api/friends/friend-requests/sent/` | `FriendRequestSentView` | `ListAPIView` | **GET** | Filters requests where `from_user == request.user` and `status == PENDING`. |
| `api/friends/friend-requests/<id>/accept/` | `FriendRequestAcceptView` | `UpdateAPIView` | **PUT** / **PATCH** | **Guard:** `IsReceiverOfRequest`. Calls `friend_request.accept()` which updates status and creates a `Friendship` row atomically. |
| `api/friends/friend-requests/<id>/reject/` | `FriendRequestRejectView` | `UpdateAPIView` | **PUT** / **PATCH** | **Guard:** `IsReceiverOfRequest`. Sets `status = REJECTED`. Only works on `PENDING` requests. |
| `api/friends/friend-requests/<id>/cancel/` | `FriendRequestCancelView` | `DestroyAPIView` | **DELETE** | **Guard:** `IsSenderOfRequest`. Overrides `destroy()` — does **not** delete the row, sets `status = CANCELED`. Only works on `PENDING` requests. |
| `api/friends/<friend_id>/` | `FriendUnfriendView` | `DestroyAPIView` | **DELETE** | No extra guard. Finds the `Friendship` row by both user IDs (order-independent) and hard-deletes it. Returns `204`. |

---

## 📊 4. Analytics & Statistics Module

### 📋 Endpoints Overview

| Method | Endpoint | Auth Required? | Query Parameters | Success HTTP | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `api/analytics/admin-dashboard/` | ✅ Yes, admin role only | `start_date` (optional),<br>`end_date` (optional) | `200` | Return global dashboard metrics for users, chat, friendships, and message activity |

### 🔍 Backend Implementation Mapping (Analytics & Statistics)

> 🔒 **Admin Policy:** This module uses the custom permission `IsAdminRole`. The request is accepted only when `request.user.is_authenticated` and `request.user.role == 'admin'`.

| Endpoint | Django View Class | DRF Generic Class | Active HTTP Verbs | Custom Behavior / Notes |
| :--- | :--- | :--- | :--- | :--- |
| `api/analytics/admin-dashboard/` | `AdminDashboardView` | `APIView` | **GET** | Reads optional date filters, normalizes invalid dates to defaults, swaps dates if `start_date > end_date`, and aggregates site-wide statistics. |

### 💡 Important Architecture Notes for Frontend Integration

#### A. Date Range Filtering
* **Optional filters:** The endpoint accepts `start_date` and `end_date` in `YYYY-MM-DD` format.
* **Default range:** If no date is provided, the backend returns the last 7 days, from today minus 6 days through today.
* **Invalid date fallback:** If a date cannot be parsed, the backend silently falls back to the default start or end date.
* **Reversed dates:** If `start_date` is later than `end_date`, the backend swaps them before querying.

#### B. Admin-Only Access
* **JWT required:** The frontend must send `Authorization: Bearer <access_token>`.
* **Role required:** A normal authenticated user is not enough. The user must have `role: "admin"`.

#### C. Aggregation Scope
* **Global counters:** `total_users`, `online_users`, `offline_users`, `total_conversations`, `total_messages`, `total_friendships`, and `pending_friend_requests` are all site-wide.
* **Date-range counters:** `messages_in_range`, `new_users_in_range`, `top_active_users`, and `messages_by_day` are filtered by the selected range.
* **Daily series:** `messages_by_day` always returns every day in the range, filling missing days with `count: 0`.

### 🔍 JSON Structures Detail (Analytics & Statistics)

<details>
<summary><b>Detail: Admin Dashboard (GET api/analytics/admin-dashboard/)</b></summary>

**Request Without Query Parameters:**
```text
GET api/analytics/admin-dashboard/
```

**Request With Date Filters:**
```text
GET api/analytics/admin-dashboard/?start_date=2026-06-01&end_date=2026-06-30
```

**Success Response (200 OK):**
```json
{
  "date_range": {
    "start_date": "2026-06-01",
    "end_date": "2026-06-30"
  },
  "generated_at": "2026-06-30T18:45:22.123456+00:00",
  "total_users": 42,
  "online_users": 8,
  "offline_users": 34,
  "total_conversations": 16,
  "total_messages": 248,
  "messages_today": 31,
  "messages_in_range": 120,
  "new_users_in_range": 7,
  "total_friendships": 25,
  "pending_friend_requests": 4,
  "top_active_users": [
    {
      "id": 42,
      "username": "marvin",
      "email": "marvin@student.42.fr",
      "messages_count": 37
    }
  ],
  "messages_by_day": [
    {
      "date": "2026-06-01",
      "count": 5
    },
    {
      "date": "2026-06-02",
      "count": 0
    }
  ],
  "user_status": [
    {
      "label": "Online",
      "value": 8
    },
    {
      "label": "Offline",
      "value": 34
    }
  ]
}
```
</details>

---
