# FinOps-AI

An autonomous financial operations platform designed for SMEs. FinOps-AI uses AI to automate invoice parsing, bank reconciliation, and financial management — replacing manual CA workflows with an intelligent agent pipeline.

**Live Demo:** [https://fin-ops-ai-4ggt.vercel.app](https://fin-ops-ai-4ggt.vercel.app)

---

##  Core Features

- **Intelligence-First Data Entry** — Upload invoice PDFs/images; Google Gemini AI extracts vendor details, HSN codes, and line items with absolute precision.
- **Unified Bank Feeds** — Manage multiple digital bank statements and track CREDIT/DEBIT flows in a single editorial dashboard.
- **Autonomous Reconciliation** — A combinatorial matching engine that links bank transactions to invoices using narration-based fuzzy lookup and amount verification.
- **Compliance & Auditing** — Real-time anomaly detection flags discrepancies, while a full audit log tracks every financial event.
- **Tax-Ready Reporting** — (Admin Only) Generate GSTR-1 ready reports and simulate tax filings with a single click.

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS (Minimalist Monochrome) |
| **Backend** | Node.js, Express 5, TypeScript |
| **Database** | PostgreSQL (via Supabase / Prisma 7) |
| **AI Engine** | Google Gemini (`@google/generative-ai`) |
| **Auth** | JWT + bcrypt with Role-Based Access Control (RBAC) |
| **Deployment** | Vercel (Frontend) · Render (Backend) |

---

##  Usage Guide: The FinOps Workflow

Follow this sequence to manage your financial operations through the platform:

### 1. Onboarding
- **Signup**: Create a new account. By default, all new registrations are assigned the `USER` role.
- **Login**: High-security entry to your financial canvas.

### 2. Intake (Invoices)
- Navigate to the **Invoices** tab.
- Upload a vendor invoice (PDF or Image). 
- Wait for the AI to process the document. You will see line items, HSN codes, and GST calculated automatically.

### 3. Verification (Bank Feeds)
- Navigate to **Bank Feeds**.
- Manually enter or "sync" bank transactions recorded in your statement.
- Each transaction acts as a potential "match" for your recorded invoices.

### 4. Intelligence (Reconciliation)
- Go to the **Reconciliation** module.
- Run the Matching Engine. The system will highlight transactions that perfectly match your invoices based on vendor names, dates, and amounts.
- Resolve any manual mismatches to maintain a clean ledger.

### 5. Compliance (Admin Only)
- **Alerts**: Access the Alerts section to see high-severity anomalies cross-referenced by the AI.
- **Reports**: Generate and "File" your tax returns. The system calculates GSTR-1 liabilities based on extracted invoice data.

---


---

##  Project Structure

```
FinOps-AI/
├── client/          # React frontend (Vite)
├── server/          # Express backend (TypeScript)
├── diagrams/        # Architecture & use case diagrams
└── README.md        # This file
```

---

##  Running Locally

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### 1. Database & Environment Setup
**Server (`/server`):**
1. Create a `.env` file:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   FRONTEND_URL=http://localhost:5173
   ```
2. `npm install`
3. `npx prisma migrate dev`
4. `npm run dev` (Runs on `http://localhost:3000`)

**Client (`/client`):**
1. Create a `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```
2. `npm install`
3. `npm run dev` (Runs on `http://localhost:5173`)

---

##  Architecture
Design diagrams (ER, Class, Sequence, Use Case) are located in the [`/diagrams`](./diagrams/) folder.
