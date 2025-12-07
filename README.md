# PeerNova

PeerNova is a comprehensive campus collaboration platform that enables students to create study groups, share educational resources, and collaborate with peers. The platform features a modern React frontend and a robust Node.js/Express backend with MySQL database integration.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## About

PeerNova provides a centralized platform for students to:
- Create and join study groups organized by subject
- Upload and share educational resources (PDFs, notes, presentations, videos, code)
- Track their academic contributions and engagement
- Discover resources and groups through advanced search and filtering

The platform is built with a focus on user experience, security, and scalability.

## Features

### User Management
- User registration and authentication with JWT
- Secure password hashing using bcryptjs
- Profile management with statistics tracking
- Account deletion capability

### Study Groups
- Create study groups with subject categorization
- Join and leave study groups
- Search and filter groups by subject, member count, and date
- View detailed group information including members and resources
- Pagination support for large datasets

### Resources
- Upload educational resources with file validation
- Support for multiple file types (PDFs, notes, presentations, videos, code)
- Download tracking and statistics
- Advanced search and filtering by category, subject, and date
- Resource categorization and organization
- Pagination support

### Dashboard
- Real-time statistics (groups created, groups joined, resources uploaded)
- Daily inspirational quotes
- Quick navigation to key features
- Responsive design with modern UI

### Additional Features
- Toast notifications for user feedback
- Loading states and error handling
- Responsive design for mobile and desktop
- Dark theme UI with Tailwind CSS
- Protected routes with authentication middleware
- File upload with size and type validation
- Rate limiting for uploads

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Validation**: express-validator
- **Rate Limiting**: express-rate-limit
- **Date Formatting**: date-fns

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Data Fetching**: TanStack React Query
- **HTTP Client**: Axios
- **Form Handling**: Formik with Yup validation
- **State Management**: Zustand
- **Icons**: Heroicons
- **UI Components**: Custom components with Tailwind CSS

## Project Structure

```
PeerNova/
├── peernova-backend/
│   ├── prisma/
│   │   ├── migrations/          # Database migrations
│   │   └── schema.prisma        # Prisma schema definition
│   ├── src/
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT authentication middleware
│   │   │   ├── errorHandler.js  # Global error handling
│   │   │   ├── upload.js        # File upload configuration
│   │   │   └── validation.js    # Input validation middleware
│   │   ├── routes/
│   │   │   ├── auth.js          # Authentication routes
│   │   │   ├── profile.js       # Profile management routes
│   │   │   ├── studyGroups.js   # Study group routes
│   │   │   └── resources.js     # Resource management routes
│   │   ├── utils/
│   │   │   ├── dateFormatter.js # Date formatting utilities
│   │   │   └── response.js      # Standardized API responses
│   │   └── index.js             # Express app entry point
│   ├── uploads/                 # Uploaded files directory
│   └── package.json
│
└── peernova-frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axios.js         # Axios instance configuration
    │   │   └── endpoints.js     # API endpoint constants
    │   ├── components/
    │   │   ├── cards/           # Card components
    │   │   ├── common/          # Reusable UI components
    │   │   ├── layouts/         # Layout components
    │   │   ├── modals/          # Modal components
    │   │   ├── notifications/   # Toast notification component
    │   │   ├── pagination/      # Pagination component
    │   │   └── states/          # Loading and empty states
    │   ├── hooks/               # Custom React hooks
    │   ├── pages/               # Page components
    │   ├── routes/              # Route configuration
    │   ├── constants/           # Application constants
    │   └── utils/               # Utility functions
    ├── public/                  # Static assets
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MySQL database (local or cloud instance like Aiven)
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/PeerNova.git
cd PeerNova
```

2. **Backend Setup**

```bash
cd peernova-backend
npm install
```

Create a `.env` file in `peernova-backend/`:

```env
DATABASE_URL="mysql://username:password@host:port/database"
JWT_SECRET="your-secret-key-here"
PORT=4000
FRONTEND_URL="http://localhost:5173,http://localhost:5174"
```

Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:4000` by default.

3. **Frontend Setup**

```bash
cd ../peernova-frontend
npm install
```

Create a `.env` file in `peernova-frontend/`:

```env
VITE_API_BASE_URL="http://localhost:4000"
```

Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` by default.

## API Documentation

### Authentication Endpoints

#### POST `/auth/signup`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "message": "User registered successfully"
}
```

#### POST `/auth/login`
Authenticate a user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "message": "Login successful"
}
```

### Profile Endpoints

All profile endpoints require authentication (Bearer token in Authorization header).

#### GET `/api/profile`
Get user profile with statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "stats": {
      "groupsCreated": 5,
      "groupsJoined": 12,
      "resourcesUploaded": 8
    },
    "ownedGroups": [...],
    "joinedGroups": [...],
    "ownedResources": [...]
  }
}
```

#### PUT `/api/profile`
Update user profile information.

#### PUT `/api/profile/password`
Change user password.

#### DELETE `/api/profile`
Delete user account.

### Study Groups Endpoints

All study group endpoints require authentication.

#### GET `/api/study-groups`
List all study groups with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12, max: 50)
- `search` (string): Search term for name/description
- `sort` (string): Sort order (newest, oldest, alpha, most-members)
- `subjects` (string): Comma-separated subject filters
- `members` (string): Member count filter

**Response:**
```json
{
  "success": true,
  "data": {
    "groups": [...],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

#### POST `/api/study-groups`
Create a new study group.

**Request Body:**
```json
{
  "name": "Advanced Algorithms Study Group",
  "description": "Weekly discussions on algorithms",
  "subject": "Data Structures & Algorithms",
  "maxMembers": 30
}
```

#### GET `/api/study-groups/:id`
Get study group details.

#### PUT `/api/study-groups/:id`
Update study group (owner only).

#### DELETE `/api/study-groups/:id`
Delete study group (owner only).

#### POST `/api/study-groups/:id/join`
Join a study group.

#### DELETE `/api/study-groups/:id/leave`
Leave a study group.

### Resources Endpoints

All resource endpoints require authentication.

#### GET `/api/resources`
List all resources with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12, max: 50)
- `search` (string): Search term for title/description
- `sort` (string): Sort order (newest, oldest, alpha, most-downloaded)
- `category` (string): Resource category filter
- `date` (string): Date filter (week, month, year)

**Response:**
```json
{
  "success": true,
  "data": {
    "resources": [...],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 100,
      "totalPages": 9
    }
  }
}
```

#### POST `/api/resources`
Upload a new resource.

**Request:** Multipart form data
- `title` (string): Resource title
- `description` (string): Resource description
- `category` (string): Resource category
- `subject` (string, optional): Subject tag
- `file` (file): Resource file (max 50MB)

**Supported Categories:**
- Notes
- PDF
- Presentation/Slides
- Video
- Code
- Other

#### GET `/api/resources/:id`
Get resource details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Advanced Algorithms Notes",
    "description": "...",
    "category": "PDF",
    "fileUrl": "http://localhost:4000/uploads/file.pdf",
    "fileName": "file.pdf",
    "downloadCount": 42,
    "isOwner": true,
    "uploadedBy": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT `/api/resources/:id`
Update resource (owner only).

#### DELETE `/api/resources/:id`
Delete resource (owner only).

## Database Schema

### User Model
```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  
  ownedGroups      StudyGroup[]
  joinedGroups     StudyGroupMember[]
  uploadedResources Resource[]
}
```

### StudyGroup Model
```prisma
model StudyGroup {
  id          String   @id @default(uuid())
  name        String
  description String   @db.Text
  subject     Subject
  owner_id    Int
  maxMembers  Int      @default(50)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  owner    User
  members  StudyGroupMember[]
  resources Resource[]
}
```

### Resource Model
```prisma
model Resource {
  id            String          @id @default(uuid())
  title         String
  description   String          @db.Text
  category      ResourceCategory
  subject       String?
  file_url      String
  fileName      String
  uploadedBy_id Int
  downloadCount Int             @default(0)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  uploadedBy User
  studyGroup StudyGroup?
}
```

### Enums

**Subject:**
- DataStructuresAlgorithms
- WebDevelopment
- MachineLearning
- CompetitiveProgramming
- MobileDevelopment
- Other

**ResourceCategory:**
- Notes
- PDF
- PresentationSlides
- Video
- Code
- Other

## Authentication

PeerNova uses JWT (JSON Web Tokens) for stateless authentication.

### Flow

1. **Registration/Login**: User provides credentials, server returns JWT token
2. **Protected Requests**: Client includes token in `Authorization: Bearer <token>` header
3. **Token Verification**: Server validates token on each protected route
4. **Logout**: Client removes token from storage

### Token Expiration

Tokens expire after 24 hours. Users must log in again after expiration.

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="mysql://username:password@host:port/database"

# JWT Secret (use a strong, random string in production)
JWT_SECRET="your-secret-key-here"

# Server Port
PORT=4000

# Allowed Frontend Origins (comma-separated)
FRONTEND_URL="http://localhost:5173,http://localhost:5174,https://your-frontend-domain.com"
```

### Frontend (.env)

```env
# Backend API URL
VITE_API_BASE_URL="http://localhost:4000"
```

## Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Set environment variables in your hosting platform
2. Ensure `DATABASE_URL` points to your production database
3. Run migrations: `npx prisma migrate deploy`
4. Start server: `npm start`

### Frontend Deployment (Vercel/Netlify)

1. Set `VITE_API_BASE_URL` to your production backend URL
2. Build: `npm run build`
3. Deploy the `dist` folder

### Database

Use a managed MySQL service like:
- Aiven
- PlanetScale
- AWS RDS
- Google Cloud SQL

## Security

### Implemented Security Measures

- **Password Hashing**: All passwords are hashed using bcryptjs before storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: All user inputs are validated using express-validator
- **File Upload Security**: File type and size validation, rate limiting
- **CORS Configuration**: Configurable CORS for cross-origin requests
- **Error Handling**: Secure error messages that don't expose sensitive information
- **SQL Injection Prevention**: Prisma ORM prevents SQL injection attacks

### Best Practices

- Never commit `.env` files to version control
- Use strong, unique `JWT_SECRET` in production
- Rotate JWT secrets periodically
- Use HTTPS in production
- Restrict CORS to specific origins in production
- Regularly update dependencies
- Monitor file uploads for malicious content
- Implement rate limiting for API endpoints

## Troubleshooting

### Database Connection Issues

**Error**: `Can't reach database server`

**Solutions**:
- Verify `DATABASE_URL` is correct
- Check database server is running and accessible
- Verify network/firewall settings
- Test connection with MySQL client

### Prisma Issues

**Error**: `Prisma Client not generated`

**Solution**:
```bash
cd peernova-backend
npm run prisma:generate
```

**Error**: `Migration failed`

**Solution**:
```bash
cd peernova-backend
npm run prisma:migrate
```

### Authentication Issues

**Error**: `Invalid token` or `Unauthorized`

**Solutions**:
- Verify `JWT_SECRET` is set correctly
- Check token is included in `Authorization` header
- Ensure token hasn't expired
- Clear browser storage and log in again

### File Upload Issues

**Error**: `File upload failed`

**Solutions**:
- Check file size (max 50MB)
- Verify file type is allowed
- Ensure `uploads/` directory exists and is writable
- Check rate limiting hasn't been exceeded

### CORS Issues

**Error**: `CORS policy blocked`

**Solutions**:
- Verify frontend URL is in `FRONTEND_URL` environment variable
- Check backend CORS configuration
- Ensure credentials are included in requests

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write clear commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## License

This project is licensed under the MIT License.

## Author

**Meghna Nair**

---

For questions or support, please open an issue on GitHub.
