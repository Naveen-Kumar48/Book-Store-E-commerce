# 🚀 Stripe Payment Gateway Integration Guide

## ✅ What's Already Integrated

Your Book-Store Ecommerce application **already has Stripe backend integration**! Here's what was implemented:

### Backend Features:
- ✅ Stripe package installed (`stripe: ^20.4.0`)
- ✅ Order model with `stripeSessionId` field
- ✅ Checkout session controller
- ✅ Payment success/cancel handlers
- ✅ Order status management (pending → placed → delivered)
- ✅ Stripe payment verification

### Frontend Features:
- ✅ Cart page with real checkout
- ✅ Payment status page
- ✅ Success/cancel handling
- ✅ API integration

---

## 🔧 Setup Instructions

### Step 1: Configure Stripe API Keys

1. **Get Your Stripe Keys:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/)
   - Navigate to **Developers** → **API Keys**
   - Copy your **Secret Key** (starts with `sk_test_`)

2. **Update Backend Environment:**
   
   Open `Backend/config.development.env` and update:
   ```env
   STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_STRIPE_SECRET_KEY_HERE
   FRONTEND_URL=http://localhost:5173
   ```

   > ⚠️ **IMPORTANT:** Replace `sk_test_YOUR_ACTUAL_STRIPE_SECRET_KEY_HERE` with your real Stripe test secret key

---

## 🎯 How It Works

### Checkout Flow:

1. **User Adds Books to Cart** → Cart context stores items
2. **User Clicks Checkout** → Frontend calls `/api/v1/orders/checkout-session`
3. **Backend Creates Stripe Session**:
   - Validates books exist
   - Calculates total price
   - Creates Stripe Checkout session
   - Saves order with `pending` status
4. **Redirect to Stripe** → User completes payment on Stripe's secure page
5. **Payment Success** → Redirected to `/payment-status?payment=success`
6. **Order Updated** → Status changes to `placed`, auto-updates to `delivered` after 8 hours

---

## 📝 Testing the Integration

### Test Card Numbers (Stripe Test Mode):

Use these test cards in Stripe's test environment:

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 9995` | Declined card |
| `4000 0025 0000 3155` | Requires authentication |

- **Expiry:** Any future date (e.g., 12/34)
- **CVC:** Any 3 digits (e.g., 123)
- **ZIP:** Any 5 digits (e.g., 12345)

---

## 🏃 Quick Start

### 1. Start Backend Server:
```bash
cd Backend
npm start
```
Server runs on `http://localhost:5000`

### 2. Start Frontend:
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

### 3. Test Payment:
1. Browse books at `http://localhost:5173`
2. Add books to cart
3. Go to cart page
4. Click "Checkout" button
5. Complete payment with test card
6. See success page!

---

## 🛡️ Security Notes

### For Production:
1. **Use Live Stripe Keys:**
   - Get production keys from Stripe Dashboard
   - Update `config.production.env`:
   ```env
   STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
   FRONTEND_URL=https://yourdomain.com
   ```

2. **Environment Variables:**
   - Never commit `.env` files to Git
   - Use secure environment variable management

3. **Webhook Setup (Optional but Recommended):**
   - Set up Stripe webhooks for real-time payment notifications
   - Handle events: `checkout.session.completed`, `payment_intent.succeeded`

---

## 📊 API Endpoints

### Create Checkout Session
```
POST /api/v1/orders/checkout-session
Headers: Authorization: Bearer <token>
Body: {
  "items": [
    { "bookId": "123", "quantity": 2 }
  ]
}
```

### Payment Success Handler
```
GET /api/v1/orders/checkout-success?session_id=<session_id>
```

### Payment Cancel Handler
```
GET /api/v1/orders/checkout-cancel
```

### Get My Orders
```
GET /api/v1/orders/my-orders
Headers: Authorization: Bearer <token>
```

---

## 🐛 Troubleshooting

### Error: "Looks like you haven't setup your Stripe secret yet!"
- ✅ Check `STRIPE_SECRET_KEY` in `config.development.env`
- ✅ Restart backend server after adding key
- ✅ Verify key starts with `sk_test_` or `sk_live_`

### Checkout Not Working:
- ✅ Ensure you're logged in
- ✅ Verify cart has items
- ✅ Check console for errors
- ✅ Confirm backend is running on port 5000

### Payment Success Page Not Loading:
- ✅ Check `FRONTEND_URL` in backend env
- ✅ Verify frontend is running on correct port
- ✅ Clear browser cache

---

## 🎨 Customization Options

### Modify Stripe Checkout Appearance:
Edit `orderController.js` - `getCheckoutSession` function:
```javascript
const session = await stripe.checkout.sessions.create({
  // ... existing config
  payment_method_types: ['card', 'alipay'], // Add more payment methods
  metadata: {
    orderId: order._id.toString()
  },
  // Customize Stripe page
  billing_address_collection: 'required',
  shipping_options: [...]
});
```

### Add Order Confirmation Email:
In `checkoutSuccess`, add email sending logic using your existing email middleware.

---

## 📈 Next Steps

To enhance your payment system:

1. **Add Order History Page** - Display user's past orders
2. **Implement Webhooks** - Real-time payment updates
3. **Add Refund Functionality** - Admin can process refunds
4. **Multiple Payment Methods** - Apple Pay, Google Pay, Alipay
5. **Subscription Model** - Recurring payments for premium features
6. **Invoice Generation** - PDF invoices for orders

---

## 🎉 You're All Set!

Your Stripe integration is complete and ready to use. The payment flow is fully functional with:
- ✅ Secure Stripe Checkout
- ✅ Order tracking
- ✅ Payment verification
- ✅ Success/Cancel handling
- ✅ Auto-delivery after 8 hours

Happy selling! 🚀📚
