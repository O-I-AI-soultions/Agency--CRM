# O-I CRM

Internal lead & client management dashboard for **O-I** — a small web agency in Israel.
Hebrew (RTL) interface, built with Next.js and backed entirely by Airtable (no separate
database).

## What it does

- **ניהול לידים (Lead Pipeline)** — a Kanban board of leads pulled from the "Lead
  Tracker" Airtable table, grouped by status (New Lead, Contacted, Pitch Sent, Not
  Interested, plus an "Other" column for stray statuses). Each card shows the business
  name, city, Google rating, phone/website/maps links and notes, with action buttons
  to advance the lead through the pipeline — updates write straight back to Airtable.
- **לקוחות משלמים (Active Clients & Billing)** — a table of converted clients (Client
  Name, Setup Fee, Monthly Retainer, Active/Inactive status), backed by a "Clients"
  table in the same Airtable base. Status can be toggled directly from the table.

Authentication is a single shared password (no user accounts), stored as a signed
session cookie.

## Tech stack

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS v4](https://tailwindcss.com)
- [`airtable`](https://www.npmjs.com/package/airtable) npm package as the data layer

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login`.

### Environment variables

Copy `.env.local.example` to `.env.local` and fill in the real values:

```
AIRTABLE_API_KEY=         # Airtable Personal Access Token with read/write access to the base
AIRTABLE_BASE_ID=         # Airtable base ID (the "O-I-AI-soultions" base)
DASHBOARD_PASSWORD=       # shared login password for the dashboard
AUTH_SECRET=              # long random string used to sign session cookies
```

`.env.local` is gitignored and must never be committed.

## Airtable tables used

- **Lead Tracker** — source of truth for the leads Kanban board (`Status` field drives
  the columns).
- **Clients** — Client Name, Setup Fee, Monthly Retainer, Status (Active/Inactive).

## Notes

- This is a separate repo from the main O-I lead-pipeline project — see
  [O-I-AI-soultions/O-I](https://github.com/O-I-AI-soultions) for the Apify → Make →
  Airtable scraping pipeline that feeds the "Lead Tracker" table.
- Deployment target (e.g. Vercel) is not yet configured.
