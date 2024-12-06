import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, setProfile] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    navigate("/");
    console.log("Logged out");
  };
  console.log(profile);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/employees/myprofile",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request header
            },
          }
        );
        setProfile(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center shadow-lg">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="text-white font-bold text-2xl">BrandLogo</div>
      </div>

      <div className="hidden md:flex space-x-8 text-xl">
        <a
          href="/employee-list"
          className="text-white hover:text-yellow-400 transition-colors"
        >
          Employee List
        </a>
        <a
          href="/create-employee"
          className="text-white hover:text-yellow-400 transition-colors"
        >
          Create Employee
        </a>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-white text-lg">{profile.name}</span>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <FaBars size={24} />
      </button>

      {/* Mobile Menu (responsive) */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-gray-800 text-white flex flex-col items-center p-4 space-y-4">
          <a
            href="/employee-list"
            className="hover:text-yellow-400 transition-colors"
          >
            Employee List
          </a>
          <a
            href="/create-employee"
            className="hover:text-yellow-400 transition-colors"
          >
            Create Employee
          </a>
          <div className="flex items-center space-x-4">
            {/* Display user's name */}
            <span>{user ? user.name : "Guest"}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
