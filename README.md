# 🎁 VELOOP Rewards – Enterprise Giveaway & Transparent Allocation Platform

[![Vite](https://img.shields.io/badge/Vite-8.2.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://veloop-rewards-dheeraj.netlify.app)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

> **VELOOP Rewards** is an enterprise-grade, gamified Fintech rewards portal engineered for transparent, high-trust community giveaways. Built with an **Audited Platform Allocation System**, **Rule 25 Identity Privacy Masking**, multi-currency balance validation, atomic participation states, and real-time synchronized countdown engines.

---

## 🌐 Live Platform Deployments

| Service                | Target Platform | Production URL                                                                           |
| ---------------------- | --------------- | ---------------------------------------------------------------------------------------- |
| **Client Frontend**    | Netlify         | [https://veloop-rewards-dheeraj.netlify.app](https://veloop-rewards-dheeraj.netlify.app) |
| **Backend API Server** | Render          | `https://veloop-giveaway-backend.onrender.com/api`                                       |
| **Database Cluster**   | MongoDB Atlas   | Frankfurt Cluster (M0 Sandbox with Failover DNS)                                         |

---

## 🎯 Official Specification Matrix & Approved Catalog

Strictly aligned with official specification clauses (1–103), eliminating casino mechanics, betting jargon, and unapproved rewards:

| Prize Item                | Category          | Allocation / Spots | Entry Fee |  Required Currency   | Fulfillment Requirement                 |
| ------------------------- | ----------------- | :----------------: | :-------: | :------------------: | --------------------------------------- |
| **Apple iPhone 15 Pro**   | Physical Tech     |   1 Grand Prize    |    250    |       **VEs**        | Full Name, Phone, Shipping Address, PIN |
| **Apple Watch Series 9**  | Physical Tech     |    Configurable    |    200    |       **VEs**        | Full Name, Phone, Shipping Address, PIN |
| **Apple AirPods Pro**     | Physical Tech     |    Configurable    |    500    |  **SVEs** (Staked)   | Full Name, Phone, Shipping Address, PIN |
| **₹2,000 Amazon Voucher** | Digital Gift Card |     Multi-tier     |    500    |       **VEs**        | Recipient Email Address Only            |
| **₹500 Amazon Voucher**   | Digital Gift Card |     Multi-tier     |    300    |       **VEs**        | Recipient Email Address Only            |
| **₹20 Instant Recharge**  | Micro Voucher     |     Fast-Draw      |   2,000   | **Community Tokens** | Recipient Email Address Only            |

---

## ⚡ Core Engineering & Architecture Highlights

### 1. 🛡️ Transparent Allocation Architecture & Winner Lifecycle
- **Audited Selection Engine:** Draws utilize cryptographic seed combinations with backend SHA-256 block hash generation for independent verification.
- **Audited Winners Hub (`/winners`):** Displays public draw verification hashes, timestamps, and verifiable ticket IDs.
- **Premature Leakage Barrier:** Active giveaway pools strictly forbid dummy winner tickers. The status marquee displays verified platform updates until an event countdown formally concludes.

### 2. 🔒 Strict Rule 25 Privacy Obfuscation
- **Public Masking:** Public leaderboards, champions podium, and winner archives strictly mask usernames (`@ve****25` or `VE****25`). Real full names and unmasked IDs are 100% sanitized before frontend hydration.
- **Dynamic 2-Letter Initials:** Stylized avatar initials derived dynamically from user credentials (e.g., *Dheeraj Kumar* ➔ `DK`).

### 3. 🚦 Enforced Multi-Step Participation Journey (Clauses 79–103)
- **Zero Instant Deductions:** Card action buttons route exclusively to dedicated `/giveaway/:slug` overview pages to enforce T&C and eligibility inspection.
- **Dynamic Balance Validation:** Evaluates specific wallet balances (VEs vs SVEs vs Tokens). Deficits trigger dynamic shortfall alerts ("Earn More VEs (+50 needed)").
- **Atomic Confirmation Modal:** Inspects starting balance, exact entry fee deduction, and projected net balance before submitting.
- **Double-Click Lock:** Submission toggles a progressive loading spinner (`Joining Giveaway...`) before rendering the final `You're Participating ✓` state with a unique ticket identifier.

### 4. 🔔 Interactive Notification Center & Global Persistence
- **Persistent Unread Counter:** Live unread notification counter badge with automatic `localStorage` synchronization across refreshes.
- **Contextual Deep Linking:** 1-click smooth navigation to active contests, wallet top-ups, and audited draws.
- **Unified Navigation:** Full-bleed drawer on mobile devices with background blur and desktop glassmorphic dropdowns.

### 5. ⏳ Database-Synchronized Next-Draw Engine
- **Active Pool Inspection:** Scans MongoDB for the active giveaway with the earliest `endAt` timestamp.
- **Real-Time Seconds Counter:** Live countdown ticker (`dd : hh : mm : ss`) eliminating fixed 24-hour reset fallbacks.

---

## 🏗️ Technical Stack & Dependencies

```text
┌────────────────────────────────────────────────────────┐
│               Client Application (Vite 8)              │
│       React 19 • TailwindCSS 3.4 • Lucide React        │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (HTTPS / JSON)
                            ▼
┌────────────────────────────────────────────────────────┐
│             API Server (Express 5 / Node.js)           │
│        JWT Auth • Rate Limiting • Helmet Security      │
└───────────────────────────┬────────────────────────────┘
                            │ Mongoose 9 ODM
                            ▼
┌────────────────────────────────────────────────────────┐
│            Database (MongoDB Atlas Cluster)            │
│       Users • Giveaways • Participations • Draws       │
└───────────────────────────┘