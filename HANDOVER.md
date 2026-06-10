# Developer Handover Guide

This repository contains the Next.js SaaS codebase for **Skool Video Downloader**. The project has been fully configured for local development, visual design, and payment flows.

---

## 🛠️ Tech Stack & Database Setup

1. **Next.js & React:** Next.js App Router (v14.2) styled with custom premium vanilla CSS modules and shared utility files.
2. **Database (SQLite):**
   * Configured via **Prisma ORM**.
   * Switched from Postgres/MySQL to **SQLite** for zero-setup local runs.
   * Schema location: [schema.prisma](file:///Users/ishara/Desktop/codes/skool%20final%20home/prisma/schema.prisma).
   * Local database file (excluded from git): `prisma/dev.db`.
3. **Authentication (NextAuth.js):**
   * Configured in [auth.ts](file:///Users/ishara/Desktop/codes/skool%20final%20home/src/lib/auth.ts).
   * Supports email sign-in, Google OAuth, and a **CredentialsProvider** for local testing.

---

## 🔑 Test Accounts & Local Credentials

To easily test administrative and subscriber panels, the following accounts are pre-configured:

* **Admin Portal Account:**
  * **Email:** `admin@test.com`
  * **Password:** `admin123`
* **Regular User Account:**
  * **Email:** `user@test.com`
  * **Password:** `user123`

---

## 🚀 Key Pages & Layout Structures

* **Blog & Guides (`/blog`):** Modern layout featuring hero section, featured article spotlight, category tags, and dynamic grid listings.
* **User Dashboard (`/dashboard`):** Premium dark mode user portal. Displays subscription metrics, link indicators for Skool & Loom Chrome extension video downloaders, dynamic Dodo Payments pricing cards (for Free accounts), and a direct link to the Dodo billing portal.
* **Admin Overview (`/admin`):** Metrics dashboard tracking total users, active subscribers, system health logs, and recent subscriber orders.
* **Publish Manager (`/admin/publish`):** Custom visual markdown authoring dashboard for creating and publishing articles to the SQLite database.
* **Static Content & Utilities:** Standardized footer, contact page, privacy policies, terms, refund forms, and thank-you templates.

---

## 💳 Checkout & Dodo Payments Integration

* **Checkout Endpoint:** [route.ts](file:///Users/ishara/Desktop/codes/skool%20final%20home/src/app/api/checkout/route.ts) receives the plan ID and email, calling the Dodo Payments SDK to generate checkout session redirects.
* **Webhook Handler:** [route.ts](file:///Users/ishara/Desktop/codes/skool%20final%20home/src/app/api/webhooks/dodopayments/route.ts) listens for Dodo events (`checkout.succeeded`, `subscription.cancelled`) to synchronize subscriber tiers.
* **Billing Portal:** Integrates Dodo's customer self-service hub (`customer.dodopayments.com`) for direct user invoice management.

---

## 💻 Running Locally

1. Create a `.env` file in the root directory:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8
   ADMIN_EMAIL=admin@test.com
   DATABASE_URL="file:./prisma/dev.db"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Sync the database:
   ```bash
   npx prisma db push
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
