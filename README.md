
# PeerNova

PeerNova is a lightweight platform that centralizes student authentication and provides a foundation for campus-focused collaboration, resource sharing, and peer-to-peer interaction. It pairs a React + Vite frontend with a Node/Express backend using Prisma and MySQL.

## Table of contents
- [About](#about)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Project layout](#project-layout)
- [Getting started](#getting-started)
- [Database (Prisma)](#database-prisma)
- [Authentication flow](#authentication-flow)
- [Environment & deployment](#environment--deployment)
- [Security notes](#security-notes)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Author & License](#author--license)

## About

PeerNova provides a simple, secure authentication system and a foundation for building campus-facing features. The repository contains two main projects:

- `peernova-backend/` — Express API with Prisma (MySQL)
- `peernova-frontend/` — React + Vite frontend

## Features

- Signup, login, logout
- JWT-based stateless sessions
- Password hashing with `bcryptjs`
- Type-safe DB access with Prisma
- MySQL (Aiven) compatibility
- Responsive UI built with Tailwind CSS

## Tech stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router
- Backend: Node.js, Express, Prisma, MySQL, `jsonwebtoken`, `bcryptjs`
- Deployment examples: Vercel (frontend), Render (backend)

## Project layout

High-level layout:

```text
PeerNova/
├─ peernova-backend/     # Express + Prisma API
└─ peernova-frontend/    # React + Vite app
```

Explore each directory for package scripts and detailed structure.

## Getting started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- A MySQL instance (Aiven or local)

### 1. Clone repository

```bash
git clone https://github.com/your-username/PeerNova.git
cd PeerNova
```

### 2. Backend setup

```bash
cd peernova-backend
npm install
```

Create a `.env` file in `peernova-backend/` with the following values:

```env
DATABASE_URL="mysql://username:password@host:port/database"
JWT_SECRET="your-secret-key"
PORT=5000
```

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Start the backend server:

```bash
npm start
```

### 3. Frontend setup

```bash
cd ../peernova-frontend
npm install
```

Create a `.env` file in `peernova-frontend/` (or set `VITE_API_URL`) :

```env
VITE_API_URL="http://localhost:5000"
```

Run the frontend:

```bash
npm run dev
```

## Database (Prisma)

An example `User` model (found in `peernova-backend/prisma/schema.prisma`):

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

Use `npx prisma generate` after any schema change.

## Authentication flow

1. Signup: user submits name, email, password → backend hashes password (`bcryptjs`) → user saved via Prisma → server returns JWT
2. Login: credentials verified → server returns JWT
3. Protected requests: include header `Authorization: Bearer <token>`; server verifies JWT
4. Logout: client discards token

## Environment & deployment

- Frontend example: Vercel — `https://peer-nova.vercel.app`
- Backend example: Render — `https://peernova.onrender.com`
- Database: Aiven MySQL (connect via `DATABASE_URL` in `.env`)

## Security notes

- Do not commit `.env` files to source control.
- Use a strong `JWT_SECRET` in production and rotate it periodically.
- Use HTTPS in production and restrict CORS to allowed origins.

## Troubleshooting

- Database connection errors: verify `DATABASE_URL`, network access, and credentials.
- Prisma issues: run `npx prisma generate` and `npx prisma migrate dev`.
- JWT errors: ensure `JWT_SECRET` is set in the environment used by the server.

## Contributing

Contributions are welcome. Please open an issue to discuss changes or submit a pull request with a clear description and reproduction steps.

git clone https://github.com/your-username/PeerNova.git
## Project layout

Detailed layout (expanded):

```
PeerNova/
├─ peernova-backend/
│  ├─ package.json
│  ├─ package-lock.json
│  ├─ prisma/
│  │  ├─ migrations/
│  │  │  ├─ 20251118065236_user_table/
│  │  │  │  └─ migration.sql
│  │  │  └─ migration_lock.toml
│  │  └─ schema.prisma
│  ├─ prisma.config.ts
│  └─ src/
│     ├─ index.js
│     ├─ middleware/
│     │  └─ auth.js
│     └─ routes/
│        └─ auth.js
└─ peernova-frontend/
  ├─ package.json
  ├─ package-lock.json
  ├─ index.html
  ├─ postcss.config.js
  ├─ tailwind.config.js
  ├─ vite.config.js
  └─ src/
    ├─ main.jsx
    ├─ App.jsx
    ├─ index.css
    ├─ api/axios.js
    ├─ components/
    │  └─ common/
    │     ├─ Button.jsx
    │     ├─ Footer.jsx
    │     ├─ Input.jsx
    │     └─ Navbar.jsx
    ├─ pages/
    │  ├─ Home.jsx
    │  ├─ Login.jsx
    │  ├─ Signup.jsx
    │  ├─ Dashboard.jsx
    │  └─ NotFound.jsx
    └─ routes/
      └─ AppRoutes.jsx
```

## Authentication flow

1. Signup
  - User registers with name, email, and password.
  - Backend hashes the password using `bcryptjs` and stores the user via Prisma.
  - Backend returns a JWT token to the client.

2. Login
  - Client sends credentials; backend verifies the hashed password.
  - Backend issues a new JWT on successful authentication.

3. Protected access
  - Client includes the JWT in requests using the header:

    ```http
    Authorization: Bearer <token>
    ```

  - Backend verifies the token and grants access to protected routes.

4. Logout
  - Client removes the stored token (e.g., from `localStorage` or context) to end the session.

## Database (Prisma)

Example `User` model (located at `peernova-backend/prisma/schema.prisma`):

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

Run `npx prisma generate` after making schema changes.

## Getting started (summary)

Follow these steps to run the project locally:

1. Clone the repository

```bash
git clone https://github.com/your-username/PeerNova.git
cd PeerNova
```

2. Backend

```bash
cd peernova-backend
npm install
```

Create a `.env` file inside `peernova-backend/`:

```env
DATABASE_URL="mysql://username:password@host:port/database"
JWT_SECRET="your-secret-key"
PORT=5000
```

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Start the backend:

```bash
npm start
```

3. Frontend

```bash
cd ../peernova-frontend
npm install
```

Create a `.env` in the frontend root with:

```env
VITE_API_URL="http://localhost:5000"
```

Start the frontend:

```bash
npm run dev
```

## Environment & deployment

- Frontend example: Vercel — `https://peer-nova.vercel.app`
- Backend example: Render — `https://peernova.onrender.com`
- Database: Aiven MySQL (connect via `DATABASE_URL` in `.env`)

## Security notes

- Do not commit `.env` files or secrets to source control.
- Use a strong `JWT_SECRET` and rotate it periodically.
- Use HTTPS in production and restrict CORS to trusted origins.

## Troubleshooting

- Database connection errors: verify `DATABASE_URL`, network access, and credentials.
- Prisma issues: run `npx prisma generate` and `npx prisma migrate dev`.
- JWT errors: ensure `JWT_SECRET` is set in the server environment.

## Contributing

Contributions are welcome. Please open an issue to discuss changes or submit a pull request with a clear description and reproduction steps.

## Author & License

- Author: Meghna Nair
- License: MIT


