GitHub Server Repo: https://github.com/FAHIMXGG/a8travel-backend

Server Live Deployment: https://a8travel-backend.vercel.app/health

GitHub Client Repo: https://github.com/FAHIMXGG/A8travel-client

Client Live Deployment: https://a8travel-client.vercel.app/

# Travel Buddy - Find Your Perfect Travel Companion

A modern, full-stack web application that connects travelers worldwide, allowing them to find travel companions, join or host travel plans, and create unforgettable adventures together.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [API Routes](#api-routes)
- [Authentication](#authentication)
- [Key Features](#key-features)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

Travel Buddy is a comprehensive platform designed to help travelers connect with like-minded individuals, plan trips together, and share travel experiences. The application features user profiles, travel plan management, reviews and ratings, subscription plans, and a robust authentication system.

### Main Purpose

- **Connect Travelers**: Find travel companions based on interests, destinations, and travel styles
- **Plan Trips**: Create and join travel plans with detailed information about destinations, budgets, and dates
- **Build Community**: Share experiences through reviews, ratings, and travel history
- **Manage Subscriptions**: Premium features for enhanced visibility and functionality

## ✨ Features

### Core Features

- 🔐 **User Authentication & Authorization**
  - Secure login/registration with NextAuth.js
  - Role-based access control (Admin/User)
  - Session management with JWT tokens
  - Password reset functionality

- 👥 **User Management**
  - User profiles with avatars, bio, and travel interests
  - Travel history tracking
  - Visited countries and travel interests
  - User gallery for photos
  - Rating and review system
  - Popular travelers showcase

- 🗺️ **Travel Plans**
  - Create and manage travel plans
  - Search and filter travel plans
  - Join travel plans as a participant
  - Travel plan status management (OPEN, CLOSED, FULL, ENDED, CANCELED)
  - Budget range specification
  - Multiple images per travel plan
  - Tags and categorization
  - Participant management

- 🔍 **Search & Discovery**
  - Find travel buddies by interests, countries, and location
  - Search travel plans by destination, dates, and budget
  - Advanced filtering options
  - Popular destinations showcase

- ⭐ **Reviews & Ratings**
  - Rate and review travel companions
  - View user ratings and reviews
  - Average rating calculations

- 💳 **Subscription System**
  - Premium subscription plans
  - Subscription status tracking
  - Enhanced features for premium users

- 📝 **Blog System**
  - Create and manage blog posts
  - Rich text editor for content creation
  - Blog listing and detail pages
  - Admin blog management

- 📸 **File Upload**
  - Image uploads via UploadThing
  - Gallery management
  - Thumbnail uploads for travel plans

- 💰 **Payment Integration**
  - Payment intent creation
  - Payment confirmation
  - Stripe integration support

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.7** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animations
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Lucide React** - Icons
- **React Hot Toast** - Notifications
- **Sonner** - Toast notifications

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js 4.24.11** - Authentication
- **Prisma 6.16.3** - ORM
- **SQLite** - Database (development)
- **Axios** - HTTP client

### Additional Tools
- **UploadThing** - File upload service
- **Quill** - Rich text editor
- **ESLint** - Code linting
- **Turbopack** - Fast bundler

## 📁 Project Structure

```
travel_client/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── dev.db                  # SQLite database
│   └── migrations/             # Database migrations
├── public/                     # Static assets
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── blogs/          # Blog endpoints
│   │   │   ├── payments/       # Payment endpoints
│   │   │   ├── travel-plans/   # Travel plan endpoints
│   │   │   ├── users/          # User endpoints
│   │   │   └── uploadthing/    # File upload endpoints
│   │   ├── about/              # About page
│   │   ├── blog/               # Blog pages
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── FindTravelBuddy/    # Find travel buddy page
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── travelplan/         # Travel plan pages
│   │   ├── users/              # User profile pages
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── providers.tsx       # Context providers
│   │   └── lib/                # Shared utilities
│   ├── components/             # React components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── ui/                 # UI components (shadcn/ui)
│   │   ├── Navbar.tsx          # Navigation bar
│   │   └── Footer.tsx          # Footer component
│   ├── lib/                    # Utility functions
│   ├── middleware.ts           # Next.js middleware
│   └── types/                  # TypeScript type definitions
├── .env.local                  # Environment variables (not in repo)
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Git
- Backend API server running (default: `http://localhost:5000`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travel_client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key
   BACKEND_URL=http://localhost:5000
   UPLOADTHING_SECRET=your-uploadthing-secret
   UPLOADTHING_APP_ID=your-uploadthing-app-id
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Backend API URL
BACKEND_URL=http://localhost:5000

# UploadThing Configuration
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id

# Database (if using external database)
DATABASE_URL=file:./dev.db
```

### Generating NEXTAUTH_SECRET

You can generate a secure secret using:
```bash
openssl rand -base64 32
```

## 🗄️ Database Setup

This project uses Prisma ORM with SQLite for development. The database schema is defined in `prisma/schema.prisma`.

### Database Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Current Schema

The database currently includes:
- `LocalDraft` - Placeholder model for drafts

**Note**: The main database models are managed by the backend API server. This client application connects to the backend for data operations.

## 🔌 API Routes

### Authentication Routes
- `POST /api/auth/[...nextauth]` - NextAuth authentication
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation
- `POST /api/auth/refresh-session` - Refresh user session
- `POST /api/auth/sync-cookie` - Sync authentication cookies
- `POST /api/logout` - User logout

### User Routes
- `GET /api/users/all` - Get all users (paginated)
- `GET /api/users/popular` - Get popular travelers
- `GET /api/users/search` - Search users
- `GET /api/users/[id]` - Get user by ID
- `GET /api/users/[id]/admin` - Admin user operations
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update user profile

### Travel Plan Routes
- `GET /api/travel-plans` - List all travel plans
- `POST /api/travel-plans` - Create new travel plan
- `GET /api/travel-plans/[id]` - Get travel plan details
- `PUT /api/travel-plans/[id]` - Update travel plan
- `DELETE /api/travel-plans/[id]` - Delete travel plan
- `POST /api/travel-plans/[id]/join` - Join a travel plan
- `GET /api/travel-plans/[id]/participants` - Get participants
- `GET /api/travel-plans/[id]/status` - Get travel plan status
- `GET /api/travel-plans/search` - Search travel plans
- `GET /api/travel-plans/match` - Match travel plans
- `GET /api/travel-plans/my` - Get user's travel plans
- `GET /api/travel-plans/me/travel-history` - Get travel history
- `GET /api/travel-plans/admin` - Admin travel plan operations

### Review Routes
- `GET /api/travel-plans/[id]/reviews` - Get reviews for a travel plan
- `POST /api/travel-plans/[id]/reviews` - Create a review
- `GET /api/travel-plans/[id]/reviews/[reviewId]` - Get review details
- `PUT /api/travel-plans/[id]/reviews/[reviewId]` - Update review
- `DELETE /api/travel-plans/[id]/reviews/[reviewId]` - Delete review

### Blog Routes
- `GET /api/blogs` - List all blogs
- `POST /api/blogs` - Create new blog
- `GET /api/blogs/[id]` - Get blog details
- `PUT /api/blogs/[id]` - Update blog
- `DELETE /api/blogs/[id]` - Delete blog

### Payment Routes
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment

### File Upload Routes
- `POST /api/uploadthing` - Upload files via UploadThing

## 🔒 Authentication

The application uses NextAuth.js for authentication with a credentials provider that connects to a backend API.

### Authentication Flow

1. User enters credentials on `/login`
2. Credentials are sent to backend API (`${BACKEND_URL}/api/auth/login`)
3. Backend returns user data and access token
4. NextAuth creates a JWT session
5. Access token is stored in the session for API calls

### Protected Routes

Routes under `/dashboard` are protected by middleware:
- Requires authentication
- Role-based access control (Admin/User)
- Admin-only routes: `/dashboard/users`
- User-only routes: `/dashboard/events/host`, `/dashboard/events/manage`, `/dashboard/profile/view`

### Session Management

- JWT-based sessions
- Session refresh capability
- Token refresh from backend
- Subscription status tracking in session

## 🎨 Key Features

### 1. Travel Plan Management

Users can:
- Create travel plans with destination, dates, budget, and description
- Upload multiple images for travel plans
- Set maximum participants
- Manage travel plan status
- Join existing travel plans
- View travel history

### 2. User Profiles

Features include:
- Profile pictures and galleries
- Bio and travel interests
- Visited countries tracking
- Current location
- Rating and review system
- Subscription status

### 3. Search & Discovery

- Search users by name, interests, or countries
- Search travel plans by destination, dates, or budget
- Filter and sort results
- Pagination support

### 4. Reviews & Ratings

- Rate travel companions after trips
- Write detailed reviews
- View average ratings
- Rating count display

### 5. Subscription System

- Premium subscription plans
- Subscription status tracking
- Enhanced features for premium users
- Subscription expiration management

### 6. Blog System

- Create and edit blog posts
- Rich text editor with formatting
- Image uploads
- Blog listing and detail pages

## 💻 Development

### Available Scripts

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier (if configured) for code formatting
- Component-based architecture

### Best Practices

- Use TypeScript for all new files
- Follow Next.js App Router conventions
- Use server components when possible
- Implement proper error handling
- Add loading states for async operations
- Use Zod for validation

## 🚢 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

Ensure all environment variables are set in your production environment:
- `NEXTAUTH_URL` - Your production URL
- `NEXTAUTH_SECRET` - Secure random string
- `BACKEND_URL` - Production backend API URL
- `UPLOADTHING_SECRET` - UploadThing production secret
- `UPLOADTHING_APP_ID` - UploadThing production app ID

### Deployment Platforms

The application can be deployed on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Railway**
- **Docker** containers

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 🆘 Support

For support, please contact the development team or open an issue in the repository.

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/)

---

**Built with ❤️ for travelers worldwide**

