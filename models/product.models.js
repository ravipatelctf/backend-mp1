const mongooose = require("mongoose");

const productSchema = new mongooose.Schema({
    productName: {
        type: String,
    },
    productPrice: {
        type: Number,
    },
    discountPercentage: {
        type: Number
    },
    productImageUrl: {
        type: String
    },
    productImageAlt: {
        type: String
    },
    productRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    productQuantity: {
        type: Number
    },
    productSize: {
        type: String,
        enum: ["S", "M", "XL", "XXl"]
    },
    productDescription: {
        type: String
    }
},
{
    timestamps: true,
},
);

const Product = mongooose.model("Product", productSchema);

module.exports = Product;