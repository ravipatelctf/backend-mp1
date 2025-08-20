const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    addresses: [
        {
            address: String,
        }
    ],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
},
{
    timestamps: true
},
);

const User = mongoose.model("User", userSchema);

module.exports = User;