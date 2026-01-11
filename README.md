# Book Store E-commerce Application

Welcome to the **Book Store E-commerce** project! This is a full-stack web application designed to provide a seamless platform for users to browse, purchase, and manage books. It features a robust backend API and a modern, responsive frontend interface.

## 📖 Project Overview

This project is a comprehensive E-commerce solution specifically tailored for selling books. It serves as a practical demonstration of a modern MERN (MongoDB, Express, React, Node.js) stack application.

The primary goal is to create a secure and user-friendly environment where:
*   **Users** can sign up, verify their emails via OTP, login, browse books, add them to a cart, and manage their profiles.
*   **Admins** can manage users and potentially books (depending on role configuration).
*   **Authors** can potentially contribute content.

This application is built with scalability and security in mind, utilizing industry-standard practices like JWT authentication, password hashing, and secure API structure.

---

## ✨ Features

### 👤 User Features
*   **Secure Authentication**:
    *   Sign Up with Email Verification (OTP sent via Email).
    *   Secure Login with JWT (JSON Web Tokens).
    *   Forgot Password / Resend OTP functionality.
    *   Logout.
*   **Book Browsing**: View a list of available books and detailed book information.
*   **Shopping Cart**: Add books to a shopping cart for purchase.
*   **User Profile**: View and manage personal profile details.

### 🛡️ Admin & Technical Features
*   **Role-Based Access Control (RBAC)**: Distinct roles for Users, Authors, and Admins.
*   **User Management**: Admins can view/delete users and update user details.
*   **Security Mechanisms**:
    *   Password Encryption using `bcrypt`.
    *   Rate limiting and security headers (implemented/planned).
    *   Protected Routes ensuring only authorized access to specific endpoints.
*   **Image Uploads**: dedicated middleware for handling profile picture uploads.

---

## 🛠️ Tech Stack

This project utilizes the **MERN** stack, chosen for its efficiency in building full-stack JavaScript applications.

### **Frontend (Client-Side)**
*   **React.js**: A powerful library for building dynamic user interfaces.
*   **Vite**: Next-generation frontend tooling for fast builds and development.
*   **React Router DOM**: Handles navigation and routing within the single-page application.
*   **Axios**: For making HTTP requests to the backend API.
*   **React Hot Toast**: For beautiful, non-intrusive notifications (flash messages).
*   **React Icons**: Provides a suite of standard icons.
*   **Vanilla CSS**: Custom styling for full design control.

### **Backend (Server-Side)**
*   **Node.js**: JavaScript runtime environment.
*   **Express.js**: Fast and minimalist web framework for Node.js.
*   **MongoDB & Mongoose**: NoSQL database and Object Data Modeling (ODM) library for strict data modeling.
*   **JWT (JSON Web Token)**: For secure, stateless authentication.
*   **Bcrypt**: For hashing and salting passwords.
*   **Nodemailer**: Module for sending emails (used for OTPs).
*   **Multer**: Middleware for handling `multipart/form-data` (file uploads).

---

## 🏗️ Project Architecture

The project is divided into two main directories: `Frontend` and `Backend`.

```plaintext
root/
├── Backend/                 # Server-side logic
│   ├── config/              # Configuration files (DB, Env vars)
│   ├── controllers/         # Logic for handling requests (Auth, Books, Users)
│   ├── middleware/          # Interceptors (Auth checks, Error handling, Uploads)
│   ├── models/              # Database schemas (User, Book)
│   ├── routers/             # API Route definitions
│   ├── utils/               # Helper functions (Email, AppError, OTP Gen)
│   ├── app.js               # Express application setup
│   └── server.js            # Server entry point
│
├── Frontend/                # Client-side UI
│   ├── src/
│   │   ├── components/      # Reusable UI components (Navbar, Cards)
│   │   ├── context/         # Global state management (Auth, Cart)
│   │   ├── pages/           # Main application pages (Home, Login, Signup)
│   │   └── App.jsx          # Main App component and Routing
│   └── package.json         # Frontend dependencies
│
└── .gitignore               # Files to ignore in version control
```

---

## 🔄 Data Flow Explanation

1.  **User Interaction**: A user interacts with the Frontend (e.g., clicks "Sign Up").
2.  **API Request**: The Frontend (using Axios) sends an HTTP Request (POST) to the Backend API endpoint (e.g., `/api/v1/users/signup`).
3.  **Routing & Middleware**:
    *   The request hits `app.js` and is routed to `userRoute.js`.
    *   Middleware checks if data is valid or if the user is authorized (if needed).
4.  **Controller Logic**: The logic in `authController.js` executes.
    *   It may check the database (MongoDB) via the `User` Model.
    *   Example: Checks if the email already exists.
5.  **Database Operation**: Mongoose handles queries to the MongoDB database.
6.  **Response**:
    *   Success: The controller sends back a JSON response (e.g., status 200, JWT token, user data).
    *   Error: The global error handler sends a standardized error message.
7.  **UI Update**: The Frontend receives the response and updates the state (e.g., redirects to OTP page or shows an error toast).

---

## 🔐 Authentication & Authorization Flow

The security of this application relies on **JWT** and **Email Verification**.

1.  **Sign Up**: User enters details -> Backend generates a random OTP (utilizing `crypto` for security) -> Saves hashed password and OTP to DB -> Sends OTP via Email.
2.  **Verify OTP**: User enters OTP -> Backend verifies it against the DB -> Marks user as verified -> Logins user (issues JWT).
3.  **Login**: User enters credentials -> Backend verifies password (bcrypt) -> Issues **JWT Token**.
4.  **Protected Requests**:
    *   The Frontend includes the JWT in the `Authorization` header (`Bearer <token>`).
    *   **Protect Middleware**: Verifies the token. If valid, attaches the user to the request object (`req.user`).
    *   **RestrictTo Middleware**: Checks if `req.user.role` has permission (e.g., 'admin').

---




## 🌍 Environment Variables

Create two configuration files in the `Backend` folder for different environments. This ensures sensitive keys are not hardcoded.
**File:** `Backend/config.development.env` (for local dev)
**File:** `Backend/config.production.env` (for deployment)

**Required Keys:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URL=mongodb://localhost:27017/your_db_name
JWT_SECRET=your_secure_random_secret_string_here
JWT_EXPIRE=90d
JWT_COOKIE_EXPIRES_IN=90
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
```

---
## 🚀 Installation & Setup

Follow these steps to get the project running locally.

### Prerequisites
*   Node.js installed.
*   MongoDB installed and running locally (or use MongoDB Atlas URI).
*   Git installed.

### 1. Clone the Repository
```bash
git clone https://github.com/Naveen-Kumar48/Book-store-.git
cd Book-store-
```

### 2. Backend Setup
```bash
cd Backend
npm install                # Install backend dependencies
# Create your config.development.env file as described above!
```

### 3. Frontend Setup
```bash
cd ../Frontend
npm install                # Install frontend dependencies
```

---

## ▶️ Running the Project

You need to run the Frontend and Backend servers simultaneously (in two separate terminal windows).

### Start Backend
```bash
cd Backend
npm start
# Server should run on http://localhost:5000
```

### Start Frontend
```bash
cd Frontend
npm run dev
# Vite server usually runs on http://localhost:5173
```

Now, open your browser and visit the Frontend URL (e.g., `http://localhost:5173`).

---

## 🔮 Future Improvements

*   **Payment Gateway Integration**: Add Stripe or Razorpay for real payments.
*   **Search & Filtering**: Advanced filtering for books (Genre, Price, Rating).
*   **Reviews & Ratings**: Allow users to review books.
*   **Admin Dashboard**: A visual dashboard for admins to manage inventory and sales.
*   **Deployment**: Deploy Frontend to Vercel/Netlify and Backend to Render/AWS.

---

## 🔚 Conclusion

This **Book Store E-commerce** project demonstrates a solid foundation for a scalable web application. It handles complex flows like authentication, file uploads, and secure data transactions, making it an excellent reference for MERN stack development.

Feel free to explore the code, report issues, or contribute!
