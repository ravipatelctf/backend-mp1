const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                required: true,
            },
            size: {
                type: String,
                enum: ["S", "M", "XL", "XXL"],
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    deliveryCharge: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true
    }

},
{
    timestamps: true,
},
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;