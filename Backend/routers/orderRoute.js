const express = require("express");
const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");

const router = express.Router();

router.use(authController.protect);

router.post("/checkout-session", orderController.getCheckoutSession);
router.get("/checkout-success", orderController.checkoutSuccess);
router.get("/checkout-cancel", orderController.checkoutCancel);

router.get("/my-orders", orderController.getMyOrders);

module.exports = router;
