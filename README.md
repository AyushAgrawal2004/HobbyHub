# ⚡ HobbyHub v2.0

> **The "Anti-Algorithm" Social Platform.** A premium, Neo-Brutalist community space designed for connection, not consumption.

https://github.com/user-attachments/assets/9a34461c-299c-47be-b6b6-ddf411cc0cd3

*Click the badge above to watch the walkthrough video.*

---

## 🎨 The Philosophy: Neo-Brutalism
HobbyHub v2.0 ditches the generic "corporate clean" look for a raw, expressive design system that feels alive.

*   **⚠️ High Voltage Aesthetics**: High contrast, thick borders, Hard shadows, and vibrant accent colors.
*   **🔊 Tactile Audio Feedback**: Every interaction has weight. Magnetic buttons click, keyboards clack, and notifications chime.
*   **📖 Comic Book Storytelling**: The "About" page isn't just text—it's an interactive comic narrative pitting "The Squad" (User Community) against "The Algorithm" (Villain).

---

## 🚀 Unique Features

### 1. **Immersive "Vibe" UI**
This isn't just a dashboard; it's a cockpit.
*   **Glassmorphism & Parallax**: Depth-based layers that react to mouse movement.
*   **GSAP Scroll Animations**: Elements crash, slide, and reveal with physics-based motion.
*   **Bento Grid Layout**: A responsive, asymmetrical dashboard that breaks the monotony of lists.

### 2. **Real-Time Connection (Socket.io)**
*   **Global Chat Room**: Jump into the "The Loop" — a live, anonymous-friendly chat with typing indicators and audio alerts.
*   **Live Polling**: Vote in real-time and watch results update instantly across all clients.

### 3. **Gamified Community**
*   **Contest System**: Admins launch hobby challenges. Users form teams, register, and compete.
*   **Role-Based Access**: Specialized dashboards for Admins (The Overseers) and Users (The Rebels).
*   **Profile Identity**: Customize your "Identity Card" with cloud-hosted avatars and bios.

---

## 🛠️ Tech Stack: The Engine Room

Built with the **MERN Stack** (MongoDB, Express, React, Node.js) + **Real-time Wings**.

*   **Frontend**: React (Vite), Framer Motion, GSAP (ScrollTrigger), Lucide React.
*   **Backend**: Node.js, Express, Socket.io.
*   **Database**: MongoDB Atlas (Cloud).
*   **Storage**: Cloudinary (Image & Audio optimization).
*   **Deployment**: Render.

---

## 📦 Installation & Setup

1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/YourUsername/HobbyHub.git
    cd HobbyHub
    ```

2.  **Install Dependencies**:
    ```bash
    # Server
    cd server
    npm install
    
    # Client
    cd ../client
    npm install
    ```

3.  **Environment Variables**:
    Create `.env` files in both `server/` and `client/` (see `.env.example`).

4.  **Launch**:
    ```bash
    # Terminal 1 (Server)
    cd server
    npm start

    # Terminal 2 (Client)
    cd client
    npm run dev
    ```

---

## 🤝 Contributing
Join the resistance. Fork the repo, break some code, and submit a PR. 

**License**: MIT
