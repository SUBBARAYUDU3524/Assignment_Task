const express = require("express");
const multer = require("multer");
const {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  signup,
  login,
  getProfile,
} = require("../controllers/employeeController");

const router = express.Router();
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
// File Upload Middleware

// Employee Routes
router.get("/getemployee/:id", authMiddleware, getEmployees);
router.get("/getemployee", authMiddleware, getEmployees);
router.post(
  "/addemployee",
  upload.single("employeeImage"),
  authMiddleware,
  addEmployee
);

// Update Employee
router.put(
  "/updateemployee/:id",
  upload.single("employeeImage"),
  authMiddleware,
  updateEmployee
);
router.delete("/deleteemployee/:id", authMiddleware, deleteEmployee);

// Authentication Routes
router.post("/login", login);
router.get("/myprofile", authMiddleware, getProfile);

module.exports = router;
