import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Logout from Admin Dashboard?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0ea5e9",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/login");
        Swal.fire("Logged out!", "", "success");
      }
    });
  };

  return (
    <div className="w-64 h-full bg-gray-900 text-white flex flex-col justify-between fixed md:static z-50">
      <div>
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Admin Panel</h2>
        </div>
        <ul className="mt-4 space-y-2">
          <li className="px-6 py-3 hover:bg-gray-700 cursor-pointer">
            Dashboard
          </li>
          <li className="px-6 py-3 hover:bg-gray-700 cursor-pointer">
            Payments
          </li>
          <li className="px-6 py-3 hover:bg-gray-700 cursor-pointer">
            Reports
          </li>
        </ul>
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

export default AdminSidebar;
