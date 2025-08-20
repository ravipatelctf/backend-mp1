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
//                 {address: "Test address 1"},
//                 {address: "Test address 2"},
//                 {address: "Test address 3"},
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
        const user = await User.findById("68a592d50fd78b8fbcf05476").populate("orders");
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
// add new address to addresses field of user data
async function readUserAndAddNewAddress(newAddressObject) {
    try {
        const user = await User.findOne();
        if (!user) {
            throw new Error("User Not Found!");
        }
        user.addresses.push(newAddressObject);
        const updatedUser = await user.save();
        return updatedUser
    } catch (error) {
        throw error;
    }
}

app.post("/api/user/addresses", async (req, res) => {
    try {
        const updatedUser = await readUserAndAddNewAddress(req.body);
        if (!updatedUser) {
            res
                .status(404)
                .json({error: "User Not Found!"});
        } else {
            res
                .status(201)
                .json({message: "Address added successfully.", user: updatedUser});
        }
    } catch (error) {
        res
            .status(500)
            .json({error: "Failed to update address!"});
    }
})

// --------------------------------------------------------------------------
// delete an address from addresses field of user data

async function readUserAndDeleteAnAddressFromAddressesField(addressId) {
    try {
        const user = await User.findOne();
        if (!user) {
            throw new Error("User Not Found")
        }
        user.addresses = user.addresses.filter(element => element._id.toString() !== addressId);
        const updatedUser = await user.save();
        return updatedUser;
    } catch (error) {
        throw error;
    }
}

app.delete("/api/user/addresses/:addressId", async (req, res) => {
    try {
        const addressId = req.params.addressId;
        const updatedData = await readUserAndDeleteAnAddressFromAddressesField(addressId);
        if (!updatedData) {
            res
                .status(404)
                .json({error: "Address Not Found!"});
        } 
        res
            .status(200)
            .json({message: "Address deleted successfully.", user: updatedData})
       
    } catch (error) {
        res
            .status(500)
            .json({error: "Failed to delete address!"})
    }
})

// --------------------------------------------------------------------------
// find user and populate it's orders field with products ordered

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
// update an address in addresses field of user
async function readUserAndUpdateAddressById(addressId, updatedAddress) {
    try {
        const user = await User.findOne();
        if (!user) {
            throw new Error("User not found!");
        }

        const address = user.addresses.id(addressId);
        if (!address) {
            throw new Error("Address Not Found");
        }
        address.address = updatedAddress;
        await user.save();

        return user;
    } catch (error) {
        
    }
}

app.post("/api/user/addresses/:addressId", async (req, res) => {
    try {
        const {address} = req.body;
        const updatedUser = await readUserAndUpdateAddressById(req.params.addressId, address);
        if (updatedUser) {
            res
                .status(200)
                .json({message: "Address updated successfully.", user: updatedUser});
        } else {
            res
                .status(404)
                .json({error: "Address not Found!"})
        }
    } catch (error) {
        res
            .status(500)
            .json({error: "Failed to update address!"});
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