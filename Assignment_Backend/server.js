require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();
const employeeRoutes = require("./routes/employeeRoutes");
// Middleware
app.use(cors());
app.use(express.json());
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
const Employee = require("./models/Employee");
app.use("/api/employees", employeeRoutes);

app.post("/signup", async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!email || email.trim() === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if the user already exists
    const existingUser = await Employee.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new Employee document
    const newEmployee = new Employee({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new employee to the database
    await newEmployee.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already in use" });
    }
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
