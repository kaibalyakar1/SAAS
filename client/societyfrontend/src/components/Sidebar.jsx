import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Sidebar = ({ user, closeSidebar }) => {
  const navigate = useNavigate();
  console.log("Sidebar user:", user);
  const { ownerName } = user;
  const url = import.meta.env.VITE_API_URL;
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to logout!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0ea5e9",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");

        // Call the logout API endpoint
        const response = await fetch(`${url}/api/v1/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Logout failed");
        }

        // Clear client-side storage
        localStorage.clear();

        // Redirect to login/signup page
        navigate("/signup");

        Swal.fire("Logged out!", "You have been logged out.", "success");
      } catch (error) {
        console.error("Logout error:", error);
        // Even if API logout fails, clear client-side and redirect
        localStorage.clear();
        navigate("/signup");
        Swal.fire("Logged out!", "You have been logged out.", "success");
      }
    }
  };

  const redirectToConstruction = () => {
    navigate("/under-construction");
    closeSidebar?.(); // close on mobile after click
  };

  return (
    <div className="w-64 h-50 bg-gray-800 text-white flex flex-col justify-between fixed md:static z-50">
      <div>
        {/* Close btn only for mobile */}
        <div className="md:hidden p-4 flex justify-end">
          <button onClick={closeSidebar} className="text-white text-xl">
            ✕
          </button>
        </div>

        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Welcome, {ownerName}</h2>
        </div>
      </div>

      <div className="p-6 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
