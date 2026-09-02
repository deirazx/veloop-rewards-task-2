# VELOOP Rewards – Production Backend Service

Production-ready Node.js, Express, and MongoDB backend for the VELOOP Rewards Giveaway Platform.

---

## 🏗️ Architecture & Core Components

- **Database Connection (`src/config/db.js`)**: Mongoose connection configured via `process.env.MONGO_URI` with reconnection monitoring.
- **Data Models (`src/models/`)**:
  - `User.js`: Custom user IDs (`VE10025`), KYC flags, and balance ledger (`VES`, `SVES`, `Tokens`).
  - `Giveaway.js`: Stores lifecycle states (`UPCOMING`, `ACTIVE`, `ENDED`, `ARCHIVED`) and prizes array.
  - `Participation.js`: Tracks entries with compound unique index `{ userId: 1, giveawayId: 1 }` to physically guarantee zero duplicate entries.
  - `Transaction.js`: Audit ledger tracking balance before/after, currencies, and amounts.
  - `Winner.js`: Stores verified winners with masked IDs (`VE****25`).
  - `Claim.js`: Isolates `GIFT_CARD` (email strictly) and `PHYSICAL` (shipping address & PIN).
  - `FraudEvent.js`: Flags suspicious device collisions and high-frequency anomaly vectors.
  - `AuditLog.js`: Complete financial and operational audit trail.
- **Auth Middleware (`src/middleware/auth.js`)**: Resolves authentic `req.user` from JWT or verified database lookup; never trusts client-supplied user IDs.
- **Controllers (`src/controllers/`)**:
  - `participationController.js`: Atomic join with MongoDB transactions/atomic guard queries, device fraud checks, authoritative pricing.
  - `giveawayController.js`: Strict anti-premature winner leak guards on live drawings.
  - `claimController.js`: Authenticates `req.user.customUserId === winner.customUserId`, routes physical vs digital payloads.

---

## 🚀 Quick Start

### 1. Configure Environment
```bash
cp .env.example .env
```
Default configuration connects to `mongodb://localhost:27017/veloop_giveaway` on port `5000`.

### 2. Seed Database (Optional but Recommended)
Seeds test user `VE10025` (Alex Mercer) and the 5 authoritative giveaways:
```bash
npm run seed
```

### 3. Run Development Server
```bash
npm run dev
```

---

## 📡 API Endpoint Reference

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/health` | No | System health and uptime |
| `GET` | `/api/giveaways/current` | No | Retrieve active and upcoming pools |
| `GET` | `/api/giveaways/:id/winners` | No | Get winners (or active countdown notice) |
| `GET` | `/api/giveaways/previous/winners` | No | Historical concluded draws and winners |
| `POST` | `/api/participation/join` | **Yes** | Atomic balance deduction & pool entry |
| `GET` | `/api/participation/:id/my-status` | **Yes** | Check if current user joined giveaway |
| `POST` | `/api/claim/:id/claim` | **Yes** | Submit physical or digital prize claim |

---

## 🧪 Testing with cURL

### Join Giveaway:
```bash
curl -X POST http://localhost:5000/api/participation/join \
  -H "Content-Type: application/json" \
  -H "x-user-id: VE10025" \
  -d '{"giveawayId":"giveaway-iphone-15-pro","prizeId":"prize-iphone-15-pro","deviceHash":"dev_mac_ff91a27e8"}'
```

### Claim Physical Prize:
```bash
curl -X POST http://localhost:5000/api/claim/giveaway-ended-macbook-pro/claim \
  -H "Content-Type: application/json" \
  -H "x-user-id: VE10025" \
  -d '{
    "claimType": "PHYSICAL",
    "physicalShipping": {
      "fullName": "Alex Mercer",
      "phone": "+91 98765 43210",
      "address": "402 Oberoi Crest, Link Road",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pinCode": "400053"
    }
  }'
```
