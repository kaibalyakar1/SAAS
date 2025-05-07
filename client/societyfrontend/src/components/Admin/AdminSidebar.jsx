import React, { useState } from "react";
import {
  BarChart2,
  Home,
  DollarSign,
  Menu,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  X as XIcon,
  LogOut,
  HomeIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChevronLeft = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const AdminSidebar = ({ activeComponent, setActiveComponent }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: <BarChart2 size={20} /> },
    { id: "properties", name: "Properties", icon: <Home size={20} /> },
    { id: "expenses", name: "Expenses", icon: <TrendingUp size={20} /> },
    { id: "income", name: "Income", icon: <DollarSign size={20} /> },
    { id: "payments", name: "Payments", icon: <DollarSign size={20} /> },
    { id: "complaints", name: "Complaints", icon: <AlertTriangle size={20} /> },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden p-4 fixed top-0 left-0 z-30">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 bg-indigo-700 text-white rounded-md shadow"
        >
          {mobileOpen ? <XIcon size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
          <div className="bg-indigo-800 w-64 text-white h-full p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Society Admin</h2>
              <button onClick={() => setMobileOpen(false)}>
                <XIcon />
              </button>
            </div>
            <ul>
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveComponent(item.id);
                      setMobileOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full p-2 rounded ${
                      activeComponent === item.id
                        ? "bg-indigo-900"
                        : "hover:bg-indigo-700"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-indigo-600">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 w-full py-2 px-3 hover:bg-indigo-700 rounded"
              >
                <LogOut size={18} />
                Logout
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 w-full py-2 px-3 hover:bg-indigo-700 rounded"
              >
                <HomeIcon size={18} />
                Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col bg-indigo-800 text-white h-screen shadow-lg z-10 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-indigo-700">
          {!collapsed && <h2 className="text-xl font-bold">Society Admin</h2>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-indigo-700 p-2 rounded"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id} className="px-3">
                <button
                  onClick={() => setActiveComponent(item.id)}
                  className={`flex items-center w-full p-3 rounded-md ${
                    activeComponent === item.id
                      ? "bg-indigo-900"
                      : "hover:bg-indigo-700"
                  }`}
                >
                  <span className={collapsed ? "mx-auto" : "mr-3"}>
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.name}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-indigo-700 space-y-2">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 w-full p-2 hover:bg-indigo-700 rounded"
          >
            <LogOut size={18} />
            {!collapsed && "Logout"}
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 w-full p-2 hover:bg-indigo-700 rounded"
          >
            <HomeIcon size={18} />
            {!collapsed && "Home"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
