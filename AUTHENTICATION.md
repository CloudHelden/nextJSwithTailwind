# Authentication Implementation Documentation

## Overview
This Next.js 15 application implements a complete authentication system using JWT tokens, bcrypt for password hashing, and middleware-based route protection. The implementation follows Next.js best practices with App Router.

## Architecture Components

### 1. Authentication Utilities (`/src/lib/auth.js`)
- **Password Hashing**: Uses bcryptjs with salt rounds of 12
- **JWT Management**: Creates and verifies JWT tokens with 7-day expiration
- **Token Extraction**: Supports both Authorization header and HTTP-only cookies

### 2. Database Model (`/src/models/User.js`)
- Extended User model with password field
- Password automatically excluded from queries (select: false)
- Minimum password length: 6 characters

### 3. API Routes

#### `/api/auth/register` (POST)
- Creates new user account
- Hashes password before storage
- Returns JWT token in HTTP-only cookie
- Validates email uniqueness

#### `/api/auth/login` (POST)
- Authenticates user credentials
- Verifies password against hash
- Returns JWT token in HTTP-only cookie
- Handles invalid credentials gracefully

#### `/api/auth/logout` (POST)
- Clears authentication cookie
- No server-side session invalidation needed (stateless)

#### `/api/auth/me` (GET)
- Returns current user information
- Verifies JWT token from cookie
- Protected endpoint example

### 4. Middleware (`/src/middleware.js`)
- Protects routes automatically
- Protected paths: `/dashboard`, `/profile`, `/api/protected`
- Redirects unauthenticated users to login
- Redirects authenticated users away from auth pages
- Preserves original URL for post-login redirect

### 5. Authentication Context (`/src/contexts/AuthContext.js`)
- Global authentication state management
- Provides login, register, logout functions
- Auto-checks authentication on mount
- Handles loading states

### 6. UI Components

#### Login Page (`/app/login/page.js`)
- Email and password form
- Error handling and display
- Loading states
- Link to registration

#### Register Page (`/app/register/page.js`)
- Full registration form with name, email, password
- Password confirmation field
- Client-side validation
- Link to login

#### Dashboard (`/app/dashboard/page.js`)
- Protected route example
- Displays user profile information
- Logout functionality
- Auto-redirect if not authenticated

## Security Features

1. **Password Security**
   - Bcrypt hashing with 12 salt rounds
   - Passwords never returned in API responses
   - Minimum length enforcement

2. **Token Security**
   - HTTP-only cookies prevent XSS attacks
   - Secure flag in production (HTTPS only)
   - SameSite=lax for CSRF protection
   - 7-day expiration

3. **Route Protection**
   - Middleware-level protection
   - Automatic token validation
   - Graceful handling of expired tokens

## Environment Variables

Add to your `.env.local`:
```env
JWT_SECRET=your-secret-key-change-in-production
MONGODB_URI=mongodb://localhost:27017/mein-blog
NODE_ENV=development
```

## Usage Flow

1. **Registration**
   - User fills registration form
   - Password hashed and user created
   - JWT token generated and stored as cookie
   - Redirects to dashboard

2. **Login**
   - User enters credentials
   - Password verified against hash
   - JWT token generated and stored as cookie
   - Redirects to dashboard or original requested URL

3. **Protected Routes**
   - Middleware checks for valid token
   - Invalid/missing tokens redirect to login
   - Valid tokens allow access

4. **Logout**
   - Cookie cleared client and server side
   - User redirected to login page

## Testing the Authentication

1. Start MongoDB:
```bash
docker-compose up -d
```

2. Run the development server:
```bash
npm run dev
```

3. Test endpoints:
   - Register: http://localhost:3000/register
   - Login: http://localhost:3000/login
   - Dashboard (protected): http://localhost:3000/dashboard

## API Testing with curl

Register new user:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

Access protected route:
```bash
curl http://localhost:3000/api/auth/me -b cookies.txt
```

## Best Practices Implemented

1. **Stateless Authentication**: JWT tokens, no server sessions
2. **Secure by Default**: HTTP-only cookies, bcrypt hashing
3. **Error Handling**: Graceful failures with user-friendly messages
4. **Loading States**: UI feedback during async operations
5. **Type Safety**: Consistent data structures
6. **Separation of Concerns**: Auth logic separated from UI
7. **Next.js 15 App Router**: Using latest patterns and features

## Future Enhancements

Consider adding:
- Email verification
- Password reset functionality
- OAuth providers (Google, GitHub)
- Rate limiting on auth endpoints
- Refresh token mechanism
- Two-factor authentication
- Account lockout after failed attempts
- Session management UI
- Remember me functionality