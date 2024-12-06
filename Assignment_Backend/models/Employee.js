const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

EmployeeSchema.index({ email: 1 }, { unique: true });

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;
