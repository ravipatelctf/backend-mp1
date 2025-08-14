const {initializeDatabase} = require("./db/db.connect");
const Product = require("./models/product.models");

// const fs = require("fs");

const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

initializeDatabase();

// const jsonData = fs.readFileSync("productsData.json", "utf-8");
// const productsData = JSON.parse(jsonData);

// --------------------------------------------------------------------------
// function to seed database
// async function seedData() {
//     try {
//         for (const productData of productsData) {
//             const newProduct = new Product({    
//                 productName: productData.productName,
//                 productPrice: productData.productPrice,
//                 discountPercentage: productData.discountPercentage,
//                 productImageUrl: productData.productImageUrl,
//                 productImageAlt: productData.productImageAlt,
//                 productRating: productData.productRating,
//                 productQuantity: productData.productQuantity,
//                 productSize: productData.productSize,
//                 productDescription: productData.productDescription
//             });
//             const savedData = await newProduct.save();
//         }
//         console.log("Database seeded with products data successfully.")
//     } catch (error) {
//         throw error;
//     }
// }

// seedData();
// --------------------------------------------------------------------------

async function readAllProducts() {
    try {
        const allProducts = await Product.find();
        return allProducts;
    } catch (error) {
        throw error;
    }
}

app.get("/products", async (req, res) => {
    try {
        const allProducts = await readAllProducts();
        if (allProducts) {
            res
                .status(200)
                .send(allProducts)
                .json({message: "Data fetched successfully."});
        } else {
            res
                .status(404)
                .json({error: "Data Not Found!"})
        }
    } catch (error) {
        res
            .status(500)
            .json({error: "Failed to fetch data!"});
    }
})

// --------------------------------------------------------------------------

app.get("/", (req, res) => {
    res.send("Hello, This is backend of Major Project 1");
})

// --------------------------------------------------------------------------

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port :${PORT}`);
})
// --------------------------------------------------------------------------