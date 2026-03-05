# 🔄 Stripe Payment Flow Diagram

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    BOOK STORE ECOMMERCE                         │
│                  Payment Integration Flow                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   USER       │
│  Browsing    │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│ 1. HOME PAGE (Home.jsx)                                      │
│    - Browse books by genre                                   │
│    - Search functionality                                    │
│    - Add to cart button                                      │
└──────┬───────────────────────────────────────────────────────┘
       │
       │ Click "Add to Cart"
       ▼
┌──────────────────────────────────────────────────────────────┐
│ 2. CART CONTEXT (CartContext.jsx)                            │
│    - Stores cart items in localStorage                       │
│    - Updates cart count in navbar                            │
│    - Calculates total price                                  │
└──────┬───────────────────────────────────────────────────────┘
       │
       │ Navigate to Cart
       ▼
┌──────────────────────────────────────────────────────────────┐
│ 3. CART PAGE (Cart.jsx)                                      │
│    - View all cart items                                     │
│    - Adjust quantities                                       │
│    - Remove items                                            │
│    - See order summary                                       │
│    - [CHECKOUT BUTTON] ← Click here                          │
└──────┬───────────────────────────────────────────────────────┘
       │
       │ POST /api/v1/orders/checkout-session
       │ Headers: Authorization: Bearer <token>
       │ Body: { items: [{ bookId, quantity }] }
       ▼
┌──────────────────────────────────────────────────────────────┐
│ 4. BACKEND - Create Stripe Session                           │
│    (orderController.js - getCheckoutSession)                 │
│                                                              │
│    ✓ Validate user authentication                            │
│    ✓ Check cart items exist                                  │
│    ✓ Fetch book details from DB                              │
│    ✓ Calculate total amount                                  │
│    ✓ Create order in DB (status: pending)                    │
│    ✓ Call Stripe API: checkout.sessions.create()             │
│    ✓ Return session URL                                      │
└──────┬───────────────────────────────────────────────────────┘
       │
       │ Response: { session: { url: "https://checkout.stripe.com/..." } }
       ▼
┌──────────────────────────────────────────────────────────────┐
│ 5. STRIPE CHECKOUT PAGE (Hosted by Stripe)                   │
│    https://checkout.stripe.com/cpay/...                      │
│                                                              │
│    🔒 SECURE PAYMENT FORM                                    │
│    - Card number input                                       │
│    - Expiry date                                             │
│    - CVC                                                     │
│    - Billing information                                     │
│    - Pay button                                              │
│                                                              │
│    Test Card: 4242 4242 4242 4242                            │
└──────┬───────────────────────────────────────────────────────┘
       │
       │ Payment Processed
       ├──────────────────┐
       │                  │
       ▼                  ▼
   SUCCESS           CANCELLED
       │                  │
       │                  │ Redirect to cancel URL
       ▼                  ▼
┌─────────────────┐  ┌────────────────────────┐
│ Payment Success │  │ Payment Cancelled      │
│ - Charge card   │  │ - No charge made       │
│ - Create order  │  │ - Return to cart       │
└───────┬─────────┘  └──────────┬─────────────┘
        │                       │
        │ Redirect to success   │
        │ URL with session_id   │
        ▼                       │
┌──────────────────────────────────────────────────────────────┐
│ 6. BACKEND - Success Handler                                 │
│    (orderController.js - checkoutSuccess)                    │
│                                                              │
│    GET /api/v1/orders/checkout-success?session_id=xxx        │
│                                                              │
│    ✓ Retrieve session from Stripe                            │
│    ✓ Verify payment_status === 'paid'                        │
│    ✓ Find order by stripeSessionId                           │
│    ✓ Update status: pending → placed                         │
│    ✓ Set timeout: placed → delivered (8 hours)               │
│    ✓ Redirect to frontend success page                       │
└──────┬───────────────────────────────────────────────────────┘
       │
       │ Redirect to: http://localhost:5173/payment-status?payment=success
       ▼
┌──────────────────────────────────────────────────────────────┐
│ 7. PAYMENT STATUS PAGE (PaymentStatus.jsx)                   │
│                                                              │
│    ✅ SUCCESS PAGE                                           │
│    - Green checkmark animation                               │
│    - "Payment Successful!" message                           │
│    - Order confirmation                                      │
│    - "Continue Shopping" button                              │
│                                                              │
│    OR                                                        │
│                                                              │
│    ❌ CANCELLED PAGE                                         │
│    - Red X icon                                              │
│    - "Payment Cancelled" message                             │
│    - "Return to Cart" button                                 │
└──────┬───────────────────────────────────────────────────────┘
       │
       │ User can view orders
       ▼
┌──────────────────────────────────────────────────────────────┐
│ 8. ORDERS PAGE (Orders.jsx)                                  │
│    GET /api/v1/orders/my-orders                              │
│                                                              │
│    📦 ORDER HISTORY                                          │
│    - List all user orders                                    │
│    - Show order status badges:                               │
│      ⏰ Pending  | 🚚 Placed  | ✅ Delivered                 │
│    - Order details (books, prices, total)                    │
│    - Order date & time                                       │
│    - Auto-update notice for placed orders                    │
└──────────────────────────────────────────────────────────────┘
```

---

## Status Flow Timeline

```
Order Status Progression:

┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  PENDING    │ ───► │  PLACED     │ ───► │ DELIVERED   │
│             │      │             │      │             │
│ Created in  │      │ Payment     │      │ Auto-updated│
│ DB before   │      │ successful, │      │ after 8     │
│ payment     │      │ ready for   │      │ hours       │
│             │      │ processing  │      │             │
└─────────────┘      └─────────────┘      └─────────────┘
     ▲                    │                    │
     │                    │                    │
     └────────────────────┴────────────────────┘
              User can view in Orders page
```

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
│                                                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │   Cart     │  │  Payment   │  │  Orders    │           │
│  │  Context   │  │  Status    │  │  History   │           │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘           │
│        │               │               │                   │
│        └───────────────┼───────────────┘                   │
│                        │                                   │
│                ┌───────▼────────┐                          │
│                │   axios.js     │                          │
│                │  API Client    │                          │
│                └───────┬────────┘                          │
└────────────────────────┼───────────────────────────────────┘
                         │
                         │ HTTP Requests
                         │ (JSON + Auth Token)
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND (Node/Express)                  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Express App (app.js)                    │  │
│  └──────────────────────────────────────────────────────┘  │
│         │                    │                              │
│         ▼                    ▼                              │
│  ┌─────────────┐      ┌─────────────┐                     │
│  │   Routes    │      │ Middleware  │                     │
│  │ /orders/*   │      │ - auth      │                     │
│  └──────┬──────┘      │ - error     │                     │
│         │             └─────────────┘                     │
│         ▼                                                  │
│  ┌─────────────────┐                                      │
│  │  Controllers    │                                      │
│  │  - checkout     │                                      │
│  │  - success      │                                      │
│  │  - cancel       │                                      │
│  └────────┬────────┘                                      │
│           │                                                │
│           ├──────────────┐                                │
│           │              │                                │
│           ▼              ▼                                │
│  ┌─────────────┐  ┌─────────────┐                        │
│  │  MongoDB    │  │   Stripe    │                        │
│  │  Database   │  │  API        │                        │
│  │  (Orders)   │  │  (Payment)  │                        │
│  └─────────────┘  └─────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Interaction Map

```
Navbar.jsx
  ├─ Shows cart count (from CartContext)
  └─ Links to:
      ├─ /cart → Cart.jsx
      ├─ /orders → Orders.jsx
      └─ /profile → Profile.jsx

Cart.jsx
  ├─ Uses CartContext (cart, addToCart, removeFromCart)
  ├─ Uses AuthContext (user authentication)
  ├─ Calls API: POST /orders/checkout-session
  └─ Redirects to Stripe Checkout URL

PaymentStatus.jsx
  ├─ Reads URL params (?payment=success/cancelled)
  ├─ Displays appropriate message
  └─ Links back to home/cart

Orders.jsx
  ├─ Fetches orders: GET /orders/my-orders
  ├─ Displays order history
  └─ Shows order status progression

App.jsx
  └─ Defines all routes:
      ├─ / (Home)
      ├─ /cart (Cart)
      ├─ /payment-status (PaymentStatus)
      ├─ /orders (Orders)
      └─ /login, /signup, /profile, /add-book
```

---

## Security Layers

```
┌─────────────────────────────────────────┐
│  Layer 1: Frontend Validation           │
│  - User must be logged in               │
│  - Cart must have items                 │
│  - Valid book IDs                       │
└──────────────┬──────────────────────────┘
               ▼
┌─────────────────────────────────────────┐
│  Layer 2: Authentication Middleware     │
│  - JWT token verification               │
│  - protect() middleware                 │
│  - User ID extraction                   │
└──────────────┬──────────────────────────┘
               ▼
┌─────────────────────────────────────────┐
│  Layer 3: Backend Validation            │
│  - Book existence check                 │
│  - Price validation                     │
│  - Quantity verification                │
└──────────────┬──────────────────────────┘
               ▼
┌─────────────────────────────────────────┐
│  Layer 4: Stripe Verification          │
│  - Secure payment processing            │
│  - PCI compliance                       │
│  - Session validation                   │
└──────────────┬──────────────────────────┘
               ▼
┌─────────────────────────────────────────┐
│  Layer 5: Payment Confirmation          │
│  - Server-side session retrieval        │
│  - payment_status verification          │
│  - Order status update                  │
└─────────────────────────────────────────┘
```

---

This flow ensures a secure, seamless, and professional payment experience! 🚀
