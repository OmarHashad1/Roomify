# Roomify

A full-stack hotel booking platform that connects travelers with hotels. Customers can search and book rooms, hotel managers can list and manage their properties, and admins oversee the entire platform.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Roles & Permissions](#roles--permissions)
- [Screenshots](#screenshots)

---

## Features

### For Customers
- Search hotels by location, check-in/check-out dates, and guest count
- Multi-step booking flow with guest details and payment
- View and manage bookings (upcoming, past, cancelled)
- Leave reviews for completed stays
- Update profile and change password securely

### For Hotel Managers
- Apply to list a hotel with document verification
- Manage hotel profile, photos, and amenities
- Create and update room types with photos and pricing
- Set room availability by date
- Track bookings and manage check-in/check-out status
- View guest reviews and revenue analytics

### For Admins
- Review and approve/reject hotel manager applications
- Manage all users (suspend accounts, force logout)
- Monitor hotels, bookings, payments, and reviews
- Moderate reviews (publish/hide)
- View system-wide activity logs

---

## Tech Stack

**Frontend**
- React 19, React Router v7
- Tailwind CSS v4, Shadcn UI, Radix UI
- GSAP (animations)
- Formik + Yup (form validation)
- Recharts (analytics charts)
- Axios

**Backend**
- Node.js, Express 5
- MongoDB, Mongoose
- JWT (access + refresh tokens with revocation)
- Argon2 (password hashing)
- Multer (file uploads)
- Nodemailer (email notifications)
- Winston (logging)
- Joi (request validation)

---

## Project Structure

```
Roomify/
├── backend/
│   ├── server.js
│   └── src/
│       ├── main.js
│       ├── models/
│       │   ├── user.model.js
│       │   ├── hotel.model.js
│       │   ├── room-type.model.js
│       │   ├── room-availability.model.js
│       │   ├── booking.model.js
│       │   ├── payment.model.js
│       │   ├── review.model.js
│       │   ├── hotel-application.model.js
│       │   ├── payment-payout.model.js
│       │   ├── revoked-token.model.js
│       │   └── log.model.js
│       └── modules/
│           ├── auth/
│           ├── users/
│           ├── hotels/
│           ├── bookings/
│           ├── payments/
│           ├── payouts/
│           ├── reviews/
│           ├── hotel-applications/
│           └── admins/
└── frontend/
    └── src/
        ├── App.jsx
        ├── routes/
        │   └── AppRoutes.jsx
        ├── pages/
        │   ├── public/
        │   ├── user/
        │   ├── manager/
        │   └── admin/
        └── components/
            ├── common/
            ├── public/
            ├── manager/
            └── admin/
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB instance)
- Gmail account (for SMTP email notifications)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (see [Environment Variables](#environment-variables)), then start the server:

```bash
npm run start:build
```

The API will be available at `http://localhost:3000`.

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Then start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=3000
BASE_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173

# MongoDB
URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/roomify

# JWT Secrets (use strong random strings)
AUTH_SIGNATURE=Bearer

CUSTOMER_ACCESS_TOKEN_SIGNATURE=your_customer_access_secret
CUSTOMER_REFRESH_TOKEN_SIGNATURE=your_customer_refresh_secret

ADMIN_ACCESS_TOKEN_SIGNATURE=your_admin_access_secret
ADMIN_REFRESH_TOKEN_SIGNATURE=your_admin_refresh_secret

MANAGER_ACCESS_TOKEN_SIGNATURE=your_manager_access_secret
MANAGER_REFRESH_TOKEN_SIGNATURE=your_manager_refresh_secret

# SMTP (Gmail)
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password
```

---

## API Reference

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Login and receive tokens |
| POST | `/auth/logout` | Logout and revoke tokens |
| GET | `/auth/access-token` | Refresh access token |

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/profile` | Customer | Get own profile |
| PATCH | `/users/profile` | Customer | Update profile |
| PATCH | `/users/profile/password` | Customer | Change password |
| GET | `/admin/users` | Admin | List all users |
| GET | `/admin/users/:userId` | Admin | Get user details |
| PATCH | `/admin/users/:userId/status` | Admin | Suspend/activate user |
| PATCH | `/admin/users/:userId/force-logout` | Admin | Force logout user |

### Hotels

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/hotels` | Public | List all hotels |
| GET | `/hotels/search/rooms` | Public | Search available rooms |
| GET | `/hotels/mine` | Manager | Get own hotels |
| GET | `/hotels/:id` | Manager | Get hotel details |
| PATCH | `/hotels/:id` | Manager | Update hotel info & photos |
| GET | `/hotels/:hotelId/bookings` | Manager | Get hotel bookings |
| GET | `/hotels/admin` | Admin | List all hotels |
| PATCH | `/hotels/admin/:id/status` | Admin | Update hotel status |

### Room Types

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/hotels/room-types/hotel/:hotelId` | Public | Get hotel room types |
| GET | `/hotels/room-types/:id` | Public | Get room type details |
| POST | `/hotels/room-types/manager` | Manager | Create room type |
| PATCH | `/hotels/room-types/manager/:id` | Manager | Update room type |
| PATCH | `/hotels/room-types/manager/:id/status` | Manager | Toggle room status |

### Room Availability

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/hotels/room-types/availability/manager` | Manager | Set availability |
| PATCH | `/hotels/room-types/availability/manager/:date` | Manager | Update availability for date |

### Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/bookings/me` | Customer | Get own bookings |
| POST | `/bookings/create-booking` | Customer | Create a booking |
| GET | `/bookings/:bookingId` | Any | Get booking details |
| PATCH | `/bookings/:id` | Manager | Update booking dates |
| PATCH | `/bookings/:id/status` | Manager | Update booking status |
| GET | `/admin/bookings` | Admin | List all bookings |

### Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payments/:bookingId/pay` | Customer | Process payment |
| GET | `/payments/:bookingId` | Any | Get payment details |
| GET | `/payments/admin` | Admin | List all payments |
| GET | `/payments/admin/:id` | Admin | Get payment details |

### Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/reviews/hotel/:id` | Any | Get hotel reviews |
| GET | `/reviews/me` | Customer | Get own reviews |
| POST | `/reviews` | Customer | Submit a review |
| DELETE | `/reviews/me/:reviewId` | Customer | Delete own review |
| GET | `/admin/reviews` | Admin | List all reviews |
| PATCH | `/admin/reviews/:reviewId/status` | Admin | Publish/hide review |

### Hotel Applications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/hotel-applications` | Customer | Submit manager application |
| GET | `/hotel-applications/admin` | Admin | List all applications |
| GET | `/hotel-applications/admin/:id` | Admin | Get application details |
| PATCH | `/hotel-applications/admin/:id` | Admin | Approve/reject application |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/logs` | Admin | View system activity logs |

---

## Roles & Permissions

| Feature | Customer | Manager | Admin |
|---------|----------|---------|-------|
| Browse hotels & rooms | Yes | Yes | Yes |
| Book rooms | Yes | — | — |
| Write reviews | Yes | — | — |
| Manage own hotel | — | Yes | — |
| Manage room types | — | Yes | — |
| Set room availability | — | Yes | — |
| View hotel bookings | — | Yes | — |
| Apply to list a hotel | Yes | — | — |
| Approve applications | — | — | Yes |
| Manage all users | — | — | Yes |
| Manage all hotels | — | — | Yes |
| Moderate reviews | — | — | Yes |
| View system logs | — | — | Yes |

---

## Booking Status Flow

```
pending_payment → confirmed → checked_in → completed
                                         ↘ cancelled
```

