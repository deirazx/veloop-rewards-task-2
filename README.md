# 🎁 VELOOP Rewards & Provably Fair Giveaway Platform

[![Vite](https://img.shields.io/badge/Vite-8.2.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://veloop-rewards-dheeraj.netlify.app)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

> **VELOOP Rewards** is an ultra-modern, gamified Fintech & Web3 rewards platform engineered for high-engagement community giveaways. Built with a cryptographic **Provably Fair Protocol (SHA-256)**, a live **Leaderboard with Masked Identity Protection**, real-time **Multi-Currency Wallets**, an interactive **Notification Center**, and dynamic countdown engines.

---

## 🌐 Live Platform Links

- **Frontend Deployment (Netlify):** [https://veloop-rewards-dheeraj.netlify.app](https://veloop-rewards-dheeraj.netlify.app)
- **Backend API (Render):** `https://veloop-giveaway-backend.onrender.com`

---

## ⚡ Key Highlights & Core Features

### 1. 🎁 Multi-Pool Giveaway Engine
- **Tiered Prize Pools:** Luxury Electronics (*Apple iPhone 15 Pro, Apple Watch Series 9, AirPods Pro*), Shopping Vouchers (*Amazon ₹2,000 & ₹500*), and Micro-Recharge Rewards (*₹20 Instant Recharge*).
- **Multi-Currency System:** Supports entry fees in **VEs** (Platform Points), **SVEs** (Staked Points), and **Community Tokens**.
- **Real-Time Spots Tracking:** Displays exact spots taken vs total spots available with progressive visual indicators.

### 2. 🛡️ Provably Fair Cryptographic Protocol
- Deterministic winner selection utilizing **SHA-256 cryptographic backend hashes** and client-seed auditing.
- Dedicated **Audited Winners Hub** (`/winners`) displaying verifiable draw hashes, draw timestamps, and ticket proofs to eliminate fraud and bias.

### 3. 🏆 3D Champions Podium & Leaderboard (Privacy Compliant)
- **Strict Rule 25 Privacy Compliance:** Never exposes raw full names or unmasked user IDs. Player handles are strictly masked (`@ve****25` / `VE****25`).
- **Dynamic 2-Letter Initials:** Stylized avatar initials derived dynamically from user names (e.g., *Dheeraj Kumar* ➔ `DK`).
- **Live Wallet-Synced Points:** Leaderboard scores sync directly with actual MongoDB user VES coin balances, preventing artificial score inflation.

### 4. 🔔 Real-Time Interactive Notification Center
- **Cross-Platform Bell Dropdown:** Desktop glassmorphism menu and touch-friendly mobile drawer modal with dark backdrop blur.
- **100% Live Backend Data:** Pulls live active giveaway alerts, real wallet balances, confirmed user entry tickets, and audited draw notices.
- **True Website Behavior:**
  - Animated pulsing unread badge counter.
  - 1-click smooth navigation to relevant giveaway pools and winner pages.
  - Individual read tracking and *"Mark all read"* functionality with `localStorage` persistence.

### 5. ⏳ Database-Synchronized Countdown Engine ("Ends In")
- **Live Next-Draw Tracker:** Inspects all active MongoDB pools and automatically counts down to the nearest concluding giveaway.
- **Real Seconds Ticking:** Live countdown clock with ticking seconds (`cd.s`) without artificial 24-hour reset fallbacks.
- **Contextual Subtitles & Direct Linking:** Displays the ending giveaway title (e.g. *Next Draw: ₹20 Instant Recharge Voucher*) with instant card navigation.

### 6. 💼 Member Profile & Multi-Currency Digital Wallet
- Tracks user balances across **VEs**, **SVEs**, and **Community Tokens**.
- Device fingerprint simulation (`veloop_device_hash`) for multi-account sybil resistance.
- Complete ticket history with active draw statuses.

---

## 🏗️ Architecture & Technology Stack

```
                                    ┌────────────────────────┐
                                    │    Client (Browser)    │
                                    │ React 19 + TailwindCSS │
                                    └───────────┬────────────┘
                                                │ REST API (HTTPS / JSON)
                                                ▼
                                    ┌────────────────────────┐
                                    │   Express 5 Backend    │
                                    │    Node.js Runtime     │
                                    └───────────┬────────────┘
                                                │ Mongoose ODM
                                                ▼
                                    ┌────────────────────────┐
                                    │  MongoDB Atlas Cluster │
                                    │ Users, Pools, Winners  │
                                    └────────────────────────┘
```

### **Frontend**
- **Framework:** React 19 with Vite 8
- **Routing:** React Router v7
- **Styling:** TailwindCSS 3.4 + Custom Glassmorphism UI tokens
- **Animations:** Framer Motion & Canvas Confetti
- **Icons:** Lucide React

### **Backend**
- **Runtime:** Node.js (v20+ / v24)
- **Framework:** Express.js 5
- **Database:** MongoDB Atlas via Mongoose 9
- **Authentication:** JWT (JSON Web Tokens) + BcryptJS password hashing
- **Security:** Strict CORS origin whitelist, parameter sanitization, and fallback DNS SRV resolution

---

## 📁 Repository Structure

```text
Veloop-Task-2/
├── Backend/                       # Node.js & Express API server
│   ├── src/
│   │   ├── config/                # Database connection & Atlas DNS config
│   │   ├── controllers/           # Business logic (Giveaways, Auth, Participations)
│   │   ├── middleware/            # JWT verification & CORS
│   │   ├── models/                # Mongoose schemas (User, Giveaway, Winner, Participation)
│   │   ├── routes/                # API route definitions
│   │   ├── scripts/               # Database seed scripts
│   │   └── server.js              # Express app bootstrap
│   ├── .env                       # Backend environment variables
│   └── package.json
│
├── Frontend/                      # React & Vite client application
│   ├── public/                    # Static assets & icons
│   ├── src/
│   │   ├── components/            # UI components (Navbar, StatsGrid, PrizeCard, Leaderboard)
│   │   │   ├── common/            # Shared components (Navbar, Leaderboard, WinnersList)
│   │   │   ├── giveaway/          # Contest cards, stats grid, hero banner
│   │   │   └── winners/           # Audited draw tabs & history
│   │   ├── context/               # Global Giveaway & Auth State Provider
│   │   ├── data/                  # Authoritative fallback specifications
│   │   ├── pages/                 # Route views (Home, GiveawayDetails, Winners, Profile)
│   │   ├── services/              # Resilient Axios/Fetch API client
│   │   ├── App.jsx                # Router setup
│   │   └── main.jsx               # React entry point
│   ├── .env                       # Frontend environment variables
│   ├── package.json
│   └── vite.config.js
│
├── netlify.toml                   # Netlify CI/CD build configuration & proxy redirects
└── README.md                      # Project documentation
```

---

## 📡 REST API Reference

| Method | Endpoint                          | Description                                       | Auth Required |
| ------ | --------------------------------- | ------------------------------------------------- | :-----------: |
| `POST` | `/api/auth/register`              | Register new member account & generate JWT        |       ❌       |
| `POST` | `/api/auth/login`                 | Authenticate user & receive session token         |       ❌       |
| `GET`  | `/api/auth/me`                    | Fetch authenticated user profile & balances       |   ✅ Bearer    |
| `GET`  | `/api/giveaways/current`          | List all active & upcoming prize pools            |       ❌       |
| `GET`  | `/api/giveaways/:id`              | Fetch specific giveaway details by ID/slug        |       ❌       |
| `GET`  | `/api/giveaways/previous/winners` | Get concluded draws with audited winners          |       ❌       |
| `POST` | `/api/participate`                | Enter giveaway & deduct ticket cost               |   ✅ Bearer    |
| `GET`  | `/api/participate/:id/my-status`  | Check if authenticated user joined pool           |   ✅ Bearer    |
| `GET`  | `/api/leaderboard`                | Live rankings (Daily, Weekly, All-Time)           |       ❌       |
| `GET`  | `/api/stats`                      | Platform metrics (Participants, Pools, Next Draw) |       ❌       |

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [Git](https://git-scm.com/)
- Access to a MongoDB database (Local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

### 1. Clone the Repository
```bash
git clone https://github.com/deirazx/veloop-rewards-task-2.git
cd veloop-rewards-task-2
```

---

### 2. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/veloop?retryWrites=true&w=majority
JWT_SECRET=veloop_rewards_secret_key_2026_jwt_token
CORS_ORIGIN=http://localhost:5173,https://veloop-rewards-dheeraj.netlify.app
NODE_ENV=development
```

*(Optional)* Seed database with official giveaways:
```bash
npm run seed
```

Start the backend development server:
```bash
npm run dev
# Server listening on http://localhost:5000
```

---

### 3. Frontend Setup
Open a new terminal:
```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend/` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the Vite development server:
```bash
npm run dev
# Local client running on http://localhost:5173
```

---

## 🚢 Deployment Guide

### Deploying Frontend to Netlify
1. Connect your repository to **Netlify**.
2. Set the build settings:
   - **Base directory:** `Frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `Frontend/dist`
3. Add Environment Variable in Netlify Dashboard:
   - `VITE_API_BASE_URL`: `https://your-backend.onrender.com/api`
4. The included `netlify.toml` automatically handles SPA routing and redirect rules.

### Deploying Backend to Render
1. Create a **New Web Service** on [Render](https://render.com/).
2. Select your repository and set the **Root Directory** to `Backend`.
3. Build command: `npm install`
4. Start command: `node src/server.js`
5. Configure Environment Variables (`MONGO_URI`, `JWT_SECRET`, `CORS_ORIGIN`, `NODE_ENV=production`).

---

## 🔒 Security & Privacy Highlights

- **Rule 25 Identity Obfuscation:** Enforces handle masking (`@ve****25`) at both API and UI layers to prevent user dox attacks.
- **Tamper-Resistant Countdown:** Timers use absolute server timestamps (`endAt`), preventing client-side clock manipulation.
- **Anti-Leakage Draw Rule:** Prevents display of fake/premature winners while a contest is in `ACTIVE` countdown state.
- **Failover DNS Configuration:** Custom Google DNS resolvers (`8.8.8.8`) prevent SRV resolution timeout issues on cloud clusters.

---

## 📄 License

This project is licensed under the **ISC License**. Developed as part of the VELOOP Rewards engineering assignment.
