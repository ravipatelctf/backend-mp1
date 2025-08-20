const {initializeDatabase} = require("./db/db.connect");
const Product = require("./models/product.models");
const User = require("./models/user.models");


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



// --------------------------------------------------------------------------
// const fs = require("fs");

// const jsonData = fs.readFileSync("productsData.json", "utf-8");
// const productsData = JSON.parse(jsonData);

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
//                 category: productData.category
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

// --------------------------------------------------------------------------

// async function seedUsers() {
//     try {
//         const newUser = new User({
//             name: "Test User 1",
//             emailId: "test@user1.example",
//             phoneNumber: 1234567890,
//             addresses: [
//                 {id: 1, value: "Test address 1"},
//                 {id: 2, value: "Test address 2"},
//                 {id: 3, value: "Test address 3"},
//             ],
//         });
//         await newUser.save();
//         console.log("User DB seeded with a test user successfully.")
//     } catch (error) {
//         throw error;
//     }
// }
// seedUsers()
// --------------------------------------------------------------------------
// user routes
// --------------------------------------------------------------------------
// get user by id
async function readUserById() {
    try {
        const user = await User.findById("68a35f768fc5c3d122846f6b").populate("orders");
        return user;
    } catch (error) {
        throw error;
    }
}

app.get("/api/user", async (req, res) => {
    try {
        const user = await readUserById();
        if (user) {
            res
                .status(200)
                .send(user)
        } else {
            res
                .status(404)
                .json({error: "user not found!"});
        }
    } catch (error) {
        res
            .status(500)
            .json({error: "Failed to fetch user!"})
    }
})
// --------------------------------------------------------------------------
// find usera and populate it's orders field with products ordered

async function readUserAndPopulateOrders(productId) {
    try {
        const user = await User.findOne();
        if (!user) {
            throw new Error("User Not Found!")
        }

        user.orders.push(productId);
        const updatedUser = await user.save();

        return await updatedUser.populate("orders");
    } catch (error) {
        throw error;
    }
}

app.post("/api/user/orders", async (req, res) => {
    try {
        const {productId} = req.body;
        const updatedUser = await readUserAndPopulateOrders(productId);
        res
            .status(200)
            .send(updatedUser)
    } catch (error) {
        res
            .status(500)
            .json({error: "Failed to update data"})
    }
})

// --------------------------------------------------------------------------
// update user address by id
async function readUserByIdAndUpdateAddress(dataToUpdate) {
    try {
        const {addresses} = dataToUpdate;
        const updatedUser = await User.findByIdAndUpdate("68a35f768fc5c3d122846f6b", {addresses}, {new: true}).populate("orders");
        return updatedUser;
    } catch (error) {
        throw error;
    }
}

app.post("/api/user", async (req, res) => {
    try {
        const updatedUser = await readUserByIdAndUpdateAddress(req.body);
        if (updatedUser) {
            res
                .status(200)
                .send(updatedUser)
        } else {
            res
                .status(404)
                .json({error: "user not found"})
        }
        
    } catch (error) {
        res
            .status(500)
            .json({error: "Failed to update data"})
    }
})

// --------------------------------------------------------------------------
// products routes
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