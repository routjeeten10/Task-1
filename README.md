# Real-Time Collaborative Text Editor

This is a real-time collaborative text editor built using Node.js, Express, and Socket.IO. Multiple users can connect simultaneously and edit a shared document in real-time.

## Project Structure

```
Task-1/
├── node_modules/
├── public/
├── package.json
├── package-lock.json
└── server.js
```

## Features

- Real-time text synchronization across multiple users
- Live user presence tracking
- Persistent document state
- Clean and simple interface

## Technologies Used

- Node.js
- Express.js
- Socket.IO
- HTML/CSS/JavaScript

## Setup and Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   node server.js
   ```

3. Access the application at `http://localhost:3000`

## Implementation Details

### Backend (server.js)
- Set up Express server with Socket.IO integration
- Implemented real-time event handling for:
  - User connections/disconnections
  - Text changes synchronization
  - User list management
- Maintained document state in memory

### Frontend (public/)
- Created responsive UI for text editing
- Implemented Socket.IO client for real-time updates
- Added user presence indicators

## Challenges Resolved

1. **Concurrent Editing Conflicts**
   - Implemented a broadcasting system to ensure all users receive updates in real-time
   - Used Socket.IO's reliable event system to prevent data loss

2. **User Management**
   - Created a robust system to track connected users using Set data structure
   - Handled user disconnections gracefully

3. **Document Synchronization**
   - Ensured new users receive the current document state upon connection
   - Implemented efficient update broadcasting to maintain consistency

4. **Server-Client Communication**
   - Established reliable WebSocket connection using Socket.IO
   - Handled various edge cases in connection management

## Running the Application

The application runs on port 3000 by default. You can modify the port by setting the PORT environment variable.
