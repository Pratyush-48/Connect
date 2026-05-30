# 📂 Complete Project Structure & File Guide

## Backend Project Structure

```
backend/
├── index.js (Main server entry point)
├── config/
│   └── database.js (MongoDB connection setup)
├── controllers/
│   ├── messageController.js (Send, fetch, manage messages)
│   └── userController.js (Auth, register, login, logout)
├── middleware/
│   └── isAuthenticated.js (JWT verification)
├── models/
│   ├── conversationModel.js (Message conversations)
│   ├── messageModel.js (Individual messages)
│   └── userModel.js (User data)
├── routes/
│   ├── messageRoute.js (Message endpoints)
│   └── userRoute.js (User endpoints)
├── socket/
│   └── socket.js (Socket.IO setup and events)
├── utils/
│   ├── avatar.js (Avatar URL generation)
│   └── messageCrypto.js (Encryption/Decryption)
├── package.json
└── .env (Environment variables)
```

## Frontend Project Structure

```
frontend/
├── public/
│   ├── index.html (HTML entry point)
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── chat.jsx (Main chat layout)
│   │   ├── HomePage.jsx (Home page with Sidebar + Chat)
│   │   ├── HomePage.css (Styling)
│   │   ├── Login.jsx (Login form)
│   │   ├── Message.jsx (Single message display with decryption)
│   │   ├── MessageContainer.jsx (Chat header + messages + input)
│   │   ├── Messages.jsx (Messages list)
│   │   ├── OtherUser.jsx (User card with online status)
│   │   ├── OtherUsers.jsx (List of all users)
│   │   ├── responsive.css (Mobile responsive styles)
│   │   ├── SendInput.jsx (Message input with encryption)
│   │   ├── Sidebar.jsx (Left sidebar with users list)
│   │   ├── Signup.jsx (Registration form)
│   │   └── ThemeToggle.jsx (Dark/Light mode toggle)
│   ├── context/
│   │   └── ThemeContext.jsx (Theme management)
│   ├── hooks/
│   │   ├── useGetMessages.jsx (Fetch chat history)
│   │   ├── useGetOtherUsers.jsx (Fetch user list)
│   │   └── useGetRealTimeMessage.jsx (Socket.IO listener)
│   ├── redux/
│   │   ├── messageSlice.js (Messages state)
│   │   ├── socketSlice.js (Socket state)
│   │   ├── store.js (Redux configuration + persistence)
│   │   └── userSlice.js (User/auth state)
│   ├── utils/
│   │   ├── avatar.js (Avatar utilities)
│   │   └── messageCrypto.js (Encryption/Decryption)
│   ├── App.js (Main app component with routing)
│   ├── App.css (Global styles)
│   ├── index.js (Entry point with BASE_URL)
│   ├── index.css (Global styles)
│   └── tailwind.config.js
├── package.json
├── .env.local (Development environment)
├── .env.production (Production environment)
└── tailwind.config.js (Tailwind CSS config)
```

---

## Key Files Explained

### Backend Files

#### **backend/index.js** (115 lines)
```javascript
// Main Entry Point
- Import all routes and middleware
- Connect to MongoDB via database.js
- Setup Express app with middleware:
  - CORS (Cross-Origin Resource Sharing)
  - JSON parsing
  - Cookie parsing
- Register routes:
  - /api/v1/user/* → userRoute
  - /api/v1/message/* → messageRoute
- Serve frontend static files:
  - app.use(express.static(frontend/build))
  - Fallback to index.html for React routing
- Listen on PORT (default 8080, Render: 10000)
```

#### **backend/config/database.js** (20 lines)
```javascript
// Database Connection
- Connect to MongoDB Atlas or local MongoDB
- Use Mongoose ODM
- Set connection options:
  - useNewUrlParser: true
  - useUnifiedTopology: true
- Handle connection errors
```

#### **backend/controllers/userController.js** (120 lines)
```javascript
// 4 Main Functions:

1. register(req, res)
   - Validate input fields
   - Check if username taken
   - Hash password with bcryptjs
   - Generate avatar URL
   - Create user in database
   
2. login(req, res)
   - Find user by username
   - Verify password with bcryptjs
   - Generate JWT token
   - Set httpOnly cookie
   - Return user data + token
   
3. logout(req, res)
   - Clear token cookie
   - Return success message
   
4. getOtherUsers(req, res)
   - Get all users except current (req.id)
   - Exclude password field
   - Return array of users
```

#### **backend/controllers/messageController.js** (150+ lines)
```javascript
// 2 Main Functions:

1. sendMessage(req, res)
   - Receive encrypted message from frontend
   - Create/fetch conversation
   - Save encrypted message to DB
   - Decrypt message for broadcasting
   - Send via Socket.IO to receiver
   - Return decrypted response to sender
   - (See detailed flow in README)
   
2. getMessage(req, res)
   - Fetch conversation between two users
   - Get all messages
   - Decrypt each message
   - Return decrypted messages array
```

#### **backend/models/userModel.js** (25 lines)
```javascript
// MongoDB Schema
{
  _id: ObjectId (auto),
  fullName: String (required),
  username: String (required, unique),
  password: String (required, hashed),
  profilePhoto: String (avatar URL),
  gender: String (enum: male/female),
  timestamps: { createdAt, updatedAt }
}
```

#### **backend/models/messageModel.js** (25 lines)
```javascript
// MongoDB Schema
{
  _id: ObjectId (auto),
  message: String (ENCRYPTED FORMAT: enc:...:),
  senderId: ObjectId (ref to User),
  receiverId: ObjectId (ref to User),
  conversationId: ObjectId (ref to Conversation),
  timestamps: { createdAt, updatedAt }
}
```

#### **backend/models/conversationModel.js** (25 lines)
```javascript
// MongoDB Schema
{
  _id: ObjectId (auto),
  participants: [ObjectId, ObjectId] (user IDs),
  messages: [ObjectId] (message IDs),
  timestamps: { createdAt, updatedAt }
}
```

#### **backend/middleware/isAuthenticated.js** (25 lines)
```javascript
// JWT Verification Middleware
- Extract token from cookies
- Verify token with JWT_SECRET_KEY
- If valid: attach userId to req.id
- If invalid: return 401 Unauthorized
- Used by: protected routes
```

#### **backend/socket/socket.js** (50 lines)
```javascript
// Socket.IO Setup
const userSocketMap = {} // userId -> socketId mapping

socket.on("connect")
  - Store userId -> socketId
  - Update user isOnline = true in DB
  - Emit "getOnlineUsers" to all

socket.on("newMessage")
  - Broadcast decrypted message to receiver

socket.on("disconnect")
  - Remove from userSocketMap
  - Update isOnline = false in DB
  - Emit "getOfflineUsers" to all

Helper: getReceiverSocketId(userId)
  - Returns socketId from userSocketMap
```

#### **backend/utils/messageCrypto.js** (100+ lines)
```javascript
// AES-256-GCM Encryption/Decryption

decryptMessage(encryptedPayload)
  - Parse: "enc:iv:ct:tag".split(":")
  - Decode base64 to bytes
  - Get encryption key
  - Create decipher with IV
  - Set auth tag
  - Decrypt and return plaintext
  
encryptMessage(plaintext)
  - Get encryption key
  - Generate random IV (12 bytes)
  - Create cipher with key and IV
  - Encrypt plaintext
  - Get auth tag
  - Encode all to base64
  - Return format: "enc:iv:ct:tag"
```

#### **backend/utils/avatar.js** (50+ lines)
```javascript
// Avatar URL Management
- Generate avatar URL from username
- Use DiceBear or similar API
- Consistent avatars for same user
- Update if URL format changes
```

### Frontend Files

#### **frontend/src/index.js** (25 lines)
```javascript
// Entry Point
- Import React and dependencies
- Define BASE_URL from env
  - Production: https://connect-h2wl.onrender.com
  - Development: http://localhost:8080
- Setup Redux store with persistence
- Configure PersistGate
- Render App
```

#### **frontend/src/App.js** (70+ lines)
```javascript
// Main App Component
- React Router setup
- Routes:
  - / → HomePage (requires auth)
  - /login → Login
  - /signup → Signup
  - /chat → HomePage
- Socket.IO connection on mount
- useEffect to listen for online/offline events
```

#### **frontend/src/components/Login.jsx** (80 lines)
```javascript
// Login Form
- Input fields: username, password
- onSubmit:
  - axios POST to /api/v1/user/login
  - Dispatch setAuthUser to Redux
  - Navigate to /chat
- Error handling with toast notifications
```

#### **frontend/src/components/Message.jsx** (60 lines)
```javascript
// Smart Decryption Logic
- Receive message from Redux
- useEffect:
  - Check if message.startsWith("enc:")
  - If yes: decrypt await decryptMessage()
  - If no: use as-is
  - Set displayMessage state
- Render displayMessage (always decrypted)
- Why: Ensures UI always shows readable text
```

#### **frontend/src/components/SendInput.jsx** (100+ lines)
```javascript
// Message Composer
- Input field for typing
- onClick Send button:
  - 1. Encrypt: await encryptMessage(text)
  - 2. POST to /api/v1/message/send/{selectedUserId}
  - 3. Body: { message: "enc:..." }
  - 4. Handle response
  - 5. Add to Redux messages
  - 6. Clear input
- Real-time encryption before sending
```

#### **frontend/src/hooks/useGetMessages.jsx** (60 lines)
```javascript
// Fetch Chat History
- useEffect on selectedUser change
- axios GET /api/v1/message/{selectedUserId}
- Automatically decrypts all messages
- dispatch setMessages to Redux
- Shows loading state
```

#### **frontend/src/hooks/useGetOtherUsers.jsx** (50 lines)
```javascript
// Fetch User List
- useEffect on component mount
- axios GET /api/v1/user/
- Requires authentication
- dispatch setOtherUsers to Redux
```

#### **frontend/src/hooks/useGetRealTimeMessage.jsx** (50 lines)
```javascript
// Real-Time Socket Listener
- useEffect setup socket listeners
- socket.on("newMessage", (message) => {
    dispatch(setMessages([...messages, message]))
  })
- socket.on("userOnline", updateOnlineStatus)
- socket.on("userOffline", updateOfflineStatus)
- Cleanup on unmount
```

#### **frontend/src/redux/store.js** (30 lines)
```javascript
// Redux Configuration
- combineReducers: user, message, socket
- persistConfig:
  - key: 'root'
  - storage: localStorage
  - blacklist: ['socket'] (exclude socket)
- persistedReducer
- Export store + persistor
```

#### **frontend/src/redux/userSlice.js** (40 lines)
```javascript
// User State Management
Reducers:
- setAuthUser(state, action)
  - Store logged-in user data
- setOtherUsers(state, action)
  - Store list of all other users
- setSelectedUser(state, action)
  - Store currently selected chat user
```

#### **frontend/src/redux/messageSlice.js** (50 lines)
```javascript
// Message State Management
Reducers:
- setMessages(state, action)
  - Replace all messages (after fetch)
- addMessage(state, action)
  - Add single message (real-time)
- setSelectedUser(state, action)
  - Track which user's chat is open
```

#### **frontend/src/redux/socketSlice.js** (20 lines)
```javascript
// Socket State Management
Reducers:
- setSocket(state, action)
  - Store Socket.IO instance
- setOnlineUsers(state, action)
  - Store array of online user IDs

Note: socket NOT persisted (blacklisted)
Reason: Circular references in Socket object
```

#### **frontend/src/context/ThemeContext.jsx** (40 lines)
```javascript
// Theme Management
- createContext for dark/light theme
- useContext hook to access theme
- Toggle function
- Persist to localStorage
```

---

## Environment Variables

### **.env** (Backend - Development)
```
PORT=8080
MONGO_URI=mongodb+srv://...
JWT_SECRET_KEY=connect
MESSAGE_ENCRYPTION_KEY=ad70361a3d89be124ca8a04f39511a94770e8d76dafd08e0bab7e349a9a21a0b
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development
USE_ATLAS=true
```

### **.env.local** (Frontend - Development)
```
REACT_APP_BASE_URL=http://localhost:8080
REACT_APP_MESSAGE_ENCRYPTION_KEY=ad70361a3d89be124ca8a04f39511a94770e8d76dafd08e0bab7e349a9a21a0b
```

### **.env.production** (Frontend - Production)
```
REACT_APP_BASE_URL=https://connect-h2wl.onrender.com
REACT_APP_MESSAGE_ENCRYPTION_KEY=ad70361a3d89be124ca8a04f39511a94770e8d76dafd08e0bab7e349a9a21a0b
```

### **Render Environment Variables** (Production Backend)
```
PORT=10000
MONGO_URI=mongodb+srv://...
JWT_SECRET_KEY=connect
MESSAGE_ENCRYPTION_KEY=ad70361a3d89be124ca8a04f39511a94770e8d76dafd08e0bab7e349a9a21a0b
CLIENT_ORIGIN=https://connect-h2wl.onrender.com
NODE_ENV=production
USE_ATLAS=true
```

---

## Data Flow Summary

### **Message Lifecycle**

```
User Types "Hello"
     ↓
SendInput.jsx
├─ Encrypt: "enc:iv:ct:tag"
└─ POST /api/v1/message/send/{receiverId}
     ↓
messageController.sendMessage()
├─ Create conversation if needed
├─ Save encrypted to DB
├─ Decrypt for broadcast
├─ io.to(receiver).emit("newMessage", {message: "Hello"})
└─ Return response: {message: "Hello"}
     ↓
Frontend receives response
├─ Redux: setMessages([...messages, {message: "Hello"}])
└─ Message.jsx renders: "Hello" ✅
     ↓
Receiver Socket event
├─ useGetRealTimeMessage hook
├─ Redux: setMessages([...messages, {message: "Hello"}])
└─ Message.jsx renders: "Hello" ✅

Database: "enc:..." (encrypted at rest)
API Response: "Hello" (decrypted for HTTP)
WebSocket: "Hello" (decrypted real-time)
UI: "Hello" (always decrypted)
```

---

## Key Implementation Decisions

### **Why Separate .env files?**
- `.env`: Shared development variables (git ignored)
- `.env.local`: Frontend development (git ignored)
- `.env.production`: Frontend production (can be committed, not secrets)

### **Why Blacklist Socket from Persistence?**
- Socket object has circular references
- Can't serialize to JSON
- Would cause "Cyclic object value" error
- Socket recreated on each page load anyway

### **Why Decrypt in Backend for HTTP?**
- API response needs decrypted data
- Frontend can render immediately
- No extra decryption needed
- Database keeps encrypted for security

### **Why Socket.IO Sends Decrypted?**
- Real-time events need low latency
- Decrypting in real-time is acceptable
- Receiver needs readable message instantly
- Broadcasting decrypted to specific socket

### **Why Message.jsx Checks Encryption?**
- Redux might store encrypted or decrypted
- Component ensures always displays correct
- Defensive programming for consistency
- Handles edge cases

---

## Performance Characteristics

| Operation | Time | Notes |
|-----------|------|-------|
| User Login | 50-100ms | bcryptjs hash comparison |
| Message Encrypt (Frontend) | 1-5ms | Web Crypto API (native) |
| Message Decrypt (Backend) | 1-5ms | Node crypto module (native) |
| Database Query (with index) | 10-50ms | MongoDB index lookup |
| Socket.IO Message Delivery | 50-200ms | Network latency + processing |
| Redux State Update | <1ms | In-memory operation |
| React Component Render | 5-20ms | Virtual DOM diffing |

---

## Testing Checklist

- [ ] User can register with unique username
- [ ] User can login with correct credentials
- [ ] Login fails with wrong password
- [ ] Logout clears token cookie
- [ ] Can see list of other users
- [ ] Online status updates in real-time
- [ ] Can select user and see chat history
- [ ] Message encrypts before sending
- [ ] Message decrypts correctly
- [ ] Sender sees message immediately
- [ ] Receiver sees message via Socket.IO
- [ ] Database stores encrypted
- [ ] Refresh page persists state (except socket)
- [ ] Responsive on mobile
- [ ] Dark/Light theme works

---

**This guide covers every file and its purpose. Use for interviews!** 🎉
