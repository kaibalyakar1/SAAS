import {
  AlertTriangle,
  Calendar,
  DollarSign,
  Edit,
  Home,
  Plus,
  Trash,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Line, Pie } from "react-chartjs-2";

const ExpensesComponent = () => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("April");
  const months = ["January", "February", "March", "April", "May", "June"];

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      category: "Maintenance",
      amount: 25000,
      date: "2025-04-05",
      description: "Monthly general maintenance",
    },
    {
      id: 2,
      category: "Utilities",
      amount: 18000,
      date: "2025-04-08",
      description: "Electricity and water bills",
    },
    {
      id: 3,
      category: "Security",
      amount: 15000,
      date: "2025-04-10",
      description: "Security staff salaries",
    },
    {
      id: 4,
      category: "Cleaning",
      amount: 12000,
      date: "2025-04-12",
      description: "Cleaning services and supplies",
    },
    {
      id: 5,
      category: "Repairs",
      amount: 8000,
      date: "2025-04-15",
      description: "Repairs to common areas",
    },
  ]);

  const [newExpense, setNewExpense] = useState({
    category: "Maintenance",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const monthlyExpenseData = {
    January: 65000,
    February: 70000,
    March: 75000,
    April: 78000,
    May: 72000,
    June: 80000,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setExpenses((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        ...newExpense,
        amount: parseFloat(newExpense.amount),
      },
    ]);
    setShowExpenseForm(false);
    setNewExpense({
      category: "Maintenance",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
  };

  // Data for expenses breakdown
  const expensesData = {
    labels: ["Maintenance", "Utilities", "Security", "Cleaning", "Repairs"],
    datasets: [
      {
        data: [
          expenses
            .filter((e) => e.category === "Maintenance")
            .reduce((sum, e) => sum + e.amount, 0),
          expenses
            .filter((e) => e.category === "Utilities")
            .reduce((sum, e) => sum + e.amount, 0),
          expenses
            .filter((e) => e.category === "Security")
            .reduce((sum, e) => sum + e.amount, 0),
          expenses
            .filter((e) => e.category === "Cleaning")
            .reduce((sum, e) => sum + e.amount, 0),
          expenses
            .filter((e) => e.category === "Repairs")
            .reduce((sum, e) => sum + e.amount, 0),
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

  // Data for monthly expenses trend
  const monthlyExpensesData = {
    labels: months,
    datasets: [
      {
        label: "Monthly Expenses (₹)",
        data: months.map((month) => monthlyExpenseData[month]),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-0">
          Expenses Management
        </h1>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 mr-2">
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

          <button
            onClick={() => setShowExpenseForm(!showExpenseForm)}
            className="bg-blue-600 text-white px-3 py-2 rounded-md flex items-center text-sm"
          >
            <Plus size={16} className="mr-1" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-red-500">
          <div className="flex justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">
                Total Expenses ({selectedMonth})
              </p>
              <p className="text-xl md:text-2xl font-bold text-red-600">
                ₹
                {(
                  expenses.reduce((sum, e) => sum + e.amount, 0) / 1000
                ).toFixed(0)}
                K
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <DollarSign size={20} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-blue-500">
          <div className="flex justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Maintenance</p>
              <p className="text-xl md:text-2xl font-bold text-blue-600">
                ₹
                {(
                  expenses
                    .filter((e) => e.category === "Maintenance")
                    .reduce((sum, e) => sum + e.amount, 0) / 1000
                ).toFixed(0)}
                K
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Home size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-purple-500">
          <div className="flex justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Utilities</p>
              <p className="text-xl md:text-2xl font-bold text-purple-600">
                ₹
                {(
                  expenses
                    .filter((e) => e.category === "Utilities")
                    .reduce((sum, e) => sum + e.amount, 0) / 1000
                ).toFixed(0)}
                K
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <AlertTriangle size={20} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-green-500">
          <div className="flex justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Monthly Change</p>
              <p className="text-xl md:text-2xl font-bold text-green-600">
                +4%
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp size={20} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Form */}
      {showExpenseForm && (
        <div className="bg-white p-4 shadow rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Expense</h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={newExpense.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Maintenance">Maintenance</option>
                <option value="Utilities">Utilities</option>
                <option value="Security">Security</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Repairs">Repairs</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                name="amount"
                required
                value={newExpense.amount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={newExpense.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={newExpense.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-2 mt-2">
              <button
                type="button"
                onClick={() => setShowExpenseForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Expense
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Expenses Breakdown */}
        <div className="bg-white p-3 md:p-4 shadow rounded-lg">
          <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4">
            Expenses Breakdown
          </h2>
          <div className="h-48 md:h-64">
            <Pie data={expensesData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Monthly Expenses Trend */}
        <div className="bg-white p-3 md:p-4 shadow rounded-lg">
          <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4">
            Monthly Expenses Trend
          </h2>
          <div className="h-48 md:h-64">
            <Line
              data={monthlyExpensesData}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Expense Records</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="py-2 px-4">{expense.date}</td>
                  <td className="py-2 px-4">{expense.category}</td>
                  <td className="py-2 px-4">
                    ₹{expense.amount.toLocaleString()}
                  </td>
                  <td className="py-2 px-4">{expense.description}</td>
                  <td className="py-2 px-4">
                    <div className="flex space-x-1">
                      <button
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpensesComponent;
