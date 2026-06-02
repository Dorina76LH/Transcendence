# 🛠️ Contribution Guidelines

This document outlines the workflow and rules for contributing to the **ft_transcendence** project. Please follow these rules to maintain a clean and trackable history.

---

## 🌿 Git Strategy

We use a feature-branching workflow with two main persistent branches.

### 1. Main Branches
*   **`main`**: Production-ready branch. Only stable versions.
*   **`dev`**: Integration branch. All features are merged here first.

### 2. Feature Branches
Every new task must be developed in its own branch.
*   **Naming Convention:** `type/TrelloID-description`
*   **Examples:**
    *   `feature/T12-chat-send-message`
    *   `fix/T14-i18n-bug`
    *   `refactor/T05-auth-logic`

---

## 📋 Trello & Workflow

> **Rule: 1 Trello Card = 1 Branch = 1 Pull Request**

1.  Pick a card on **Trello**.
2.  Create a branch from the latest `dev`.
3.  Implement your changes.
4.  Open a **Pull Request (PR)** to `dev`.

---

## 💬 Commit Messages

We follow a structured commit format to keep the history readable:
`type(TrelloID): short description`

*   `feat(T12): implement websocket message handler`
*   `fix(T13): resolve avatar upload timeout`
*   `docs(T02): update theory readme`

---

## 🔀 Pull Requests (PR)

Before merging a PR to `dev` or `main`:
*   **Approval:** At least **2 approvals** from team members are required.
*   **Reset:** Approvals are reset if new commits are pushed to the branch.
*   **Force Push:** Strictly forbidden on `main` and `dev`.

---

## 🛠️ Tools
*   **Trello:** [Link to your Trello board]
*   **Discord:** Primary communication for daily syncs.