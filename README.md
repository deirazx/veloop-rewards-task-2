# 🎁 VELOOP Rewards – Enterprise Giveaway & Transparent Allocation Platform

[![Vercel](https://img.shields.io/badge/Vercel-Live_Production-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://veloop-rewards-task-2.vercel.app/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

> **VELOOP Rewards** is an enterprise-grade, gamified Fintech rewards portal engineered for transparent, high-trust community giveaways. Built with an **Automated Draw Lifecycle Engine**, **Cryptographically Audited Winner Selection**, **Rule 25 Identity Privacy Masking**, multi-currency balance validation, atomic participation states, and real-time synchronized countdown engines.

---

## 🌐 Live Production Deployments

| Service | Platform | Production URL | Status |
| :--- | :--- | :--- | :---: |
| **Client Frontend (Primary)** | **Vercel** | [https://veloop-rewards-task-2.vercel.app](https://veloop-rewards-task-2.vercel.app) | 🟢 Live |
| **Client Frontend (Mirror)** | **Netlify** | [https://veloop-rewards-dheeraj.netlify.app](https://veloop-rewards-dheeraj.netlify.app) | 🟢 Live |
| **Backend API Server** | **Render** | [`https://veloop-giveaway-backend.onrender.com/api`](https://veloop-giveaway-backend.onrender.com/api) | 🟢 Live |
| **Database Cluster** | **MongoDB Atlas** | Frankfurt Cluster (M0 Sandbox with Failover DNS) | 🟢 Live |

---

## 🎯 Official Specification Matrix & Approved Catalog

Strictly aligned with official specification clauses (1–103), eliminating casino mechanics, betting jargon, and unapproved rewards:

| Prize Item | Category | Allocation / Spots | Entry Fee | Required Currency | Fulfillment Requirement |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Apple iPhone 15 Pro** | Physical Tech | 1 Grand Prize | 250 | **VEs** | Full Name, Phone, Shipping Address, PIN |
| **Apple Watch Series 9** | Physical Tech | Configurable | 200 | **VEs** | Full Name, Phone, Shipping Address, PIN |
| **Apple AirPods Pro** | Physical Tech | Configurable | 500 | **SVEs** (Staked) | Full Name, Phone, Shipping Address, PIN |
| **₹2,000 Amazon Voucher** | Digital Gift Card | Multi-tier | 500 | **VEs** | Recipient Email Address Only |
| **₹500 Amazon Voucher** | Digital Gift Card | Multi-tier | 300 | **VEs** | Recipient Email Address Only |
| **₹20 Instant Recharge** | Micro Voucher | Fast-Draw | 2,000 | **Community Tokens** | Recipient Email Address Only |

---

## ⚡ Core Engineering & Architecture Highlights

### 1. 🤖 Automated Pool Lifecycle & Cron Engine (`cronService.js`)
- **Real-Time Lifecycle Automation:** A dedicated background scheduler monitors active giveaway deadlines every 10 seconds.
- **Atomic Concluded Transitions:** Automatically transitions expired pools from `ACTIVE` ➔ `ENDED`, locks entries, and invokes deterministic winner selection.
- **Recurring Cycle Auto-Spawn:** For micro-vouchers and daily draws, automatically spawns fresh next-cycle giveaway pools with updated deadlines and initial zero-entry pools.

### 2. 🛡️ Cryptographically Audited Selection Architecture (`/winners`)
- **Deterministic Seed Hashing:** Winner draws use combined block seeds + ticket seeds via SHA-256 for provably transparent winner verification.
- **Audited Winners Hub (`/winners`):** Publicly displays verification seeds, timestamps, draw numbers, and masked recipient badges.
- **Anti-Premature Leakage Guard:** Active giveaways strictly forbid fake mock winners; status marquee only showcases genuine platform updates until official countdown conclusion.

### 3. 📱 Mobile-First Responsive Engineering
- **Uniform Card Flex Architecture:** Custom `PrizeCard` layout enforcing uniform `h-[460px]` height, fixed 1:1 square prize imagery with zero cutoff, and consistent tag positioning.
- **Solid Mobile Drawer Navigation:** 100% solid, non-transparent backdrop drawer preventing background text overlap.
- **Floating Luxury Trophy CTA:** Quick-action mobile floating rankings trigger for instant leaderboard access.
- **Stabilized Desktop Navbar:** Standardized fixed height navigation links with zero vertical jumping or layout shifts.

### 4. 🔒 Strict Rule 25 Privacy Obfuscation
- **Public Masking:** Public leaderboards, champions podium, and winner archives strictly mask usernames (`@ve****25` or `VE****25`). Real full names and unmasked IDs are 100% sanitized before frontend hydration.
- **Dynamic 2-Letter Initials:** Stylized avatar initials derived dynamically from user credentials (e.g., *Dheeraj Kumar* ➔ `DK`).

### 5. 🚦 Enforced Multi-Step Participation Journey (Clauses 79–103)
- **Zero Instant Deductions:** Card action buttons route exclusively to dedicated `/giveaway/:slug` overview pages to enforce T&C and eligibility inspection.
- **Dynamic Balance Validation:** Evaluates specific wallet balances (VEs vs SVEs vs Tokens). Deficits trigger dynamic shortfall alerts ("Earn More VEs (+50 needed)").
- **Atomic Confirmation Modal:** Inspects starting balance, exact entry fee deduction, and projected net balance before submitting.
- **Double-Click Lock:** Submission toggles a progressive loading spinner (`Joining Giveaway...`) before rendering the final `You're Participating ✓` state with a unique ticket identifier.

### 6. 🌐 Edge Routing & Flexible API Client
- **Vercel Reverse Proxy (`vercel.json`):** Edge rewrite rules route `/api/*` requests cleanly to the live Render backend, preventing 405 Method Not Allowed issues.
- **Self-Healing API Client (`api.js`):** Automatically sanitizes base URLs, appends `/api` suffixes, and routes production calls directly to the live Render backend.

---

## 🏗️ Technical Stack & Architecture

```text
┌────────────────────────────────────────────────────────┐
│               Client Application (Vite 8)              │
│       React 19 • TailwindCSS 3.4 • Lucide React        │
│       SPA Routing (Vercel Edge & Netlify Configured)   │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (HTTPS / JSON)
                            ▼
┌────────────────────────────────────────────────────────┐
│             API Server (Express 5 / Node.js)           │
│        JWT Auth • Rate Limiting • Lifecycle Cron       │
│        CORS Whitelist (Vercel, Netlify, Localhost)     │
└───────────────────────────┬────────────────────────────┘
                            │ Mongoose 9 ODM
                            ▼
┌────────────────────────────────────────────────────────┐
│            Database (MongoDB Atlas Cluster)            │
│       Users • Giveaways • Participations • Draws       │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 Local Development Setup

### 1. Backend Setup
```bash
cd Backend
npm install
cp .env.example .env
npm run dev
```
Backend runs on `http://localhost:5000` (API: `http://localhost:5000/api`).

### 2. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## 📜 Submission & Compliance Note
This project was developed strictly adhering to fintech compliance guidelines. All terminology conforms to **"Transparent & Audited Community Rewards"** — with zero gambling or betting mechanisms.