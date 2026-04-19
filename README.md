# FinOps-AI

An autonomous financial operations platform designed for SMEs. FinOps-AI uses AI to automate invoice parsing, bank reconciliation, and financial management — replacing manual CA workflows with an intelligent agent pipeline.

**Live Demo:** [https://fin-ops-ai-4ggt.vercel.app](https://fin-ops-ai-4ggt.vercel.app)

---

## What It Does

- **Invoice Extraction** — Upload invoice PDFs/images; Gemini AI parses vendor details, HSN codes, GST rates, and line items automatically
- **Bank Feed Management** — Log and track CREDIT/DEBIT transactions with narration
- **Autonomous Reconciliation** — Matches bank transactions against invoices using narration-based fuzzy lookup
- **Anomaly Detection** — Flags high-risk discrepancies and unmatched entries
- **Audit Logs** — Full trail of all financial actions per user
- **Role-based Auth** — JWT-secured API with bcrypt password hashing

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL (via Supabase) |
| ORM | Prisma 7 |
| AI | Google Gemini (`@google/generative-ai`) |
| Auth | JWT + bcrypt |
| Deployment | Vercel (client) · Render (server) |

---

## Project Structure

```
FinOps-AI/
├── client/          # React frontend (Vite)
├── server/          # Express backend (TypeScript)
└── diagrams/        # Architecture & design diagrams
```

---

## Running Locally

### Prerequisites

- Node.js 18+
- PostgreSQL database (or a [Supabase](https://supabase.com) free tier project)
- Google Gemini API key ([get one here](https://aistudio.google.com/app/apikey))

### 1. Clone the repo

```bash
git clone https://github.com/Kundan-CR7/FinOps-AI.git
cd FinOps-AI
```

### 2. Set up the server

```bash
cd server
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

Install dependencies and run migrations:

```bash
npm install
npx prisma migrate dev
npm run dev
```

The server runs on `http://localhost:3000`.

### 3. Set up the client

```bash
cd ../client
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Install and start:

```bash
npm install
npm run dev
```

The client runs on `http://localhost:5173`.

---

## Architecture

Design diagrams (ER diagram, class diagram, sequence diagram, use case diagram) are in the [`/diagrams`](./diagrams/) folder.
