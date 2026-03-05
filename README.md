# 📚 Book Store E-Commerce Platform

<div align="center">

![Book Store Banner](https://img.shields.io/badge/Book_Store-E--Commerce-blue?style=for-the-badge)

**A Modern Full-Stack E-Commerce Solution for Book Retailers**

[![React](https://img.shields.io/badge/React-19.2.0-61dafb?style=flat-square&logo=react)]()
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)]()
[![Stripe](https://img.shields.io/badge/Payments-Stripe-635bff?style=flat-square&logo=stripe)]()

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Documentation](#-api-endpoints) • [Security](#-security-features)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-project-architecture)
- [Payment Integration](#-payment-integration)
- [Installation & Setup](#-installation--setup)
- [Environment Configuration](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Security Features](#-security-features)
- [Testing](#-testing)
- [Deployment](#-deployment-guide)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Book Store E-Commerce** is a production-ready, full-stack web application designed to provide a comprehensive platform for online book retail. Built with the MERN stack (MongoDB, Express.js, React, Node.js), this solution demonstrates enterprise-level architecture with secure payment processing, real-time order management, and scalable design patterns.

### Key Capabilities

✅ **Complete E-Commerce Workflow** - Browse → Cart → Checkout → Payment → Order Tracking  
✅ **Secure Payment Processing** - Stripe integration with PCI compliance  
✅ **Email Verification System** - OTP-based user verification  
✅ **Role-Based Access Control** - User, Author, and Admin roles  
✅ **Real-Time Order Management** - Automated status updates and tracking  
✅ **Invoice Generation** - Automated email invoices post-purchase  
✅ **Inventory Management** - Automatic stock deduction after purchase  

---

## ✨ Features

### 🛒 **Customer Experience**

#### **Authentication & Account Management**
- 🔐 **Secure Registration** with email OTP verification
- 🔑 **JWT-based Authentication** with secure token management
- 🔁 **Password Recovery** with reset token via email
- 👤 **Profile Management** with avatar upload capability
- 📧 **Email Notifications** for order confirmations and invoices

#### **Shopping Experience**
- 📖 **Advanced Book Discovery**
  - Genre-based categorization (Fantasy, Sci-Fi, Mystery, Romance, etc.)
  - Search functionality with title and author filtering
  - Detailed book information with cover images
- 🛍️ **Smart Shopping Cart**
  - Real-time cart management with quantity controls
  - Persistent cart storage across sessions
  - Dynamic price calculation with totals
- 💳 **Secure Checkout** with Stripe payment gateway
- 📦 **Order Tracking** with status progression (Pending → Placed → Delivered)

### 🛡️ **Admin & Technical Features**

#### **User Management**
- 👥 **User Administration** - View, update, and delete user accounts
- 🎭 **Role-Based Permissions** - Granular access control system
- 📊 **User Activity Monitoring** - Track orders and purchase history

#### **Product & Inventory**
- 📚 **Book Catalog Management** - CRUD operations for book inventory
- 🏷️ **Stock Management** - Automatic inventory deduction on purchase
- 🖼️ **Image Upload System** - Secure file upload with Multer middleware

#### **Order Processing**
- 📋 **Order Dashboard** - Comprehensive order tracking system
- ⚡ **Automated Workflows** - Status updates with scheduled tasks
- 📧 **Invoice Automation** - Email invoice delivery post-payment
- 💰 **Payment Verification** - Server-side Stripe session validation

---

## 🛠️ Tech Stack

### **Frontend Architecture**

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI component library |
| **Vite** | 7.2.4 | Build tool & dev server |
| **React Router DOM** | 7.12.0 | Client-side routing |
| **Axios** | 1.13.2 | HTTP client for API calls |
| **React Hot Toast** | 2.6.0 | Toast notification system |
| **React Icons** | 5.5.0 | Icon library |

**Styling:** Vanilla CSS with modern flexbox/grid layouts, CSS variables for theming

### **Backend Infrastructure**

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication tokens |
| **Bcrypt** | Password hashing |
| **Stripe** | Payment processing |
| **Nodemailer** | Email service |
| **Multer** | File upload middleware |
| **Dotenv** | Environment variable management |
| **Cross-env** | Cross-platform env variables |
| **Morgan** | HTTP request logger |

---


#### **Key Features**

✅ **PCI Compliance** - Payments processed on Stripe's secure servers  
✅ **Server-Side Validation** - Payment status verified before order confirmation  
✅ **Automatic Stock Deduction** - Inventory reduced upon successful payment  
✅ **Email Invoicing** - Automated invoice delivery with order details  
✅ **Order Status Automation** - Scheduled status progression system  
✅ **Test Mode Support** - Full testing capability with Stripe test cards  

Before installation, ensure you have:

- ✅ **Node.js** v18+ installed ([Download](https://nodejs.org/))
- ✅ **MongoDB** running locally or MongoDB Atlas URI
- ✅ **Git** for version control
- ✅ **Stripe Account** for payment processing ([Get Test Keys](https://dashboard.stripe.com/test/apikeys))

### **1. Clone Repository**

```bash
git clone https://github.com/Naveen-Kumar48/Book-store-.git
cd Book-store-
```

### **2. Backend Setup**

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create environment configuration
# Copy config.development.env.example to config.development.env
# Edit with your credentials (see Environment Variables section)
```

### **3. Frontend Setup**

```bash
# Navigate to frontend directory (from project root)
cd ../Frontend

# Install dependencies
npm install
```

---

## ▶️ Running the Application

### **Development Mode**

Run both servers simultaneously in separate terminals:

**Terminal 1 - Backend Server:**
```bash
cd Backend
npm start
```
✅ Server runs on: `http://localhost:5000`

**Terminal 2 - Frontend Dev Server:**
```bash
cd Frontend
npm run dev
```
✅ Application runs on: `http://localhost:5173`

### **Production Mode**

```bash
# Backend production build
cd Backend
npm run start:prod

# Frontend production build
cd Frontend
npm run build
npm run preview
```

---

🔐 **Multi-Layer Security Architecture:**

1. **Password Protection**
   - Bcrypt hashing with salt rounds
   - Passwords never stored in plain text
   - Minimum strength requirements

2. **JWT Token Security**
   - Signed tokens with secret key
   - Expiration time enforcement
   - Token stored in secure HTTP-only cookies (planned)

3. **Email Verification**
   - Cryptographically secure OTP generation
   - Time-limited verification codes
   - One-time use enforcement

4. **Rate Limiting** (Planned)
   - Prevent brute force attacks
   - Limit API requests per IP

5. **Input Validation**
   - Request body sanitization
   - Type checking with Mongoose schemas
   - SQL injection prevention

### **Data Protection**

🛡️ **Privacy Measures:**

- Email masking utilities for display
- Sensitive data encryption at rest
- CORS policy configuration
- Helmet.js security headers (planned)

### **Payment Security**

💳 **Stripe Compliance:**

- PCI DSS compliant payment processing
- Server-side payment verification
- Secure webhook signatures (planned)
- No sensitive card data stored locally

---


---

## 📦 Deployment Guide

### **Frontend Deployment (Vercel)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd Frontend
vercel

# Follow prompts to complete deployment
```

### **Backend Deployment (Render/Railway)**

1. **Create New Web Service** on Render/Railway
2. **Connect GitHub Repository**
3. **Set Build Command:** `npm install`
4. **Set Start Command:** `npm start`
5. **Add Environment Variables** from production config
6. **Deploy**




---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit changes:**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open Pull Request**

### **Contribution Guidelines**

- Follow existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed
- Be respectful in discussions

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🙏 Acknowledgments

- **Stripe** for secure payment processing
- **MongoDB** for database solutions
- **React Team** for the amazing UI library
- **All Contributors** who helped shape this project

---

## 📞 Support & Contact

### **Getting Help**

- 📖 **Documentation:** This README and `QUICK_START.md`
- 🐛 **Bug Reports:** Open an issue on GitHub
- 💡 **Feature Requests:** Submit via GitHub Issues
- 📧 **Email:** Use project contact (if applicable)


---

## 🎯 Future Roadmap

### **Phase 1: Enhanced Features** (Q2 2026)
- [ ] Advanced search with filters (price, rating, availability)
- [ ] Book review and rating system
- [ ] Wishlist functionality
- [ ] Book recommendation engine

### **Phase 2: Admin Dashboard** (Q3 2026)
- [ ] Sales analytics dashboard
- [ ] Inventory management UI
- [ ] User activity reports
- [ ] Revenue tracking

### **Phase 3: Mobile Experience** (Q4 2026)
- [ ] Responsive mobile app (React Native)
- [ ] Push notifications
- [ ] Offline reading mode
- [ ] QR code scanning for books

### **Phase 4: Advanced Features** (2027)
- [ ] AI-powered recommendations
- [ ] Social sharing integration
- [ ] Gift card system
- [ ] Subscription boxes
- [ ] Multi-language support

---

<div align="center">

**Made with ❤️ by the Book Store Team**

[Report Bug](https://github.com/Naveen-Kumar48/Book-store-/issues) • [Request Feature](https://github.com/Naveen-Kumar48/Book-store-/issues) • [View Demo](#)

</div>


