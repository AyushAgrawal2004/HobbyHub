# HobbyHub 🎨

HobbyHub is a premium social platform designed for hobbyists to connect, share communities, and interact in real-time. Built with the MERN stack (MongoDB, Express, React, Node.js) and powered by Socket.io for live features.

![HobbyHub Preview](./client/public/vite.svg) *Add a screenshot here*

## 🚀 Features

- **Real-time Global Chat**: Live messaging with audio notifications and typing indicators.
- **Admin Moderation**: Admins can block users in chat, automatically censoring their messages.
- **Dynamic Onboarding**: A smooth, glassmorphism-styled welcome tutorial for new users.
- **Profile Customization**: Users can upload profile pictures that sync instantly across the app.
- **Groups & Events**: Create, join, and manage hobby groups and schedule events.
- **Contests**: Register for hobby contests (Admin managed).
- **Responsive UI**: Built with modern CSS variables, glassmorphism effects, and Framer Motion animations.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Framer Motion, Lucide React, Axios
- **Backend**: Node.js, Express, MongoDB
- **Real-time**: Socket.io
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Multer (Local uploads)

## 📦 Installation

Prerequisites: Node.js and MongoDB installed locally or a generic Atlas URI.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/hobbyhub.git
    cd hobbyhub
    ```

2.  **Server Setup**
    ```bash
    cd server
    npm install
    # Create .env file based on .env.example
    npm run dev
    ```

3.  **Client Setup**
    ```bash
    cd ../client
    npm install
    # Create .env file based on .env.example
    npm run dev
    ```

4.  **Access the App**
    Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔑 Environment Variables

### Server (`server/.env`)
```env
PORT=5003
MONGODB_URI=mongodb://localhost:27017/hobbyhub
JWT_SECRET=your_jwt_secret_key_here
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5003
```

## 🛡️ Admin Features

- **Role-based Access**: Admin users have special privileges.
- **Chat Blocking**: admins can toggle block status for users directly from the chat interface.
- **User Management**: Admins can view/manage users.

## 🤝 Contributing

1.  Fork the repo
2.  Create your feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add some amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
