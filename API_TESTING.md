# 🧪 API Testing Guide & cURL Examples

## Quick Start: Test All Endpoints

### Setup
```bash
# Ensure your backend is running
cd backend
npm install
node index.js

# And frontend is accessible
cd frontend
npm start
# or for production
npm run build
```

---

## User Authentication Endpoints

### 1. Register New User

#### Using cURL
```bash
curl -X POST http://localhost:8080/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "username": "johndoe",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123",
    "gender": "male"
  }'
```

#### Using Axios (JavaScript)
```javascript
const response = await axios.post('http://localhost:8080/api/v1/user/register', {
    fullName: 'John Doe',
    username: 'johndoe',
    password: 'SecurePass123',
    confirmPassword: 'SecurePass123',
    gender: 'male'
});
console.log(response.data);
// Output: { message: "Account created successfully.", success: true }
```

#### Using Postman
```
Method: POST
URL: http://localhost:8080/api/v1/user/register
Headers: Content-Type: application/json
Body (JSON):
{
  "fullName": "John Doe",
  "username": "johndoe",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123",
  "gender": "male"
}
```

---

### 2. Login User

#### Using cURL
```bash
curl -X POST http://localhost:8080/api/v1/user/login \
  -H "Content-Type: application/json" \
  -b "cookies.txt" -c "cookies.txt" \
  -d '{
    "username": "johndoe",
    "password": "SecurePass123"
  }'
```

#### Using Axios
```javascript
const response = await axios.post(
    'http://localhost:8080/api/v1/user/login',
    {
        username: 'johndoe',
        password: 'SecurePass123'
    },
    { withCredentials: true }  // Important for cookies!
);
console.log(response.data);
// Output: { _id, username, fullName, profilePhoto }
```

#### Using Postman
```
Method: POST
URL: http://localhost:8080/api/v1/user/login
Headers: Content-Type: application/json
Body (JSON):
{
  "username": "johndoe",
  "password": "SecurePass123"
}

Note: Enable "Save Cookies" in Postman settings
      to automatically handle authentication cookies
```

**Response Example:**
```json
{
  "_id": "60d5e123a1b2c3d4e5f6g7h8",
  "username": "johndoe",
  "fullName": "John Doe",
  "profilePhoto": "https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Cookies Set:**
```
Set-Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; 
            Path=/; HttpOnly; SameSite=Strict; Max-Age=86400000
```

---

### 3. Logout User

#### Using cURL
```bash
curl -X GET http://localhost:8080/api/v1/user/logout \
  -H "Content-Type: application/json" \
  -b "cookies.txt"
```

#### Using Axios
```javascript
const response = await axios.get(
    'http://localhost:8080/api/v1/user/logout',
    { withCredentials: true }
);
console.log(response.data);
// Output: { message: "logged out successfully." }
```

**Response:**
```
Set-Cookie: token=; Path=/; Max-Age=0; HttpOnly
(Cookie deleted)
```

---

### 4. Get Other Users (Protected Route)

#### Using cURL
```bash
curl -X GET http://localhost:8080/api/v1/user/ \
  -H "Content-Type: application/json" \
  -b "cookies.txt"
```

#### Using Axios
```javascript
const response = await axios.get(
    'http://localhost:8080/api/v1/user/',
    { withCredentials: true }  // Sends token cookie
);
console.log(response.data);
```

**Response Example:**
```json
{
  "users": [
    {
      "_id": "user456",
      "username": "janedoe",
      "fullName": "Jane Doe",
      "profilePhoto": "https://api.dicebear.com/7.x/avataaars/svg?seed=janedoe",
      "gender": "female"
    },
    {
      "_id": "user789",
      "username": "bobsmith",
      "fullName": "Bob Smith",
      "profilePhoto": "https://api.dicebear.com/7.x/avataaars/svg?seed=bobsmith",
      "gender": "male"
    }
  ]
}
```

---

## Message Endpoints

### 5. Send Encrypted Message

**Note:** Messages must be encrypted before sending!

#### Encryption Example
```javascript
// First, encrypt the message
const plainMessage = "Hello, Jane!";
const encryptedMessage = await encryptMessage(plainMessage);
// Result: "enc:v1WuVu:r5JhghOUKlp2:V0h2JkLmPq"

// Then send it
const response = await axios.post(
    `http://localhost:8080/api/v1/message/send/user456`,
    { message: encryptedMessage },
    { withCredentials: true }
);
console.log(response.data);
```

#### Using cURL (with pre-encrypted message)
```bash
curl -X POST http://localhost:8080/api/v1/message/send/user456 \
  -H "Content-Type: application/json" \
  -b "cookies.txt" \
  -d '{
    "message": "enc:v1WuVu:r5JhghOUKlp2:V0h2JkLmPq"
  }'
```

**Response Example:**
```json
{
  "newMessage": {
    "_id": "msg123",
    "message": "Hello, Jane!",
    "senderId": "user123",
    "receiverId": "user456",
    "conversationId": "conv123",
    "createdAt": "2026-05-30T10:30:00.000Z"
  }
}
```

**Note:** The message is returned DECRYPTED in the response!

---

### 6. Get Messages (Fetch Chat History)

#### Using cURL
```bash
curl -X GET http://localhost:8080/api/v1/message/user456 \
  -H "Content-Type: application/json" \
  -b "cookies.txt"
```

#### Using Axios
```javascript
const response = await axios.get(
    'http://localhost:8080/api/v1/message/user456',
    { withCredentials: true }
);
console.log(response.data);
```

**Response Example:**
```json
{
  "messages": [
    {
      "_id": "msg123",
      "message": "Hey there!",
      "senderId": "user123",
      "senderName": "John Doe",
      "receiverId": "user456",
      "conversationId": "conv123",
      "createdAt": "2026-05-30T10:30:00.000Z"
    },
    {
      "_id": "msg124",
      "message": "Hi John! How are you?",
      "senderId": "user456",
      "senderName": "Jane Doe",
      "receiverId": "user123",
      "conversationId": "conv123",
      "createdAt": "2026-05-30T10:31:00.000Z"
    }
  ]
}
```

**Note:** All messages are returned DECRYPTED!

---

## Socket.IO Real-Time Events

### Connection Setup
```javascript
const socket = io('http://localhost:8080', {
    query: { userId: 'user123' },
    withCredentials: true
});

socket.on('connect', () => {
    console.log('✅ Connected to server');
    console.log('Socket ID:', socket.id);
});
```

### Listen for User Online
```javascript
socket.on('getOnlineUsers', (users) => {
    console.log('✅ Online users:', users);
    // users = ["user456", "user789"]
});
```

### Listen for New Message
```javascript
socket.on('newMessage', (message) => {
    console.log('✅ New message received:', message);
    // message = {
    //   _id: "msg123",
    //   message: "Hello!",
    //   senderId: "user456",
    //   senderName: "Jane Doe",
    //   createdAt: "2026-05-30T..."
    // }
});
```

### Listen for User Going Offline
```javascript
socket.on('userOffline', (data) => {
    console.log('❌ User offline:', data.userId);
    console.log('Last seen:', data.lastSeen);
});
```

---

## Complete Testing Workflow

### Step 1: Register Two Users

```bash
# Terminal 1: Register John
curl -X POST http://localhost:8080/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "username": "johndoe",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123",
    "gender": "male"
  }'

# Terminal 2: Register Jane
curl -X POST http://localhost:8080/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Doe",
    "username": "janedoe",
    "password": "SecurePass456",
    "confirmPassword": "SecurePass456",
    "gender": "female"
  }'
```

### Step 2: Login Both Users

```bash
# John logs in
curl -X POST http://localhost:8080/api/v1/user/login \
  -H "Content-Type: application/json" \
  -c "john_cookies.txt" \
  -d '{
    "username": "johndoe",
    "password": "SecurePass123"
  }'
# Save the response: _id = user123

# Jane logs in
curl -X POST http://localhost:8080/api/v1/user/login \
  -H "Content-Type: application/json" \
  -c "jane_cookies.txt" \
  -d '{
    "username": "janedoe",
    "password": "SecurePass456"
  }'
# Save the response: _id = user456
```

### Step 3: Fetch Other Users

```bash
# John sees Jane in user list
curl -X GET http://localhost:8080/api/v1/user/ \
  -b "john_cookies.txt"
# Response shows user456 (Jane)
```

### Step 4: Send Encrypted Message

```bash
# John sends encrypted message to Jane (user456)
curl -X POST http://localhost:8080/api/v1/message/send/user456 \
  -H "Content-Type: application/json" \
  -b "john_cookies.txt" \
  -d '{
    "message": "enc:v1WuVu:r5JhghOUKlp2:V0h2JkLmPq"
  }'
# Response shows decrypted message: "Hello Jane!"
```

### Step 5: Fetch Chat History

```bash
# John fetches all messages with Jane
curl -X GET http://localhost:8080/api/v1/message/user456 \
  -b "john_cookies.txt"
# Response shows all messages (decrypted) between them
```

### Step 6: Real-Time Messaging

```javascript
// Open browser console and run:
const socket = io('http://localhost:8080', {
    query: { userId: 'user123' },  // John's ID
    withCredentials: true
});

socket.on('connect', () => console.log('✅ Connected'));
socket.on('getOnlineUsers', (users) => console.log('Online:', users));
socket.on('newMessage', (msg) => console.log('Message:', msg));

// Wait for Jane to send a message
// You'll see: Message: { _id: "...", message: "Hi John!", ... }
```

---

## Error Handling Examples

### Invalid Credentials
```
Request:
POST /api/v1/user/login
{ "username": "johndoe", "password": "wrongpassword" }

Response: 400 Bad Request
{
  "message": "Invalid username or password"
}
```

### Missing Required Fields
```
Request:
POST /api/v1/user/register
{ "fullName": "John" }  // Missing other fields

Response: 400 Bad Request
{
  "message": "All fields are required"
}
```

### Unauthenticated Request (Protected Route)
```
Request:
GET /api/v1/user/
(No token cookie)

Response: 401 Unauthorized
{
  "message": "Unauthorized"
}
```

### User Not Found
```
Request:
GET /api/v1/message/invalidUserId
(Valid token, but invalid user)

Response: 404 Not Found
{
  "message": "User not found"
}
```

---

## Postman Collection (JSON)

Save this as `Connect-API.postman_collection.json` and import into Postman:

```json
{
  "info": {
    "name": "Connect Messaging App",
    "version": "1.0.0"
  },
  "item": [
    {
      "name": "Register User",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/v1/user/register",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"fullName\": \"John Doe\", \"username\": \"johndoe\", \"password\": \"SecurePass123\", \"confirmPassword\": \"SecurePass123\", \"gender\": \"male\"}"
        }
      }
    },
    {
      "name": "Login User",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/v1/user/login",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"username\": \"johndoe\", \"password\": \"SecurePass123\"}"
        }
      }
    },
    {
      "name": "Get Other Users",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/v1/user/"
      }
    },
    {
      "name": "Send Message",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/v1/message/send/{{receiverId}}",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"message\": \"enc:v1WuVu:r5JhghOUKlp2:V0h2JkLmPq\"}"
        }
      }
    },
    {
      "name": "Get Messages",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/v1/message/{{userId}}"
      }
    },
    {
      "name": "Logout User",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/v1/user/logout"
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8080"
    },
    {
      "key": "userId",
      "value": ""
    },
    {
      "key": "receiverId",
      "value": ""
    }
  ]
}
```

---

## Network Request Examples

### Real Network Logs (Chrome DevTools)

#### Login Request
```
Request Headers:
POST /api/v1/user/login HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Content-Length: 57

{"username":"johndoe","password":"SecurePass123"}

Response Headers:
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: token=eyJhbGc...; Path=/; HttpOnly; SameSite=Strict

Response Body:
{
  "_id": "60d5e123a1b2c3d4e5f6g7h8",
  "username": "johndoe",
  "fullName": "John Doe",
  "profilePhoto": "https://..."
}
```

#### Send Message Request
```
Request Headers:
POST /api/v1/message/send/user456 HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Cookie: token=eyJhbGc...

{"message":"enc:v1WuVu:r5JhghOUKlp2:V0h2JkLmPq"}

Response Headers:
HTTP/1.1 201 Created
Content-Type: application/json

Response Body:
{
  "newMessage": {
    "_id": "msg123",
    "message": "Hello, Jane!",
    "senderId": "user123",
    "receiverId": "user456",
    "createdAt": "2026-05-30T10:30:00.000Z"
  }
}
```

---

## Debugging Checklist

- [ ] Backend running on port 8080
- [ ] MongoDB connected successfully
- [ ] Frontend in different terminal/port (3000)
- [ ] Check Network tab in DevTools
- [ ] Verify cookies are being set
- [ ] Check Redux DevTools for state updates
- [ ] Monitor browser console for errors
- [ ] Verify encryption/decryption happening
- [ ] Check Socket.IO connection in DevTools

---

**Use these examples to test your API during development!** 🧪
