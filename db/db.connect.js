const mongoose = require("mongoose");
require("dotenv").config();
const MongoUri = process.env.MONGODB;

async function initializeDatabase() {
    await mongoose
        .connect(MongoUri)
        .then(() => {
            console.log("Connected to database successfully.")
        })
        .catch((error) => {
            throw error;
        });
}

module.exports = {initializeDatabase};