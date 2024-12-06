const mongoose = require("mongoose");

const EmployeeAddSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
    trim: true,
  },
  employeeEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (v) => /\S+@\S+\.\S+/.test(v),
      message: "Please enter a valid email address",
    },
  },
  employeeMobile: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^[0-9]{10}$/.test(v),
      message: "Please enter a valid 10-digit phone number",
    },
  },
  employeeDesignation: {
    type: String,
    required: true,
    enum: ["HR", "Manager", "Sales"],
  },
  employeeGender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  employeeCourses: {
    type: String,
    required: true,
    enum: ["BSc", "BCom", "BCA"],
  },
  employeeImage: {
    type: String,
  },
});

module.exports = mongoose.model("addEmployee", EmployeeAddSchema);
