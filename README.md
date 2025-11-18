# PeerNova

PeerNova is a streamlined digital platform designed to centralize student authentication and create a unified entry point into a future ecosystem of academic collaboration, resource sharing, and peer interaction. Built with modern web technologies, it provides a secure and scalable foundation for campus-centered applications.

---

## 🌟 Features

- User Authentication (Signup & Login)  
- JWT-Based Session Handling  
- Secure Password Hashing  
- Prisma ORM Integration  
- MySQL (Aiven) Cloud Database  
- Fully Responsive Frontend UI  
- Clean & Modular Code Architecture  
- Deployed Frontend & Backend  

---

## 🛠️ Tech Stack

### Frontend
- React.js  
- React Router  
- Tailwind CSS  
- Axios  
- Context API  
- Vercel Deployment  

### Backend
- Node.js  
- Express.js  
- Prisma ORM  
- MySQL (Aiven)  
- JWT (jsonwebtoken)  
- bcryptjs  
- dotenv  
- Render Deployment  

---

## 📁 Project Structure
.
├── peernova-backend
│   ├── package-lock.json
│   ├── package.json
│   ├── prisma
│   │   ├── migrations
│   │   │   ├── 20251118065236_user_table
│   │   │   │   └── migration.sql
│   │   │   └── migration_lock.toml
│   │   └── schema.prisma
│   ├── prisma.config.ts
│   └── src
│       ├── index.js
│       ├── middleware
│       │   └── auth.js
│       └── routes
│           └── auth.js
└── peernova-frontend
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── public
    │   └── vite.svg
    ├── src
    │   ├── App.jsx
    │   ├── api
    │   │   └── axios.js
    │   ├── assets
    │   ├── components
    │   │   └── common
    │   │       ├── Button.jsx
    │   │       ├── Footer.jsx
    │   │       ├── Input.jsx
    │   │       └── Navbar.jsx
    │   ├── context
    │   ├── index.css
    │   ├── main.jsx
    │   ├── pages
    │   │   ├── Dashboard.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── NotFound.jsx
    │   │   └── Signup.jsx
    │   ├── routes
    │   │   └── AppRoutes.jsx
    │   └── utils
    ├── tailwind.config.js
    └── vite.config.js

    
---

## 🔐 Authentication Flow

### 1. Signup
- User registers with name, email, and password  
- Password is hashed using bcryptjs  
- User record is stored in MySQL via Prisma  
- A JWT token is generated and returned  
- Token is stored in frontend storage (localStorage / context)

### 2. Login
- Credentials validated against hashed password  
- New JWT token is issued  
- Session established on the client  

### 3. Protected Access
- Requests include:  
  `Authorization: Bearer <token>`  
- Backend verifies and grants access  

### 4. Logout
- Token cleared  
- User session ends securely  

---

## 🧱 Database Schema

### User Model

prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}

🚀 Getting Started
Prerequisites

Node.js

npm or yarn

Aiven MySQL database

Git

🔧 Installation & Setup
1. Clone the repository
git clone https://github.com/your-username/PeerNova.git
cd PeerNova

2. Backend Setup
cd peernova-backend
npm install


Create .env:

DATABASE_URL="mysql://username:password@host:port/database"
JWT_SECRET="your-secret-key"
PORT=5000


Run Prisma migration:

npx prisma migrate dev --name init


Start server:

npm start


Backend URL:
https://peernova.onrender.com

3. Frontend Setup
cd ../peernova-frontend
npm install


Create .env:

VITE_API_URL="https://peernova.onrender.com"


Start frontend:

npm run dev


Frontend URL:
https://peer-nova.vercel.app

🛡️ Security Features

Bcrypt password hashing

JWT stateless authentication

Protected routes

Environment variable configuration

Prisma safe queries

CORS protection

🐛 Troubleshooting
Database Connection Failed

Ensure Aiven DB is active

Validate DATABASE_URL

Run:

npx prisma migrate dev

JWT Secret Missing

Add a secure JWT_SECRET to .env

CORS Issues

Confirm frontend domain is added in backend CORS config

🌐 Deployment
Frontend Deployment

Platform: Vercel

URL: https://peer-nova.vercel.app

Backend Deployment

Platform: Render

URL: https://peernova.onrender.com

Database

Platform: Aiven MySQL

Connected via Prisma ORM

👨‍💻 Author

Meghna Nair

📜 License

This project is licensed under the MIT License.


