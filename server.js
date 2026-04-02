const express = require("express");
const connectDB = require("./src/config/db");
const seedAdmin = require("./src/utils/seedAdmin");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");

// Load environment variables
require("dotenv").config();

const app = express();

// Connect to MongoDB database
connectDB().then(() => {
  seedAdmin();
});

// Parse incoming JSON requests
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Finance Backend Running");
});

//server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
