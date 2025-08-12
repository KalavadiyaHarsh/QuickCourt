# 🏟️ QuickCourt - Sports Venue Booking Platform

A comprehensive sports venue booking platform that connects sports enthusiasts with facility owners, featuring real-time availability, secure bookings, and comprehensive management tools.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Authentication & Authorization](#authentication--authorization)
- [Usage Examples](#usage-examples)
- [Contributing](#contributing)

## 🎯 Overview

QuickCourt is a full-stack sports venue booking platform that enables users to:
- Browse and search sports venues by location, sport type, and availability
- Book courts with real-time availability checking
- Manage bookings and payments
- Rate and review venues
- Facility owners can manage their venues and courts
- Admins can oversee the entire platform

## ✨ Features

### 🏠 User Features
- **User Registration & Authentication**: Secure signup with email verification
- **Venue Discovery**: Search venues by sport, location, price, and availability
- **Smart Booking System**: Real-time court availability with time slot selection
- **Booking Management**: View, cancel, and track booking history
- **Reviews & Ratings**: Rate venues and leave detailed reviews
- **Profile Management**: Update personal information and preferences

### 🏢 Facility Owner Features
- **Venue Management**: Create, update, and manage venue information
- **Court Management**: Add multiple courts with pricing and availability
- **Photo Upload**: Upload up to 10 venue photos (5MB limit per image)
- **Booking Overview**: View all bookings for their venues
- **Dashboard**: Analytics and insights about venue performance

### 👨‍💼 Admin Features
- **User Management**: Approve, suspend, and manage user accounts
- **Venue Approval**: Review and approve/reject venue submissions
- **Platform Analytics**: Comprehensive dashboard with booking trends
- **System Monitoring**: Track platform health and performance

### 🔍 Search & Discovery
- **Advanced Search**: Filter by sport, location, price range, and availability
- **Location-based**: Find venues near you with city and state filtering
- **Sport-specific**: Dedicated sections for different sports
- **Popular Venues**: Discover trending and highly-rated venues

## 🛠️ Tech Stack

### Frontend (Client)
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI** - React component library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Recharts** - Data visualization charts
- **Framer Motion** - Animation library
- **React Hot Toast** - Notification system

### Backend (Server)
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email service
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
QuickCourt/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
├── server/                 # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── route/            # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── home.routes.js
│   │   ├── admin.routes.js
│   │   ├── facilityOwner.routes.js
│   │   ├── facility.routes.js
│   │   └── court.routes.js
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   └── uploads/          # File uploads
│       ├── facilities/   # Facility photos
│       └── courts/       # Court photos
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup
```bash
cd server
npm install
cp .env.example .env  # Create environment file
# Configure your .env file with:
# MONGODB_URL=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# JWT_EXPIRE=30d
# EMAIL_USER=your_email
# EMAIL_PASS=your_email_password
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Authentication Endpoints

#### 🔐 User Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email with the OTP sent to your inbox",
  "data": {
    "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "email": "john@example.com",
    "isVerified": false
  }
}
```

#### 📧 Email Verification
```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isVerified": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 🔑 User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### User Endpoints

#### 👤 Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "fullName": "John Doe",
    "email": "john@example.com",
    "avatar": "default.jpg",
    "role": "user",
    "isVerified": true,
    "status": "active",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 🏟️ Get Venues
```http
GET /api/users/venues?search=tennis&sport=tennis&city=New York&minPrice=20&maxPrice=100
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "venues": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "name": "Central Tennis Club",
        "description": "Premium tennis facility in downtown",
        "address": {
          "street": "123 Main St",
          "city": "New York",
          "state": "NY",
          "zip": "10001"
        },
        "photos": ["photo1.jpg", "photo2.jpg"],
        "sportsAvailable": ["tennis"],
        "amenities": ["parking", "shower", "equipment"],
        "rating": 4.5,
        "status": "approved"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25
    }
  }
}
```

#### 📅 Get Court Availability
```http
GET /api/users/courts/64f8a1b2c3d4e5f6a7b8c9d0/availability?date=2024-01-20
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "courtId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "date": "2024-01-20",
    "availableSlots": [
      {
        "startTime": "09:00",
        "endTime": "10:00",
        "price": 25
      },
      {
        "startTime": "10:00",
        "endTime": "11:00",
        "price": 25
      }
    ],
    "bookedSlots": [
      {
        "startTime": "14:00",
        "endTime": "16:00",
        "bookingId": "64f8a1b2c3d4e5f6a7b8c9d0"
      }
    ]
  }
}
```

#### 🎯 Create Booking
```http
POST /api/users/bookings
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "courtId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "venueId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "date": "2024-01-20",
  "timeSlots": [
    {
      "startTime": "09:00",
      "endTime": "11:00"
    }
  ],
  "totalAmount": 50,
  "paymentMethod": "card"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "user": "64f8a1b2c3d4e5f6a7b8c9d0",
      "court": "64f8a1b2c3d4e5f6a7b8c9d0",
      "venue": "64f8a1b2c3d4e5f6a7b8c9d0",
      "date": "2024-01-20T00:00:00.000Z",
      "timeSlots": [
        {
          "startTime": "09:00",
          "endTime": "11:00"
        }
      ],
      "totalAmount": 50,
      "paymentStatus": "pending",
      "bookingStatus": "confirmed",
      "paymentMethod": "card",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Facility Owner Endpoints

#### 🏢 Create Venue
```http
POST /api/facility-owner/venues
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

{
  "name": "Elite Sports Complex",
  "description": "Multi-sport facility with premium amenities",
  "address[street]": "456 Sports Ave",
  "address[city]": "Los Angeles",
  "address[state]": "CA",
  "address[zip]": "90210",
  "sportsAvailable": ["badminton", "tennis", "basketball"],
  "amenities": ["parking", "shower", "equipment", "cafe"],
  "photos": [file1, file2, file3]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Venue created successfully",
  "data": {
    "venue": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Elite Sports Complex",
      "description": "Multi-sport facility with premium amenities",
      "address": {
        "street": "456 Sports Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zip": "90210"
      },
      "photos": ["photos-1234567890-1.jpg", "photos-1234567890-2.jpg"],
      "sportsAvailable": ["badminton", "tennis", "basketball"],
      "amenities": ["parking", "shower", "equipment", "cafe"],
      "owner": "64f8a1b2c3d4e5f6a7b8c9d0",
      "status": "pending",
      "rating": 0,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

#### 🏀 Create Court
```http
POST /api/facility-owner/courts
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Court 1",
  "sport": "badminton",
  "venueId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "pricePerHour": 30,
  "capacity": 4,
  "operatingHours": {
    "weekdays": {
      "open": "06:00",
      "close": "22:00"
    },
    "weekends": {
      "open": "08:00",
      "close": "20:00"
    }
  }
}
```

### Admin Endpoints

#### 📊 Get Admin Dashboard
```http
GET /admin/dashboard
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 1250,
      "totalVenues": 89,
      "totalBookings": 3420,
      "totalCourts": 156,
      "totalFacilities": 45,
      "totalRevenue": 45600,
      "monthlyRevenue": 8900
    },
    "userStats": [...],
    "venueStats": [...],
    "facilityStats": [...],
    "recentUsers": [...],
    "pendingVenues": [...],
    "pendingFacilities": [...],
    "recentBookings": [...]
  }
}
```

#### 👥 Get All Users
```http
GET /admin/users?page=1&limit=10&status=active
Authorization: Bearer <access_token>
```

#### 🏟️ Update Venue Status
```http
PUT /admin/venues/64f8a1b2c3d4e5f6a7b8c9d0/status
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "approved",
  "rejectionReason": ""
}
```

#### 🏢 Get All Facilities
```http
GET /admin/facilities?page=1&limit=10&status=pending
Authorization: Bearer <access_token>
```

#### 🏢 Get Pending Facilities
```http
GET /admin/facilities/pending
Authorization: Bearer <access_token>
```

#### 🏢 Update Facility Status
```http
PUT /admin/facilities/64f8a1b2c3d4e5f6a7b8c9d0/status
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "approved",
  "rejectionReason": ""
}
```

#### 🏢 Delete Facility
```http
DELETE /admin/facilities/64f8a1b2c3d4e5f6a7b8c9d0
Authorization: Bearer <access_token>
```

### Facility Management Endpoints

#### 🏢 Create Facility
```http
POST /api/facilities
Content-Type: multipart/form-data

{
  "name": "Elite Sports Complex",
  "location": "123 Sports Ave, New York",
  "description": "Premium multi-sport facility",
  "sports": "badminton,tennis,basketball",
  "username": "john_doe",
  "court": "Multiple courts available",
  "time": "6 AM - 10 PM",
  "amenities": "parking,shower,equipment",
  "photos": [file1, file2, file3]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Facility submitted for approval.",
  "facility": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Elite Sports Complex",
    "location": "123 Sports Ave, New York",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 🏢 Get All Facilities
```http
GET /api/facilities?status=pending&page=1&limit=10
```

#### 🏢 Get Facility by ID
```http
GET /api/facilities/64f8a1b2c3d4e5f6a7b8c9d0
```

#### 🏢 Update Facility Status
```http
PATCH /api/facilities/64f8a1b2c3d4e5f6a7b8c9d0
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "approved"
}
```

### Court Management Endpoints

#### 🏀 Create Court
```http
POST /api/courts
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

{
  "name": "Court 1",
  "sport": "badminton",
  "venueId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "facilityId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "pricePerHour": 30,
  "capacity": 4,
  "description": "Professional badminton court",
  "amenities": "lighting,net,equipment",
  "operatingHours": "{\"weekdays\":{\"open\":\"06:00\",\"close\":\"22:00\"},\"weekends\":{\"open\":\"08:00\",\"close\":\"20:00\"}}",
  "photos": [file1, file2]
}
```

#### 🏀 Get All Courts
```http
GET /api/courts?sport=badminton&venue=64f8a1b2c3d4e5f6a7b8c9d0&minPrice=20&maxPrice=100
```

#### 🏀 Get Court by ID
```http
GET /api/courts/64f8a1b2c3d4e5f6a7b8c9d0
```

#### 🏀 Get Court Availability
```http
GET /api/courts/64f8a1b2c3d4e5f6a7b8c9d0/availability?date=2024-01-20
```

#### 🏀 Update Court
```http
PUT /api/courts/64f8a1b2c3d4e5f6a7b8c9d0
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

{
  "name": "Court 1 Updated",
  "pricePerHour": 35,
  "status": "active"
}
```

### Public Endpoints

#### 🏠 Get Home Data
```http
GET /api/home
```

**Response:**
```json
{
  "success": true,
  "data": {
    "featuredVenues": [...],
    "popularSports": [...],
    "availableCities": [...],
    "stats": {
      "totalVenues": 89,
      "totalUsers": 1250,
      "totalBookings": 3420
    }
  }
}
```

#### 🔍 Search Venues
```http
GET /api/home/search?q=tennis&city=New York&sport=tennis
```

## 🗄️ Database Models

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  fullName: String (required),
  avatar: String (default: 'default.jpg'),
  role: String (enum: ['user', 'facility_owner', 'admin']),
  isVerified: Boolean (default: false),
  otp: String (6-digit),
  otpExpire: Date,
  refresh_token: String,
  status: String (enum: ['active', 'suspended']),
  createdAt: Date
}
```

### Venue Model
```javascript
{
  name: String (required, max: 50 chars),
  description: String (max: 500 chars),
  address: {
    street: String,
    city: String (required),
    state: String (required),
    zip: String,
    coordinates: [Number] (longitude, latitude)
  },
  photos: [String],
  sportsAvailable: [String] (enum: sports),
  amenities: [String],
  owner: ObjectId (ref: User),
  status: String (enum: ['pending', 'approved', 'rejected']),
  rating: Number (1-5),
  createdAt: Date
}
```

### Court Model
```javascript
{
  name: String (required),
  sport: String (required, enum: sports),
  venue: ObjectId (ref: Venue),
  facility: ObjectId (ref: Facility),
  pricePerHour: Number (required, min: 0),
  capacity: Number (default: 2),
  operatingHours: {
    weekdays: { open: String, close: String },
    weekends: { open: String, close: String }
  },
  unavailableSlots: [{
    date: Date,
    startTime: String,
    endTime: String,
    reason: String
  }],
  status: String (enum: ['active', 'maintenance', 'inactive']),
  description: String,
  amenities: [String],
  photos: [String],
  createdAt: Date
}
```

### Booking Model
```javascript
{
  user: ObjectId (ref: User),
  court: ObjectId (ref: Court),
  venue: ObjectId (ref: Venue),
  date: Date (required),
  timeSlots: [{
    startTime: String,
    endTime: String
  }],
  totalAmount: Number (required),
  paymentStatus: String (enum: ['pending', 'paid', 'failed', 'refunded']),
  bookingStatus: String (enum: ['confirmed', 'cancelled', 'completed']),
  paymentMethod: String (enum: ['card', 'wallet', 'cash']),
  transactionId: String,
  createdAt: Date
}
```

### Facility Model
```javascript
{
  name: String (required, max: 50 chars),
  location: String (required),
  description: String (max: 500 chars),
  sports: [String] (enum: sports),
  username: String (required),
  court: String (required),
  time: String (required),
  status: String (enum: ['pending', 'approved', 'rejected']),
  amenities: [String],
  photos: [String],
  owner: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication & Authorization

### JWT Token System
- **Access Token**: Short-lived (30 days) for API access
- **Refresh Token**: Long-lived for token renewal
- **Role-based Access Control**: User, Facility Owner, Admin

### Protected Routes
- User routes require valid JWT token
- Admin routes require admin role
- Facility owner routes require facility_owner role

### Middleware
- `protect`: Verifies JWT token
- `authorize`: Checks user role permissions

## 💡 Usage Examples

### Frontend API Integration
```javascript
import axios from 'axios';

// Set base URL and default headers
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Example: Get user profile
const getProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Example: Create booking
const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/users/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};
```

### Backend Controller Example
```javascript
// Example: Get venues with search and filters
exports.getVenues = async (req, res) => {
  try {
    const { search, sport, city, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = { status: 'approved' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (sport) {
      query.sportsAvailable = sport;
    }
    
    if (city) {
      query['address.city'] = { $regex: city, $options: 'i' };
    }
    
    // Execute query with pagination
    const venues = await Venue.find(query)
      .populate('owner', 'fullName email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Venue.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: {
        venues,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching venues',
      error: error.message
    });
  }
};
```

## 🚀 Deployment

### Environment Variables
```bash
# Server (.env)
MONGODB_URL=mongodb://localhost:27017/quickcourt
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
PORT=8000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Client (.env)
VITE_API_URL=http://localhost:8000/api
```

### Production Build
```bash
# Backend
cd server
npm run build
npm start

# Frontend
cd client
npm run build
# Serve the dist folder with your preferred server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**QuickCourt** - Making sports accessible, one booking at a time! 🏆
