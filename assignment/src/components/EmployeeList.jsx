import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editModal, setEditModal] = useState(false); // For the edit modal
  const [employeeData, setEmployeeData] = useState({
    employeeName: "",
    employeeEmail: "",
    employeeMobile: "",
    employeeDesignation: "",
    employeeGender: "",
    employeeCourses: "",
    employeeImage: null,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // Fetch employee data on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/employees/getemployee",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request header
            },
          }
        );
        setEmployees(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch employee data");
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);
  console.log(employees, "em[pdkfdata");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: value,
    });
  };
  // Handle delete action
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/employees/deleteemployee/${selectedEmployee}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request header
          },
        }
      );
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee._id !== selectedEmployee)
      );
      setDeleteModal(false);
      toast.success("Employee deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete employee.");
      setDeleteModal(false);
    }
  };

  // Handle edit action
  const handleEdit = (id) => {
    const employeeToEdit = employees.find((employee) => employee._id === id);
    setEmployeeData({
      employeeName: employeeToEdit.employeeName,
      employeeEmail: employeeToEdit.employeeEmail,
      employeeMobile: employeeToEdit.employeeMobile,
      employeeDesignation: employeeToEdit.employeeDesignation,
      employeeGender: employeeToEdit.employeeGender,
      employeeCourses: employeeToEdit.employeeCourses,
    });
    setSelectedEmployee(id);
    setEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/employees/updateemployee/${selectedEmployee}`,
        employeeData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request header
          },
        }
      );
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee._id === selectedEmployee
            ? { ...employee, ...employeeData }
            : employee
        )
      );
      setEditModal(false);
      toast.success("Employee updated successfully!");
    } catch (err) {
      toast.error("Failed to update employee.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Employee List</h2>

      <table className="min-w-full bg-white rounded-lg shadow overflow-hidden border">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Mobile</th>
            <th className="px-4 py-2">Designation</th>
            <th className="px-4 py-2">Gender</th>
            <th className="px-4 py-2">Course</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr
              key={employee._id}
              className="text-center hover:bg-gray-100 border-b"
            >
              <td className="px-4 py-2">{employee.employeeName}</td>
              <td className="px-4 py-2">
                <img
                  src={
                    employee.employeeImage && employee.employeeImage !== ""
                      ? employee.employeeImage
                      : "https://via.placeholder.com/50"
                  }
                  alt="Employee"
                  className="w-12 h-12 object-cover rounded-full mx-auto"
                />
              </td>
              <td className="px-4 py-2">{employee.employeeEmail}</td>
              <td className="px-4 py-2">{employee.employeeMobile}</td>
              <td className="px-4 py-2">{employee.employeeDesignation}</td>
              <td className="px-4 py-2">{employee.employeeGender}</td>
              <td className="px-4 py-2">{employee.employeeCourses}</td>

              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => handleEdit(employee._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelectedEmployee(employee._id);
                    setDeleteModal(true);
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Employee Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow p-6 w-96">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Edit Employee
            </h3>
            <div>
              <label
                htmlFor="employeeName"
                className="block text-sm font-semibold text-gray-700"
              >
                Name
              </label>
              <input
                id="employeeName"
                type="text"
                value={employeeData.employeeName}
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    employeeName: e.target.value,
                  })
                }
                placeholder="Enter employee name"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="employeeEmail"
                className="block text-sm font-semibold text-gray-700"
              >
                Email
              </label>
              <input
                id="employeeEmail"
                type="email"
                value={employeeData.employeeEmail}
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    employeeEmail: e.target.value,
                  })
                }
                placeholder="Enter employee email"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="employeeMobile"
                className="block text-sm font-semibold text-gray-700"
              >
                Mobile
              </label>
              <input
                id="employeeMobile"
                type="text"
                value={employeeData.employeeMobile}
                onChange={(e) =>
                  setEmployeeData({
                    ...employeeData,
                    employeeMobile: e.target.value,
                  })
                }
                placeholder="Enter employee mobile"
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="employeeDesignation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Designation
                </label>
                <select
                  id="employeeDesignation"
                  name="employeeDesignation"
                  value={employeeData.employeeDesignation}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="HR">HR</option>
                  <option value="Manager">Manager</option>
                  <option value="Sales">Sales</option>
                  {/* Add more options if needed */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <div className="flex space-x-4 mt-1">
                  <label>
                    <input
                      type="radio"
                      name="employeeGender"
                      value="Male"
                      checked={employeeData.employeeGender === "Male"}
                      onChange={handleChange}
                      required
                      className="mr-2"
                    />
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="employeeGender"
                      value="Female"
                      checked={employeeData.employeeGender === "Female"}
                      onChange={handleChange}
                      required
                      className="mr-2"
                    />
                    Female
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="employeeGender"
                      value="Other"
                      checked={employeeData.employeeGender === "Other"}
                      onChange={handleChange}
                      required
                      className="mr-2"
                    />
                    Other
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="employeeCourses"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Course
                  </label>
                  <select
                    id="employeeCourses"
                    name="employeeCourses"
                    value={employeeData.employeeCourses}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="BSc">BSc</option>
                    <option value="BCom">BCom</option>
                    <option value="BCA">BCA</option>
                    {/* Add more options if needed */}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setEditModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow p-6 w-80">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Confirm Delete
            </h3>
            <p className="mb-4">
              Are you sure you want to delete this employee?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
