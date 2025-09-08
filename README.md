# Rutledge Client Dashboard (Next.js + NextAuth + Prisma)

A lightweight client CRM you can deploy on Vercel. Features login, client list, create/edit, and suggested fields tailored for Rutledge Technologies.

## Stack
- Next.js 14 (App Router, Server Actions)
- NextAuth (Credentials provider)
- Prisma ORM
- PostgreSQL (Neon/Vercel Postgres/Supabase). SQLite works locally if you tweak datasource.

## Quick Start

1) **Clone & install**
```bash
npm i
```

2) **Configure env**
- Copy `.env.example` to `.env`
- Set `DATABASE_URL` to a Postgres database
- Generate a secret: `openssl rand -base64 32` and put into `AUTH_SECRET`

3) **Push schema & seed admin**
```bash
npm run prisma:push
npm run seed
```

Seed creates an admin:
- Email: admin@rutledgetechnologies.com
- Password: rutledge123  (change after first login)

4) **Run**
```bash
npm run dev
```

Then visit http://localhost:3000/login

## Deployment (Vercel)
- Create project in Vercel
- Add env vars (`DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`)
- If using Vercel Postgres, connect it and use the provided `DATABASE_URL`
- Build & deploy

## Notes
- The schema includes pipeline statuses, lead source, follow-up dates, budget/priority, tags, hosting & maintenance plan fields, and more.
- Edit styling in `src/app/globals.css` (uses your brand colors).

## License
MIT — customize for Rutledge Technologies.
