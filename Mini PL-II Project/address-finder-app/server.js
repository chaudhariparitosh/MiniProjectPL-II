const express = require('express');
const multer = require('multer');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;

// Middleware to handle file uploads
const upload = multer({ dest: 'uploads/' });

// MongoDB connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'address-finder-app';

// Function to connect to MongoDB
async function connectToMongoDB() {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
        await client.connect();
        console.log("Connected to MongoDB server");
        return client.db(dbName);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

// Route to handle form submissions
app.post('/submit', upload.single('image'), async (req, res) => {
    try {
        const db = await connectToMongoDB();
        
        const { name, address } = req.body;
        const imageFilePath = req.file.path;
        
        // Save data to MongoDB
        await db.collection('addresses').insertOne({ name, address, imageFilePath });
        
        res.status(201).send("Data saved successfully");
    } catch (error) {
        console.error("Error submitting data:", error);
        res.status(500).send("Internal server error");
    }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
