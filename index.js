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
//                 name: productData.name,
//                 price: productData.price,
//                 discountPercentage: productData.discountPercentage,
//                 imageUrl: productData.imageUrl,
//                 imageAlt: productData.imageAlt,
//                 rating: productData.rating,
//                 quantity: productData.quantity,
//                 size: productData.size,
//                 description: productData.description,
//                 isAddedToCart: productData.isAddedToCart,
//                 isAddedToWishlist: productData.isAddedToWishlist,
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

async function readAll() {
    try {
        const allProducts = await Product.find();
        return allProducts;
    } catch (error) {
        throw error;
    }
}

app.get("/api/products", async (req, res) => {
    try {
        const allProducts = await readAll();
        if (allProducts) {
            res
                .status(200)
                .send(allProducts)
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

async function readById(productId) {
    try {
        const product = await Product.findById(productId);
        return product;
    } catch (error) {
        throw error;
    }
}

app.get("/api/products/:productId", async (req, res) => {
    try {
        const product = await readById(req.params.productId);
        if (product) {
            res
                .status(200)
                .send(product)
        } else {
            res
                .status(404)
                .json({error: "data not found!"});
        }
    } catch (error) {
        res
            .status(500)
            .json({error: "Failed to load data!"});
    }
})

// --------------------------------------------------------------------------

async function readByIdAndUpdate(productId, dataToUpdate) {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, dataToUpdate, {new: true});
        return updatedProduct        
    } catch (error) {
        throw error
    }
}

app.post("/api/products/:productId", async (req, res) => {
    try {
        const updatedProduct = await readByIdAndUpdate(req.params.productId, req.body);
        if(updatedProduct) {
            res
                .status(200)
                .json({message: "data updated successfully.", updatedData: updatedProduct});
        } else {
            res
                .status(404)
                .json({error: "data not found!"});
        }
    } catch (error) {
        res
            .status(500)
            .json({error: "Failed to update data!"});
    }
})

// --------------------------------------------------------------------------

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port :${PORT}`);
})
// --------------------------------------------------------------------------