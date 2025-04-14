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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
            <li className="bg-indigo-900 rounded p-2 flex items-center">
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
            <li className="hover:bg-indigo-700 rounded p-2 flex items-center">
              <AlertTriangle className="mr-2" size={18} />
              <span>Complaints</span>
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
              <Pie
                data={expensesData}
                options={{ maintainAspectRatio: false }}
              />
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
      </div>
    </div>
  );
};

export default AdminDashboard;
