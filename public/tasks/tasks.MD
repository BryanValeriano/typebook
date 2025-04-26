# 📆 TypingBook Project Task Board 

## 🚀 Milestone 1: Core Typing Experience (Local State Only)

### 🮩 Epic 1.1: Component Architecture Refactor

- [ ] Refactor `TypingArea` to encapsulate typing logic
  > Create a smart component `<TypingArea>` that manages typing state internally.

- [ ] Convert `TypingText`, `ProgressBar`, `HiddenTextarea` to presentational components
  > Make these components purely visual with no logic.

- [ ] Write unit tests for `TypingArea` behavior
  > Verify typing flow, mistake tracking, and cursor flashing.

### 🮩 Epic 1.2: Typing Session Hook

- [ ] Create `useTypingSession` hook to manage typing session state
  > Encapsulate state updates, reset, and progress tracking.

- [ ] Support `initialProgress` injection in `useTypingSession`
  > Allow resuming a previous typing session.

- [ ] Write unit tests for `useTypingSession`
  > Test state transitions, reset, and hydration from initial state.

---

## 📚 Milestone 2: Book Loading & Selection

### 🮩 Epic 2.1: Library Integration

- [ ] Build or refactor `LibraryView` to list available books
  > UI component that lists books and triggers selection.

- [ ] Load book chunks on selection via repository
  > Fetch the full text and prepare for TypingArea.

- [ ] Add loading spinner during book fetch
  > UX feedback when fetching data.

- [ ] Write integration test for book selection and typing start
  > Simulate user selecting a book and loading TypingArea.

### 🮩 Epic 2.2: Book Text Abstraction

- [ ] Define `BookTextRepository` interface
  > Standardize the way book text is loaded.

- [ ] Implement local file backend for book text
  > Simple JSON or public file access for development.

- [ ] Write unit test for BookTextRepository
  > Ensure correct loading, including error cases.

---

## 🧠 Milestone 3: Progress Tracking (Local Persistence)

### 🮩 Epic 3.1: Progress Repository

- [ ] Define `ProgressRepository` interface
  > Define save/load/reset methods for typing progress.

- [ ] Implement `LocalStorageProgressRepository`
  > Persist session progress to browser localStorage.

- [ ] Inject repository into `useTypingSession`
  > Save progress automatically during typing.

- [ ] Write unit tests for ProgressRepository logic
  > Verify saving and loading from localStorage.

### 🮩 Epic 3.2: Resume Sessions

- [ ] Implement session resumption on app reload
  > Restore progress if available from localStorage.

- [ ] UX: Offer “Continue where you left off” message
  > Friendly prompt for the user to resume.

- [ ] Write integration test for session resumption
  > Test full save → reload → resume flow.

---

## 🔐 Milestone 4: Authentication + User Progress

### 🮩 Epic 4.1: Auth System

- [ ] Integrate authentication system (NextAuth.js or Firebase)
  > Secure login, logout, and session management.

- [ ] Protect progress save/load for authenticated users
  > Ensure only logged-in users have remote save.

- [ ] Write auth flow tests
  > Login → type → save → logout → resume test.

### 🮩 Epic 4.2: Server-Side Book Progress (DB)

- [ ] Create `BookProgress` Prisma model
  > Schema for tracking typing progress per user/book.

- [ ] Implement `BookProgressRepository` (Prisma-based)
  > Backend repository for saving progress.

- [ ] Migrate from localStorage to database for logged-in users
  > Auto-migration flow on login if needed.

- [ ] Write backend repository tests
  > Verify correct DB operations.

---

## 🐳 Milestone 5: Database + Dockerization

### 🮩 Epic 5.1: Database Setup

- [ ] Implement and test Prisma schema migrations
  > Apply models: `User`, `Book`, `BookText`, `BookProgress`, etc.

- [ ] Add seed scripts (optional)
  > Insert sample books, authors, etc.

- [ ] Write database access unit tests
  > Test basic create/read/update operations.

### 🮩 Epic 5.2: Dockerize App for Development

- [ ] Create Dockerfile for backend (Next.js server and Prisma client)
  > Containerize app with production-grade settings.

- [ ] Create docker-compose.yml for local dev
  > Include services like PostgreSQL, MinIO (optional for S3).

- [ ] Write dev setup instructions (`README.md`)
  > Guide for launching full stack locally in one command.

---

## ☁️ Milestone 6: Book Text in S3

### 🮩 Epic 6.1: S3 Storage for Book Text

- [ ] Create `BookText` entity + Prisma model
  > BookText table with S3 storage key references.

- [ ] Implement `BookTextRepository` S3 backend
  > Load/save text from S3.

- [ ] Write unit tests for S3 loading logic
  > Mock S3 interactions and verify fetch behavior.

### 🮩 Epic 6.2: Signed URL Access

- [ ] Implement `getSignedUrl` in BookTextRepository
  > Secure expiring URL for fetching private book text.

- [ ] Create `/api/bookTextUrl` endpoint
  > Serverless route to fetch signed URL by bookId.

- [ ] Frontend: fetch book text via signed URL
  > TypingArea loads text using signed URL at runtime.

- [ ] Write integration test for signed URL flow
  > End-to-end: fetch signed URL → load book → type.

---

## 🧪 Milestone 7: Testing and Validation

### 🮩 Epic 7.1: Unit Tests

- [ ] `useTypingSession` state logic
- [ ] `BookTextRepository` S3 + Local
- [ ] `ProgressRepository` LocalStorage + Database

### 🮩 Epic 7.2: Integration Tests

- [ ] Full typing flow: Select book → type → save → resume
- [ ] Authentication and persistence integration
- [ ] Fetch book text via signed URL test

---

# 📃 Final Milestones Overview

| Milestone | Purpose |
|:---|:---|
| 1 | Core Typing Architecture |
| 2 | Book Management and Library |
| 3 | Local Progress Tracking |
| 4 | Authentication and DB Persistence |
| 5 | Database Setup + Dockerization |
| 6 | Book Text Storage with S3 |
| 7 | Testing and Validation |


