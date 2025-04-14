import React, { useState } from "react";
import Sidebar from "./Sidebar";
import UserDashboard from "./UserDashboard";

const Dashboard = () => {
  const username = localStorage.getItem("username") || "User";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex ">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? "block" : "hidden"} md:block`}>
        <Sidebar
          username={username}
          closeSidebar={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-100">
        {/* Topbar */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white shadow">
          <button
            onClick={toggleSidebar}
            className="text-gray-800 focus:outline-none"
          >
            ☰
          </button>
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>

        <div className="p-6">
          <UserDashboard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
