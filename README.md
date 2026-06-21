# SmartHome AI Booking System

**AI-Powered Home Service Booking & Management Platform**

A full-stack MERN application that connects homeowners with verified service professionals through intelligent matching, role-based dashboards, and an AI-assisted booking experience.

---

## Problem Statement

Finding reliable home service professionals remains fragmented and trust-intensive. Customers struggle with unverified workers, opaque pricing, and no unified way to compare providers. Workers lack a structured platform to manage bookings and build reputation. SmartHome addresses this by offering a verified marketplace with AI-driven recommendations, transparent ratings, and dedicated dashboards for customers, workers, and administrators.

---

## Features

### Customer
- Browse and filter services by category and city
- View worker profiles, ratings, and reviews
- Book services with date, time, and address details
- Track booking status (pending, accepted, completed, cancelled)
- Leave reviews after completed jobs
- Personal dashboard for booking history

### Worker
- Professional profile with skills, experience, and hourly rate
- Accept or reject incoming booking requests
- Update availability status
- View earnings and job history
- Receive verified badge after admin approval

### Admin
- Analytics dashboard (users, workers, bookings, revenue)
- User management (activate/deactivate accounts)
- Worker verification workflow
- Booking oversight and status management
- Service category management

### Platform
- JWT-based authentication with role-based access control
- Responsive glassmorphism UI with Bootstrap 5
- RESTful API architecture
- MongoDB data persistence with Mongoose ODM
- Demo seed script for quick local setup

---

## AI Features

### Smart Worker Recommendations
A weighted scoring engine ranks workers based on multiple signals:

```
score = (rating/5 × 35) + (city_match × 25) + (category_match × 20) + (past_booking × 15) + (availability × 5)
```

| Factor        | Weight | Description                          |
|---------------|--------|--------------------------------------|
| Rating        | 35%    | Normalized 0–5 star rating           |
| Location      | 25%    | Exact city match bonus               |
| Category      | 20%    | Service category alignment           |
| History       | 15%    | Previously booked worker preference  |
| Availability  | 5%     | Currently available workers          |

### AI Chat Assistant
An in-app conversational assistant helps users:
- Get service guidance (plumbing, electrical, cleaning, etc.)
- Understand pricing and booking flow
- Receive category suggestions based on natural language queries

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 19, React Router v7, Bootstrap 5          |
| Backend    | Node.js, Express 5                              |
| Database   | MongoDB, Mongoose                               |
| Auth       | JWT, bcryptjs                                   |
| HTTP       | Axios, CORS                                     |
| UI/UX      | Glassmorphism, CSS animations, react-icons      |
| Alerts     | react-hot-toast                                 |

---

## Installation Steps

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** (local instance or MongoDB Atlas)
- **npm**

### 1. Clone the repository

```bash
git clone https://github.com/harireddy2428/SmartHome-AI-Booking-System.git
cd SmartHome-AI-Booking-System
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smarthome
JWT_SECRET=your_super_secret_key_change_in_production
ADMIN_SECRET_KEY=your_admin_secret_key_change_in_production
NODE_ENV=development
```

Seed the database and start the server:

```bash
npm run seed    # Optional: loads demo users, workers, and services
npm run dev     # Runs on http://localhost:5000
```

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm start       # Runs on http://localhost:3000
```

### 4. Demo accounts (after seeding)

| Role     | Email                 | Password     |
|----------|-----------------------|--------------|
| Admin    | admin@smarthome.com   | admin123     |
| Customer | customer@test.com     | customer123  |
| Worker   | rajesh@worker.com     | worker123    |

> **Note:** Demo passwords are for local development only. Change all secrets before deploying to production.

---

## Project Structure

```
SmartHome-AI-Booking-System/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route handlers & business logic
│   ├── middleware/      # JWT authentication
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express API routes
│   ├── utils/           # Token generation, seed script
│   ├── .env.example     # Environment variable template
│   └── server.js        # Entry point
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── context/     # Auth context provider
│       ├── pages/       # Route-level page components
│       └── utils/       # API client (Axios)
├── .gitignore
├── LICENSE
└── README.md
```

---

## API Endpoints

| Method | Endpoint                    | Access   | Description              |
|--------|-----------------------------|----------|--------------------------|
| POST   | `/api/auth/register`        | Public   | Register new user        |
| POST   | `/api/auth/login`           | Public   | Login                    |
| GET    | `/api/workers`              | Public   | List workers             |
| POST   | `/api/bookings`             | Customer | Create booking           |
| GET    | `/api/ai/recommend`         | Private  | AI worker recommendations|
| POST   | `/api/ai/chat`              | Private  | AI chat assistant        |
| GET    | `/api/admin/dashboard`      | Admin    | Dashboard analytics      |
| GET    | `/api/health`               | Public   | Health check             |

---

## Screenshots

> Add screenshots of your application here after deployment or local capture.

| Landing Page | Customer Dashboard | AI Recommendations |
|:------------:|:------------------:|:------------------:|
| _Screenshot_ | _Screenshot_       | _Screenshot_       |

| Worker Dashboard | Admin Panel | AI Chat Widget |
|:----------------:|:-----------:|:--------------:|
| _Screenshot_     | _Screenshot_| _Screenshot_   |

---

## Team Information

| Name           | Role                  |
|----------------|-----------------------|
| Karri Naga Hari Kiran Reddy   | Full Stack Developer  |
**Repository:** [harireddy2428/SmartHome-AI-Booking-System](https://github.com/harireddy2428/SmartHome-AI-Booking-System)

---

## Future Scope

1. **Real-time Chat** — Socket.io for live customer ↔ worker messaging
2. **Payment Gateway** — Razorpay / Stripe integration for secure payments
3. **GPS Tracking** — Live worker location via Google Maps API
4. **ML Model Upgrade** — TensorFlow.js or cloud ML for smarter recommendations
5. **Mobile App** — React Native cross-platform client
6. **Video Consultations** — WebRTC for remote service diagnosis
7. **Subscription Plans** — Monthly plans for frequent customers
8. **Multi-language Support** — i18n for regional languages across India

---

## License

This project is licensed under the [MIT License](LICENSE).

---

Built with care for Hackathon 2024 — SmartHome AI Booking System
