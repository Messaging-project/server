# Chat Application with Socket.io and MongoDB

This is a simple chat application built with Node.js, Express, MongoDB, and Socket.io. The application allows a user to join chat rooms, send and receive messages in real-time from the admin.

## Prerequisites

Make sure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)

## Getting Started

1. Clone the repository:

   ```bash
   git clone git@github.com:Messaging-project/server.git

   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables:
   Create a `.env` file in the root directory and add the following:

   ```bash
   MONGODB_KEY=<your-mongodb-connection-string>
   ```

   Replace <your-mongodb-connection-string> with the connection string to your MongoDB database.

4. Run the application:
   ```bash
   npm start
   ```
   The server will start on port 3001, and you can access the application at http://localhost:3001.

5. To Login as admin, use `admin@gmail.com` as the email

## Usage

### User Interaction

- Users can join chat rooms using their email addresses.

- Send messages to other users in the same room.

- All messages are stored in the MongoDB database.

### Admin Interaction

- Admins can log in using their email addresses.

- Once logged in, admins can view and interact with all users and their messages.

- Admins can send messages to specific users and reply to individual messages.

### Socket.io Configuration

Socket.io is configured to work with CORS and to connect to the client application running on http://localhost:5173. Ensure that your client application matches this URL.

## MongoDB Configuration

Make sure your MongoDB database connection string is correctly set in the .`env` file.
