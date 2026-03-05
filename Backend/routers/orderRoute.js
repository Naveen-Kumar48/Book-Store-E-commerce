const express = require("express");
const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");

const router = express.Router();

// Stripe redirects the browser here from outside the app (so no Authorization Bearer token is attached natively)
// These routes must be declared BEFORE the router.use(protect) middleware!
router.get("/checkout-success", orderController.checkoutSuccess);
router.get("/checkout-cancel", orderController.checkoutCancel);

// Any routes defined after this line MUST have a valid Login token!
router.use(authController.protect);

router.post("/checkout-session", orderController.getCheckoutSession);
router.get("/my-orders", orderController.getMyOrders);

module.exports = router;
