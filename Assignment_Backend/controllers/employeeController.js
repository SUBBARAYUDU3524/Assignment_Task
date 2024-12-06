const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");
const addEmployee = require("../models/EmployeeAdd");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with your credentials (get these from Cloudinary Dashboard)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // Replace with your Cloudinary Cloud Name
  api_key: process.env.API_KEY, // Replace with your Cloudinary API Key
  api_secret: process.env.API_SECRET, // Replace with your Cloudinary API Secret
});
// Employee Operations
exports.getEmployees = async (req, res) => {
  try {
    const employees = await addEmployee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addEmployee = async (req, res) => {
  try {
    const {
      employeeName,
      employeeEmail,
      employeeMobile,
      employeeDesignation,
      employeeGender,
      employeeCourses,
    } = req.body;

    const existingEmployee = await addEmployee.findOne({ employeeEmail });
    if (existingEmployee) {
      return res.status(400).json({ error: "Email already exists" });
    }

    let employeeImageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "employee_images",
      });
      employeeImageUrl = result.secure_url;
    }

    const employee = new addEmployee({
      employeeName,
      employeeEmail,
      employeeMobile,
      employeeDesignation,
      employeeGender,
      employeeCourses,
      employeeImage: employeeImageUrl,
    });

    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    console.error("Error adding employee:", error.message); // Log error details
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      employeeName,
      employeeEmail,
      employeeMobile,
      employeeDesignation,
      employeeGender,
      employeeCourse,
    } = req.body;

    const employee = await addEmployee.findByIdAndUpdate(
      id,
      {
        employeeName,
        employeeEmail,
        employeeMobile,
        employeeDesignation,
        employeeGender,
        employeeCourse,
      },
      { new: true }
    );

    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await addEmployee.findByIdAndDelete(id);
    res.json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email is provided
    if (!email || !name || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the user already exists
    const existingUser = await Employee.findOne({ email }); // Correct reference
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new Employee document with only name, email, and hashed password
    const newEmployee = new Employee({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new employee to the database
    await newEmployee.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Employee.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, "assignment", {
      expiresIn: "24h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const user = await Employee.findById(req.user.id).select("-password"); // Select all fields except password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user); // Return the user profile data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
