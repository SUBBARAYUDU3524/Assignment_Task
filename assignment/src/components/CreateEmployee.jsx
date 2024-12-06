import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast"; // Toast notifications

const CreateEmployee = () => {
  const [employeeData, setEmployeeData] = useState({
    employeeName: "",
    employeeEmail: "",
    employeeMobile: "",
    employeeDesignation: "HR", // Default value
    employeeGender: "Male", // Default value
    employeeCoursess: "", // Single course selection
    employeeImage: null,
  });

  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const token = localStorage.getItem("token");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: value,
    });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setEmployeeData({ ...employeeData, employeeImage: file });
    } else {
      toast.error("Please upload a valid JPG or PNG image.");
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    Object.keys(employeeData).forEach((key) => {
      if (key === "employeeCourses") {
        formData.append(key, employeeData[key]); // Send only a single course
      } else {
        formData.append(key, employeeData[key]);
      }
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/employees/addemployee",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request header
          },
        }
      );
      setEmployeeData(response.data);
      setLoading(false);
      toast.success("Employee created successfully!");
      setEmployeeData({
        employeeName: "",
        employeeEmail: "",
        employeeMobile: "",
        employeeDesignation: "HR",
        employeeGender: "Male",
        employeeCourses: "BSc",
        employeeImage: null,
      });
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.error || "Failed to create employee.");
      toast.error(error.response?.data?.error || "Failed to create employee.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 shadow-lg rounded-lg bg-white">
      <Toaster />
      <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">
        Create Employee
      </h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium">Employee Name</label>
          <input
            type="text"
            name="employeeName"
            value={employeeData.employeeName}
            onChange={handleChange}
            required
            className="w-full mt-2 px-4 py-3 border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-lg font-medium">Email</label>
          <input
            type="email"
            name="employeeEmail"
            value={employeeData.employeeEmail}
            onChange={handleChange}
            required
            className="w-full mt-2 px-4 py-3 border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-lg font-medium">Mobile</label>
          <input
            type="text"
            name="employeeMobile"
            value={employeeData.employeeMobile}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            className="w-full mt-2 px-4 py-3 border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-lg font-medium">Designation</label>
          <select
            name="employeeDesignation"
            value={employeeData.employeeDesignation}
            onChange={handleChange}
            required
            className="w-full mt-2 px-4 py-3 border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium">Gender</label>
          <div className="flex space-x-6 mt-2">
            {["Male", "Female", "Other"].map((gender) => (
              <label key={gender} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="employeeGender"
                  value={gender}
                  checked={employeeData.employeeGender === gender}
                  onChange={handleChange}
                  required
                  className="text-lg"
                />
                <span className="text-lg">{gender}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium">Course</label>
          <select
            name="employeeCourses"
            value={employeeData.employeeCourses}
            onChange={handleChange}
            required
            className="w-full mt-2 px-4 py-3 border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a course</option>
            <option value="BCom">BCom</option>
            <option value="BSc">BSc</option>
            <option value="BCA">BCA</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleImageUpload}
            className="mt-2 px-4 py-3 border rounded-md text-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Employee"}
        </button>
      </form>
    </div>
  );
};

export default CreateEmployee;
