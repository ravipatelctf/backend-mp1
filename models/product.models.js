const mongooose = require("mongoose");

const productSchema = new mongooose.Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    discountPercentage: {
        type: Number
    },
    imageUrl: {
        type: String
    },
    imageAlt: {
        type: String
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    quantity: {
        type: Number
    },
    size: {
        type: String,
        enum: ["S", "M", "XL", "XXL"]
    },
    description: {
        type: String
    },
    isAddedToCart: {
        type: Boolean
    },
    isAddedToWishlist: {
        type: Boolean
    },
    category: {
        type: String,
        enum: ["Men", "Women", "Kids"]
    }
},
{
    timestamps: true,
},
);

const Product = mongooose.model("Product", productSchema);

module.exports = Product;