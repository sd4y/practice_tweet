# Backend Debugging & Testing Checklist

> This checklist focuses on validating backend API endpoints, logic, and database interactions.

## 1. Auth Module
- [ ] **Signup (`POST /auth/signup`)**
    - [ ] **Happy Path**: Sign up with valid params (Name, Username, Email, Password). -> Expect `201 Created` + JWT.
    - [ ] **Duplicate Email**: Sign up with an existing email. -> Expect `409 Conflict`.
    - [ ] **Duplicate Username**: Sign up with an existing username. -> Expect `409 Conflict`.
    - [ ] **Validation**: Sign up with missing fields. -> Expect `400 Bad Request`.

- [ ] **Login (`POST /auth/login`)**
    - [ ] **Success**: Login with correct email/password. -> Expect `201 Created` + JWT + User object.
    - [ ] **Wrong Password**: Login with correct email but wrong password. -> Expect `401 Unauthorized`.
    - [ ] **Non-existent User**: Login with unregistered email. -> Expect `401 Unauthorized`.

## 2. Users Module & Profile
- [ ] **Get Profile (`GET /users/:username`)**
    - [ ] **Own Profile**: Request with own valid username. -> Expect `200 OK` + User details + `isFollowing: false` (or null).
    - [ ] **Other Profile**: Request other user's username. -> Expect `200 OK` + User details + `isFollowing` status.
    - [ ] **Case Insensitivity**: Request MixedCase username (e.g., `UsEr1`). -> Expect `200 OK` (resolves to `user1`).
    - [ ] **Not Found**: Request non-existent username. -> Expect `404 Not Found`.
    - [ ] **Counts**: Verify `_count` (followers, following, tweets) matches DB state.

- [ ] **Update Profile (`PATCH /users/profile`)**
    - [ ] **Partial Update**: Update only `bio`. -> Expect `200 OK` and other fields remain unchanged.
    - [ ] **Full Update**: Update `name`, `bio`, `location`, `website`. -> Expect `200 OK` + updated fields.
    - [ ] **Idempotency**: Send same data twice. -> Expect success both times.

- [ ] **Social Graph (`POST /users/:id/follow` | `DELETE /users/:id/follow`)**
    - [ ] **Follow Success**: Follow a target user. -> Expect `201 Created` (or 200).
    - [ ] **Follow Count**: Verify target's *follower* count increased.
    - [ ] **Following Count**: Verify requester's *following* count increased.
    - [ ] **Self Follow**: Try to follow self. -> Expect `400 Bad Request` or `409 Conflict` (Backend logic dependent).
    - [ ] **Double Follow**: Follow already followed user. -> Expect safe handling (ignore or error).
    - [ ] **Unfollow**: Unfollow user. -> Expect `200 OK`.
    - [ ] **Unfollow Count**: Verify counts decremented.

## 3. Uploads Module (Profile Images)
- [ ] **Upload File (`POST /uploads`)**
    - [ ] **Image Upload**: Upload `.jpg` or `.png`. -> Expect `201 Created` + `url` field (e.g. `http://localhost:3001/uploads/xyz.jpg`).
    - [ ] **Access URL**: Open the returned URL in browser/Postman. -> Expect Image file (Status 200).
- [ ] **Integration (`PATCH /users/profile`)**
    - [ ] **Avatar Update**: Call profile update with `{ "avatar": "http://.../uploads/..." }`. -> Verify DB updates.
    - [ ] **Cover Update**: Call profile update with `{ "coverImage": "http://.../uploads/..." }`. -> Verify DB updates.

## 4. Tweets Module
- [ ] **Create Tweet (`POST /tweets`)**
    - [ ] **Text Tweet**: Create with `content`. -> Expect 201.
    - [ ] **Image Tweet**: Create with `content` + `image` URL. -> Expect 201.
    - [ ] **Reply**: Create with `parentId`. -> Expect 201. Verify `parentId` is stored.

- [ ] **Feed (`GET /tweets`)**
    - [ ] **Timeline**: Fetch without params. -> Expect list of tweets (newest first).
    - [ ] **By Author**: Fetch `?authorId=...`. -> Expect only that user's tweets.
    - [ ] **Exclude Replies**: Fetch `?authorId=...&excludeReplies=true`. -> Expect *only* root tweets (no replies).
    - [ ] **Data Structure**: Verify response includes `author` object and `_count` (likes, retweets, replies).

- [ ] **Tweet Detail (`GET /tweets/:id`)**
    - [ ] **Single Tweet**: Fetch by ID. -> Expect Tweet + Author + Counts.
    - [ ] **NotFound**: Fetch invalid ID. -> Expect 404.

- [ ] **Interactions**
    - [ ] **Like**: `POST /tweets/:id/like`. -> Expect success. Verify `likes` count +1.
    - [ ] **Unlike**: `DELETE /tweets/:id/like` (or toggle logic). -> Verify `likes` count -1.
    - [ ] **Delete**: `DELETE /tweets/:id`. -> Expect success only if owner.
    - [ ] **Unauthorized Delete**: Try deleting other's tweet. -> Expect 403 Forbidden.

## 5. Conversations (DM) Module
- [ ] **Create/Get Conversation (`POST /conversations`)**
    - [ ] **New Chat**: Target valid `otherUserId`. -> Expect 201 + `id` (Conversation ID).
    - [ ] **Existing Chat**: Target same user again. -> Expect 200/201 + *Same* Conversation ID.
    - [ ] **Self Chat**: Target own ID. -> Expect 400 Bad Request (if logic exists) or valid solitary chat.

- [ ] **List Conversations (`GET /conversations`)**
    - [ ] **Format**: Verify list contains `lastMessage` string and `participants` (other user's info).
    - [ ] **Ordering**: Verify most recently updated conversation is first.

- [ ] **Messages (`GET /conversations/:id/messages`)**
    - [ ] **History**: Fetch messages. -> Expect array ordered by time (usually desc or asc).
    - [ ] **Authorization**: Try fetching messages for a conversation user is NOT part of. -> Expect 403 Forbidden.

- [ ] **Send Message (`POST /conversations/:id/messages`)**
    - [ ] **Send**: Post valid content. -> Expect 201.
    - [ ] **Persistence**: Verify message appears in GET list.
    - [ ] **Conversation Update**: Verify Conversation `updatedAt` changed (for sorting).

## 6. Notifications Module
- [ ] **List Notifications (`GET /notifications`)**
    - [ ] **Structure**: Verify fields: `type` (LIKE, REPLY, etc), `users` (who triggered it), `tweet` (related content).
    - [ ] **Unread**: Verify `isRead: false` initially.

- [ ] **Mark Read (`PATCH /notifications/:id/read`)**
    - [ ] **Action**: Call endpoint. -> Expect success.
    - [ ] **Verify**: Fetch list again, `isRead` should be true.

- [ ] **Triggers (Integration Test)**
    - [ ] **Like Trigger**: User A likes User B's tweet. -> User B GET /notifications -> See LIKE notification.
    - [ ] **Reply Trigger**: User A replies to User B's tweet. -> User B GET /notifications -> See REPLY notification.
    - [ ] **Follow Trigger**: User A follows User B. -> User B GET /notifications -> See FOLLOW notification.
