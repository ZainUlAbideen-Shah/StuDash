const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

const admin = require("firebase-admin");

// Serve static files from the 'public' directory
app.use(cors());
app.use(express.static("public"));

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json"); // Path to your service account key JSON file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://studash-69952-default-rtdb.firebaseio.com/", // Replace with your Firebase project's database URL
});

// Get a reference to the Firestore database
const db = admin.firestore();

app.get("/", (req, res) => {
  res.json({ message: "working" });
});

// Define a route to handle file uploads
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    console.log(req);
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // Read the uploaded CSV file
    const filePath = path.join(__dirname, req.file.path);
    const jsonData = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        jsonData.push(row);
      })
      .on("end", () => {
        // Remove the uploaded file
        fs.unlinkSync(filePath);

        // Write the JSON data to a file
        const jsonFilePath = path.join(
          __dirname,
          "tmp",
          `${req.file.filename}.json`
        );
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));

        /// jsonData

        // send this data to firebase
        // Push jsonData to Firebase Firestore
        db.collection("data")
          .doc("jsonDataDocument")
          .set({ data: jsonData })
          .then(() => {
            console.log("Data successfully written to Firestore");
          })
          .catch((error) => {
            console.error("Error writing data to Firestore:", error);
          });

        // Send success response
        res.json({ message: "File uploaded and converted to JSON" });
      });
  } catch (error) {
    console.error("Error handling file upload:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
