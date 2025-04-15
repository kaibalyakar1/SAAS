import React, { useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Calendar,
  DollarSign,
  Home,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  BarChart2,
  PieChart,
  Menu,
  X,
  MessageSquare,
  Check,
  X as XIcon,
  Clock,
} from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState("April");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' or 'complaints'
  const months = ["January", "February", "March", "April", "May", "June"];

  // Mock data for demonstrations
  const monthlyData = {
    January: { paid: 32, unpaid: 18, balance: 180000, expenses: 45000 },
    February: { paid: 35, unpaid: 15, balance: 200000, expenses: 50000 },
    March: { paid: 37, unpaid: 13, balance: 220000, expenses: 55000 },
    April: { paid: 38, unpaid: 12, balance: 238000, expenses: 60000 },
    May: { paid: 40, unpaid: 10, balance: 250000, expenses: 58000 },
    June: { paid: 42, unpaid: 8, balance: 270000, expenses: 62000 },
  };

  // Mock complaints data
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      houseNumber: "A-101",
      resident: "Kaibalya Kar",
      category: "Plumbing",
      description: "Water leakage in bathroom",
      status: "Pending",
      date: "2025-04-10",
      image: null,
    },
    {
      id: 2,
      houseNumber: "B-205",
      resident: "Rahul Sharma",
      category: "Electrical",
      description: "Power socket not working",
      status: "Resolved",
      date: "2025-04-05",
      image: null,
    },
    {
      id: 3,
      houseNumber: "C-302",
      resident: "Priya Patel",
      category: "Cleaning",
      description: "Garbage not being collected regularly",
      status: "In Progress",
      date: "2025-04-12",
      image: null,
    },
    {
      id: 4,
      houseNumber: "D-104",
      resident: "Amit Singh",
      category: "Security",
      description: "Broken CCTV camera near parking",
      status: "Pending",
      date: "2025-04-15",
      image: null,
    },
  ]);

  const currentData = monthlyData[selectedMonth];

  // Data for Payment Status Chart
  const paymentStatusData = {
    labels: ["Paid", "Unpaid"],
    datasets: [
      {
        data: [currentData.paid, currentData.unpaid],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderColor: ["#16a34a", "#dc2626"],
        borderWidth: 1,
      },
    ],
  };

  // Data for Monthly Collection Trend
  const monthlyCollectionData = {
    labels: months,
    datasets: [
      {
        label: "Total Collection (₹)",
        data: months.map((month) => monthlyData[month].balance),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Data for Expenses Breakdown
  const expensesData = {
    labels: ["Maintenance", "Utilities", "Security", "Cleaning", "Repairs"],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          "#3b82f6",
          "#8b5cf6",
          "#ec4899",
          "#f97316",
          "#14b8a6",
        ],
      },
    ],
  };

  // Data for Monthly Income vs Expenses
  const incomeVsExpensesData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: months.map((month) => monthlyData[month].balance),
        backgroundColor: "rgba(34, 197, 94, 0.7)",
      },
      {
        label: "Expenses",
        data: months.map((month) => monthlyData[month].expenses),
        backgroundColor: "rgba(239, 68, 68, 0.7)",
      },
    ],
  };

  // Data for Complaints Status Chart
  const complaintsStatusData = {
    labels: ["Resolved", "In Progress", "Pending"],
    datasets: [
      {
        data: [
          complaints.filter((c) => c.status === "Resolved").length,
          complaints.filter((c) => c.status === "In Progress").length,
          complaints.filter((c) => c.status === "Pending").length,
        ],
        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
        borderColor: ["#16a34a", "#d97706", "#dc2626"],
        borderWidth: 1,
      },
    ],
  };

  // Data for Complaints by Category
  const complaintsCategoryData = {
    labels: ["Plumbing", "Electrical", "Cleaning", "Security", "Other"],
    datasets: [
      {
        data: [
          complaints.filter((c) => c.category === "Plumbing").length,
          complaints.filter((c) => c.category === "Electrical").length,
          complaints.filter((c) => c.category === "Cleaning").length,
          complaints.filter((c) => c.category === "Security").length,
          complaints.filter(
            (c) =>
              !["Plumbing", "Electrical", "Cleaning", "Security"].includes(
                c.category
              )
          ).length,
        ],
        backgroundColor: [
          "#3b82f6",
          "#8b5cf6",
          "#ec4899",
          "#f97316",
          "#14b8a6",
        ],
      },
    ],
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const updateComplaintStatus = (id, status) => {
    setComplaints(
      complaints.map((complaint) =>
        complaint.id === id ? { ...complaint, status } : complaint
      )
    );
  };

  const renderDashboardContent = () => (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-0">
          Administration Dashboard
        </h1>

        {/* Month Selector */}
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <Calendar size={18} />
          <select
            className="bg-white border rounded px-2 md:px-3 py-1"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month} 2025
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-blue-500">
          <div className="flex justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Total Houses</p>
              <p className="text-xl md:text-2xl font-bold">
                {currentData.paid + currentData.unpaid}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Home size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-green-500">
          <div className="flex justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Paid</p>
              <p className="text-xl md:text-2xl font-bold text-green-600">
                {currentData.paid}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-red-500">
          <div className="flex justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Unpaid</p>
              <p className="text-xl md:text-2xl font-bold text-red-600">
                {currentData.unpaid}
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-indigo-500">
          <div className="flex justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">
                Current Balance
              </p>
              <p className="text-xl md:text-2xl font-bold text-indigo-600">
                ₹{(currentData.balance / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="p-2 bg-indigo-100 rounded-full">
              <DollarSign size={20} className="text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Payment Status Chart */}
        <div className="bg-white p-3 md:p-4 shadow rounded-lg">
          <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4">
            Payment Status ({selectedMonth} 2025)
          </h2>
          <div className="h-48 md:h-64">
            <Pie
              data={paymentStatusData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Monthly Collection Trend */}
        <div className="bg-white p-3 md:p-4 shadow rounded-lg">
          <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4">
            Collection Trend
          </h2>
          <div className="h-48 md:h-64">
            <Line
              data={monthlyCollectionData}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Income vs Expenses */}
        <div className="bg-white p-3 md:p-4 shadow rounded-lg">
          <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4">
            Income vs Expenses
          </h2>
          <div className="h-48 md:h-64">
            <Bar
              data={incomeVsExpensesData}
              options={{
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </div>

        {/* Expenses Breakdown */}
        <div className="bg-white p-3 md:p-4 shadow rounded-lg">
          <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4">
            Expenses Breakdown
          </h2>
          <div className="h-48 md:h-64">
            <Pie data={expensesData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="bg-white p-3 md:p-4 shadow rounded-lg mt-4 md:mt-6">
        <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4">
          Recent Payments
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-2 md:px-4 text-left">House No.</th>
                <th className="py-2 px-2 md:px-4 text-left">Owner</th>
                <th className="py-2 px-2 md:px-4 text-left">Amount</th>
                <th className="py-2 px-2 md:px-4 text-left">Date</th>
                <th className="py-2 px-2 md:px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2 px-2 md:px-4">A-201</td>
                <td className="py-2 px-2 md:px-4">Rahul Sharma</td>
                <td className="py-2 px-2 md:px-4">₹5,000</td>
                <td className="py-2 px-2 md:px-4">10 Apr 2025</td>
                <td className="py-2 px-2 md:px-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    Paid
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2 md:px-4">B-102</td>
                <td className="py-2 px-2 md:px-4">Priya Patel</td>
                <td className="py-2 px-2 md:px-4">₹5,000</td>
                <td className="py-2 px-2 md:px-4">8 Apr 2025</td>
                <td className="py-2 px-2 md:px-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    Paid
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2 md:px-4">C-304</td>
                <td className="py-2 px-2 md:px-4">Amit Singh</td>
                <td className="py-2 px-2 md:px-4">₹5,000</td>
                <td className="py-2 px-2 md:px-4">--</td>
                <td className="py-2 px-2 md:px-4">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                    Unpaid
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-2 md:px-4">D-105</td>
                <td className="py-2 px-2 md:px-4">Neha Gupta</td>
                <td className="py-2 px-2 md:px-4">₹5,000</td>
                <td className="py-2 px-2 md:px-4">5 Apr 2025</td>
                <td className="py-2 px-2 md:px-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    Paid
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderComplaintsContent = () => (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-0">
          Complaints Management
        </h1>
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <MessageSquare size={18} />
          <span className="text-sm">Total Complaints: {complaints.length}</span>
        </div>
      </div>

      {/* Complaints Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-green-500">
          <div className="flex justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Resolved</p>
              <p className="text-xl md:text-2xl font-bold text-green-600">
                {complaints.filter((c) => c.status === "Resolved").length}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <Check size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-yellow-500">
          <div className="flex justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">In Progress</p>
              <p className="text-xl md:text-2xl font-bold text-yellow-600">
                {complaints.filter((c) => c.status === "In Progress").length}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <Clock size={20} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-red-500">
          <div className="flex justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Pending</p>
              <p className="text-xl md:text-2xl font-bold text-red-600">
                {complaints.filter((c) => c.status === "Pending").length}
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-blue-500">
          <div className="flex justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">New Today</p>
              <p className="text-xl md:text-2xl font-bold text-blue-600">2</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <MessageSquare size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Complaints Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Complaints Status Chart */}
        <div className="bg-white p-3 md:p-4 shadow rounded-lg">
          <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4">
            Complaints Status
          </h2>
          <div className="h-48 md:h-64">
            <Pie
              data={complaintsStatusData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Complaints by Category */}
        <div className="bg-white p-3 md:p-4 shadow rounded-lg">
          <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4">
            Complaints by Category
          </h2>
          <div className="h-48 md:h-64">
            <Pie
              data={complaintsCategoryData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white p-3 md:p-4 shadow rounded-lg mt-4 md:mt-6">
        <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4">
          All Complaints
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-2 md:px-4 text-left">Date</th>
                <th className="py-2 px-2 md:px-4 text-left">House No.</th>
                <th className="py-2 px-2 md:px-4 text-left">Category</th>
                <th className="py-2 px-2 md:px-4 text-left">Description</th>
                <th className="py-2 px-2 md:px-4 text-left">Status</th>
                <th className="py-2 px-2 md:px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {complaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td className="py-2 px-2 md:px-4">{complaint.date}</td>
                  <td className="py-2 px-2 md:px-4">{complaint.houseNumber}</td>
                  <td className="py-2 px-2 md:px-4">{complaint.category}</td>
                  <td className="py-2 px-2 md:px-4">
                    <div className="line-clamp-1" title={complaint.description}>
                      {complaint.description}
                    </div>
                  </td>
                  <td className="py-2 px-2 md:px-4">
                    {complaint.status === "Resolved" && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Resolved
                      </span>
                    )}
                    {complaint.status === "In Progress" && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                        In Progress
                      </span>
                    )}
                    {complaint.status === "Pending" && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2 md:px-4">
                    <div className="flex space-x-1">
                      <button
                        onClick={() =>
                          updateComplaintStatus(complaint.id, "Resolved")
                        }
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Mark as Resolved"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() =>
                          updateComplaintStatus(complaint.id, "In Progress")
                        }
                        className="p-1 text-yellow-600 hover:text-yellow-800"
                        title="Mark as In Progress"
                      >
                        <Clock size={16} />
                      </button>
                      <button
                        onClick={() =>
                          updateComplaintStatus(complaint.id, "Pending")
                        }
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Mark as Pending"
                      >
                        <XIcon size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Society Admin</h1>
        <button onClick={toggleSidebar} className="p-1">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - Fixed on desktop, slide-in on mobile */}
      <div
        className={`
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
        transform transition-transform duration-300 ease-in-out
        w-64 bg-indigo-800 text-white p-4 fixed md:relative z-30 h-full
      `}
      >
        <div className="hidden md:block">
          <h1 className="text-2xl font-bold mb-8 text-center">Society Admin</h1>
        </div>

        <nav>
          <ul className="space-y-2">
            <li
              className={`${
                activeTab === "dashboard"
                  ? "bg-indigo-900"
                  : "hover:bg-indigo-700"
              } rounded p-2 flex items-center cursor-pointer`}
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart2 className="mr-2" size={18} />
              <span>Dashboard</span>
            </li>
            <li className="hover:bg-indigo-700 rounded p-2 flex items-center">
              <Home className="mr-2" size={18} />
              <span>Properties</span>
            </li>
            <li className="hover:bg-indigo-700 rounded p-2 flex items-center">
              <DollarSign className="mr-2" size={18} />
              <span>Payments</span>
            </li>
            <li className="hover:bg-indigo-700 rounded p-2 flex items-center">
              <TrendingUp className="mr-2" size={18} />
              <span>Expenses</span>
            </li>
            <li
              className={`${
                activeTab === "complaints"
                  ? "bg-indigo-900"
                  : "hover:bg-indigo-700"
              } rounded p-2 flex items-center cursor-pointer`}
              onClick={() => setActiveTab("complaints")}
            >
              <AlertTriangle className="mr-2" size={18} />
              <span>Complaints</span>
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {complaints.filter((c) => c.status === "Pending").length}
              </span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-auto md:ml-0 w-full">
        {activeTab === "dashboard"
          ? renderDashboardContent()
          : renderComplaintsContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
