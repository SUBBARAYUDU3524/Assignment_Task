import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SignupImage from "../src/assets/signup.avif";
import { useNavigate } from "react-router-dom";
const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/signup",
        formData
      );
      setMessage(response.data.message);
      setFormData({ name: "", email: "", password: "" });
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6">
      <div>
        <motion.h1
          className="text-4xl font-bold text-white mb-8 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 1 } }}
        >
          Welcome to the Signup Form
        </motion.h1>
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-xl overflow-hidden lg:w-[800px]">
          {/* Left Side - Image */}
          <motion.div
            className="w-full md:w-1/2 h-[520px] flex items-center justify-center bg-white"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.6 } }}
          >
            <img
              src={SignupImage}
              alt="Signup Illustration"
              className="w-full h-auto object-cover"
            />
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 h-[520px] p-8 lg:p-10 bg-white"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.6 } }}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Sign Up Here...
            </h2>
            {message && (
              <p className="text-green-600 mb-4 font-semibold">{message}</p>
            )}
            {error && (
              <p className="text-red-600 mb-4 font-semibold">{error}</p>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-md font-medium text-gray-700 pb-1"
                >
                  Enter Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-md font-medium text-gray-700 pb-1"
                >
                  Enter Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-md font-medium text-gray-700 pb-1"
                >
                  Enter Your Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-pink-500 text-white py-3 px-4 rounded-md shadow-md hover:bg-pink-600 transition duration-300"
              >
                Sign Up
              </button>
              <p className="mt-4 text-md text-center text-gray-600">
                Already have an account?{" "}
                <Link to="/" className="text-pink-600 hover:underline">
                  Please Login
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
