import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [profile, setProfile] = useState({}); // Initialize as an empty object
  const [loading, setLoading] = useState(true); // Add a loading state

  const token = localStorage.getItem("token"); // Retrieve token from localStorage or other secure storage

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
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false); // Set loading to false once the data is fetched or on error
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <h1 className="text-2xl font-semibold">Loading your profile...</h1>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-center h-96">
        <h1 className="text-4xl font-bold text-center">
          Welcome to the Dashboard, {profile.name || "User"}!
        </h1>
      </div>
    </div>
  );
};

export default Dashboard;
