const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "Users",
        required: true,
    },
    books: [
        {
            bookId: {
                type: mongoose.Schema.ObjectId,
                ref: "Books",
                required: true,
            },
            title: String,
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "placed", "delivered"],
        default: "pending",
    },
    stripeSessionId: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
