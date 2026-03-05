const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/orderModel");
const Book = require("../models/bookModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { sendInvoiceEmail } = require("../middleware/email");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    const { items } = req.body;
    if (!items || items.length === 0) {
        return next(new AppError("No items in order", 400));
    }

    const lineItems = [];
    const orderBooks = [];
    let totalAmount = 0;

    for (const item of items) {
        const book = await Book.findById(item.bookId);
        if (!book) return next(new AppError(`Book not found: ${item.bookId}`, 404));

        const unitPrice = book.price;
        totalAmount += unitPrice * item.quantity;

        orderBooks.push({
            bookId: book._id,
            title: book.title,
            quantity: item.quantity,
            price: unitPrice,
        });

        lineItems.push({
            price_data: {
                currency: "usd",
                unit_amount: Math.round(unitPrice * 100), // Stripe expects cents, Math.round prevents JS decimal errors
                product_data: {
                    name: book.title,
                    description: book.description,
                },
            },
            quantity: item.quantity,
        });
    }

    // Create checkout session using relative paths if frontend handles redirect, or full paths.
    // Using localhost 5000 for simplicity as an example
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const successUrl = `${baseUrl}/api/v1/orders/checkout-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/api/v1/orders/checkout-cancel`;

    let session;
    try {
        session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            success_url: successUrl,
            cancel_url: cancelUrl,
            customer_email: req.user.email,
            client_reference_id: req.user.id,
            mode: "payment",
            line_items: lineItems,
        });
    } catch (e) {
        return next(new AppError("Looks like you haven't setup your Stripe secret yet! Add STRIPE_SECRET_KEY in your .env", 500))
    }

    const order = await Order.create({
        user: req.user.id,
        books: orderBooks,
        totalAmount,
        stripeSessionId: session.id,
        status: "pending",
    });

    res.status(200).json({
        status: "success",
        session,
    });
});

exports.checkoutSuccess = catchAsync(async (req, res, next) => {
    const { session_id } = req.query;

    if (!session_id) {
        return next(new AppError("Session ID not found", 400));
    }

    // Verify the payment session with Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
        return next(new AppError("Payment not completed", 400));
    }

    const order = await Order.findOne({ stripeSessionId: session_id }).populate('user');

    if (!order) {
        return next(new AppError("Order not found", 404));
    }

    if (order.status === "pending") {
        // Update order to placed
        order.status = "placed";
        await order.save();

        // Remove (deduct) the purchased items from the available book stock
        for (const item of order.books) {
            await Book.findByIdAndUpdate(item.bookId, {
                $inc: { stock: -item.quantity } // Decrements the stock safely in the DB
            });
        }

        // Send backend payment invoice to the given user organically via their email
        try {
            await sendInvoiceEmail(order.user.email, order);
            console.log(`Invoice successfully sent to ${order.user.email}`);
        } catch (err) {
            console.error("Failed to send invoice email:", err);
        }

        // Schedule task to update status to "delivered" after 8 hours
        const eightHoursInMillis = 8 * 60 * 60 * 1000;

        setTimeout(async () => {
            try {
                const dbOrder = await Order.findById(order._id);
                if (dbOrder && dbOrder.status === "placed") {
                    dbOrder.status = "delivered";
                    await dbOrder.save();
                    console.log(`Order ${dbOrder._id} status updated to "delivered" automatically after 8 hours.`);
                }
            } catch (err) {
                console.error("Error updating order status in setTimeout", err);
            }
        }, eightHoursInMillis);
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/payment-status?payment=success`);
});

exports.checkoutCancel = (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}?payment=cancelled`);
}

exports.getMyOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
        status: "success",
        results: orders.length,
        data: {
            orders,
        },
    });
});
