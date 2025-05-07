import React, { useState, useEffect } from "react";
import {
  BarChart2,
  Home,
  DollarSign,
  Menu,
  AlertTriangle,
  TrendingUp,
  X as XIcon,
  LogOut,
  Home as HomeIcon,
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

const AdminSidebar = ({ activeComponent, setActiveComponent, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: <BarChart2 size={20} /> },
    { id: "properties", name: "Properties", icon: <Home size={20} /> },
    { id: "expenses", name: "Expenses", icon: <TrendingUp size={20} /> },
    { id: "income", name: "Income", icon: <DollarSign size={20} /> },
    { id: "payments", name: "Payments", icon: <DollarSign size={20} /> },
    { id: "complaints", name: "Complaints", icon: <AlertTriangle size={20} /> },
  ];

  useEffect(() => {
    if (windowWidth < 768) {
      setCollapsed(true);
    }
  }, [windowWidth]);

  const handleNavigation = (id) => {
    setActiveComponent(id);
    if (windowWidth < 768) {
      setMobileOpen(false);
    }
  };

  // Calculate sidebar width
  const sidebarWidth = collapsed ? "w-20" : "w-64";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar - Fixed position on left side */}
      <div
        className={`hidden md:flex flex-col bg-indigo-800 text-white h-screen fixed top-0 left-0 shadow-xl z-50 transition-all duration-300 ${sidebarWidth}`}
      >
        <div className="flex justify-between items-center p-4 border-b border-indigo-700">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-full hover:bg-indigo-700 focus:outline-none"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
          {!collapsed && (
            <h2 className="text-xl font-bold truncate">Society Admin</h2>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.id)}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    activeComponent === item.id
                      ? "bg-indigo-900 text-white"
                      : "text-indigo-100 hover:bg-indigo-700"
                  }`}
                >
                  <span className={collapsed ? "mx-auto" : "mr-3"}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="text-sm font-medium truncate">
                      {item.name}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-indigo-700 space-y-2">
          <button
            onClick={() => navigate("/")}
            className={`flex items-center w-full p-3 rounded-lg text-indigo-100 hover:bg-indigo-700 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <HomeIcon size={18} />
            {!collapsed && (
              <span className="ml-3 text-sm font-medium">Home</span>
            )}
          </button>
          <button
            onClick={() => navigate("/")}
            className={`flex items-center w-full p-3 rounded-lg text-indigo-100 hover:bg-indigo-700 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={18} />
            {!collapsed && (
              <span className="ml-3 text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>

      {/* Main content area with padding to prevent overlap */}
      <div
        className={`flex-1 overflow-auto ${
          windowWidth >= 768 ? `ml-${collapsed ? "20" : "64"}` : ""
        }`}
      >
        {/* Mobile Menu Button */}
        <div className="md:hidden fixed top-6 right-4 top- z-50 ">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 bg-indigo-700 text-white rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <XIcon size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Content with padding to prevent sidebar overlap */}
        <div className="h-full w-full px-4">{children}</div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-indigo-800 text-white z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-indigo-700">
                <h2 className="text-xl font-bold">Society Admin</h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded-full hover:bg-indigo-700 focus:outline-none"
                ></button>
              </div>

              <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-2">
                  {menuItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleNavigation(item.id)}
                        className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                          activeComponent === item.id
                            ? "bg-indigo-900 text-white"
                            : "text-indigo-100 hover:bg-indigo-700"
                        }`}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span className="text-sm font-medium">{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="p-4 border-t border-indigo-700 space-y-2">
                <button
                  onClick={() => {
                    navigate("/");
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 w-full p-3 rounded-lg text-indigo-100 hover:bg-indigo-700"
                >
                  <HomeIcon size={18} />
                  <span className="text-sm font-medium">Home</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/");
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 w-full p-3 rounded-lg text-indigo-100 hover:bg-indigo-700"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminSidebar;
