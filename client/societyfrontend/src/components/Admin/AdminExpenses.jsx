import {
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Edit,
  Home,
  Plus,
  Trash,
  TrendingUp,
  X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Line, Pie } from "react-chartjs-2";

const ExpensesComponent = () => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calendar modal state
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  // States for expense data
  const [expenses, setExpenses] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [totalAllExpense, setTotalAllExpense] = useState(0);
  const [monthlyTotals, setMonthlyTotals] = useState({});

  const [newExpense, setNewExpense] = useState({
    category: "Maintenance",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  // Current expense being edited
  const [editExpense, setEditExpense] = useState(null);
  const url = import.meta.env.VITE_API_URL;

  // Generate month names for display
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const selectedMonth = months[selectedDate.month];

  // Format month as YYYY-MM for API calls
  const formatMonthForAPI = (month, year) => {
    return `${year}-${(month + 1).toString().padStart(2, "0")}`;
  };

  // Fetch expenses for specific month
  const fetchMonthlyExpenses = async (month, year) => {
    try {
      const response = await fetch(
        `${url}/api/v1/expense/get/${formatMonthForAPI(month, year)}`
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setMonthlyExpenses(data);

      // Calculate total for this month
      const monthTotal = data.reduce(
        (sum, expense) => sum + (expense.amount || 0),
        0
      );
      setMonthlyTotals((prev) => ({
        ...prev,
        [formatMonthForAPI(month, year)]: monthTotal,
      }));

      return monthTotal;
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch monthly expenses:", err);
      return 0;
    }
  };

  // Fetch total expenses
  const fetchTotalExpenses = async () => {
    try {
      const response = await fetch(`${url}/api/v1/expense/sum}`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setTotalAllExpense(data);
    } catch (err) {
      console.error("Failed to fetch total expenses:", err);
    }
  };

  // Load data when month/year changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchMonthlyExpenses(selectedDate.month, selectedDate.year),
          fetchTotalExpenses(),
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedDate.month, selectedDate.year]);

  // Handle month/year selection from calendar
  const handleDateSelect = (month, year) => {
    setSelectedDate({ month, year });
    setShowCalendar(false);
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Calculate month-over-month change
  const calculateMonthlyChange = () => {
    const currentKey = formatMonthForAPI(selectedDate.month, selectedDate.year);
    const currentTotal = monthlyTotals[currentKey] || 0;

    // Get previous month
    let prevMonth = selectedDate.month - 1;
    let prevYear = selectedDate.year;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }

    const prevKey = formatMonthForAPI(prevMonth, prevYear);
    const prevTotal = monthlyTotals[prevKey] || 0;

    if (prevTotal === 0) return 0;

    return (((currentTotal - prevTotal) / prevTotal) * 100).toFixed(1);
  };

  const monthlyChange = calculateMonthlyChange();

  // Generate data for charts (last 6 months)
  const getChartData = () => {
    const labels = [];
    const data = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(selectedDate.month - i);
      if (date.getFullYear() !== selectedDate.year) {
        date.setFullYear(selectedDate.year - 1);
      }

      const month = date.getMonth();
      const year = date.getFullYear();
      const key = formatMonthForAPI(month, year);

      labels.push(`${months[month]} ${year}`);
      data.push(monthlyTotals[key] || 0);
    }

    return { labels, data };
  };

  const chartData = getChartData();

  // Data for expenses breakdown
  const expensesData = {
    labels: [
      "Maintenance",
      "Utilities",
      "Security",
      "Cleaning",
      "Repairs",
      "Other",
    ],
    datasets: [
      {
        data: [
          monthlyExpenses
            .filter((e) => e.category === "Maintenance")
            .reduce((sum, e) => sum + e.amount, 0),
          monthlyExpenses
            .filter((e) => e.category === "Utilities")
            .reduce((sum, e) => sum + e.amount, 0),
          monthlyExpenses
            .filter((e) => e.category === "Security")
            .reduce((sum, e) => sum + e.amount, 0),
          monthlyExpenses
            .filter((e) => e.category === "Cleaning")
            .reduce((sum, e) => sum + e.amount, 0),
          monthlyExpenses
            .filter((e) => e.category === "Repairs")
            .reduce((sum, e) => sum + e.amount, 0),
          monthlyExpenses
            .filter((e) => e.category === "Other")
            .reduce((sum, e) => sum + e.amount, 0),
        ],
        backgroundColor: [
          "#3b82f6",
          "#8b5cf6",
          "#ec4899",
          "#f97316",
          "#14b8a6",
          "#6b7280",
        ],
      },
    ],
  };

  // Data for monthly expenses trend
  const monthlyExpensesData = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Monthly Expenses (₹)",
        data: chartData.data,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Get current month total
  const currentMonthTotal =
    monthlyTotals[formatMonthForAPI(selectedDate.month, selectedDate.year)] ||
    0;

  // Calendar modal component
  const CalendarModal = () => {
    const [viewYear, setViewYear] = useState(selectedDate.year);
    const currentYear = new Date().getFullYear();
    // Generate array of years (current year ± 10 years)
    const yearRange = Array.from(
      { length: 21 },
      (_, i) => currentYear - 10 + i
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div
          ref={calendarRef}
          className="bg-white rounded-lg shadow-lg w-72 p-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Select Month & Year</h3>
            <button
              onClick={() => setShowCalendar(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() =>
                setViewYear((prev) => Math.max(prev - 1, currentYear - 10))
              }
              className="p-1 rounded-full hover:bg-gray-100"
              disabled={viewYear <= currentYear - 10}
            >
              <ChevronLeft
                size={20}
                className={
                  viewYear <= currentYear - 10
                    ? "text-gray-300"
                    : "text-gray-700"
                }
              />
            </button>

            <select
              value={viewYear}
              onChange={(e) => setViewYear(parseInt(e.target.value))}
              className="p-1 border rounded text-center"
            >
              {yearRange.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                setViewYear((prev) => Math.min(prev + 1, currentYear + 10))
              }
              className="p-1 rounded-full hover:bg-gray-100"
              disabled={viewYear >= currentYear + 10}
            >
              <ChevronRight
                size={20}
                className={
                  viewYear >= currentYear + 10
                    ? "text-gray-300"
                    : "text-gray-700"
                }
              />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => (
              <button
                key={month}
                onClick={() => handleDateSelect(index, viewYear)}
                className={`py-2 px-1 rounded text-sm ${
                  selectedDate.month === index && selectedDate.year === viewYear
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {month.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Fetch all expenses (for the table)
  const fetchAllExpenses = async () => {
    try {
      const response = await fetch(`${url}/api/v1/expense/all}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      console.error("Failed to fetch all expenses:", err);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchMonthlyExpenses(selectedDate.month, selectedDate.year),
          fetchTotalExpenses(),
          fetchAllExpenses(),
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new expense
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${url}/api/v1/expense/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newExpense,
          amount: parseFloat(newExpense.amount),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Refresh data
      await Promise.all([
        fetchMonthlyExpenses(selectedDate.month, selectedDate.year),
        fetchTotalExpenses(),
        fetchAllExpenses(),
      ]);

      // Reset form
      setShowExpenseForm(false);
      setNewExpense({
        category: "Maintenance",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
    } catch (err) {
      console.error("Failed to add expense:", err);
      setError(err.message);
    }
  };

  // Delete expense
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const response = await fetch(`${url}/api/v1/expense/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Refresh data
      await Promise.all([
        fetchMonthlyExpenses(selectedDate.month, selectedDate.year),
        fetchTotalExpenses(),
        fetchAllExpenses(),
      ]);
    } catch (err) {
      console.error("Failed to delete expense:", err);
      setError(err.message);
    }
  };

  // Set up expense for editing
  const handleEditClick = (expense) => {
    setEditExpense(expense._id || expense.id);
    setNewExpense({
      category: expense.category,
      amount: expense.amount.toString(),
      date: expense.date.split("T")[0],
      description: expense.description,
    });
    setShowExpenseForm(true);
  };

  // Update expense
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${url}/api/v1/expense/update/${editExpense}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newExpense,
            amount: parseFloat(newExpense.amount),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Refresh data
      await Promise.all([
        fetchMonthlyExpenses(selectedDate.month, selectedDate.year),
        fetchTotalExpenses(),
        fetchAllExpenses(),
      ]);

      // Reset form
      setShowExpenseForm(false);
      setEditExpense(null);
      setNewExpense({
        category: "Maintenance",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
    } catch (err) {
      console.error("Failed to update expense:", err);
      setError(err.message);
    }
  };

  // Calculate total expenses for the selected month
  const calculateMonthlyExpenses = (month) => {
    const monthNumber = months.indexOf(month) + 1;
    const monthExpenses = monthlyExpenses.filter((expense) => {
      if (!expense.date) return false;
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() + 1 === monthNumber;
    });
    return monthExpenses.reduce(
      (sum, expense) => sum + (expense.amount || 0),
      0
    );
  };

  // Get monthly expense data
  const getMonthlyData = () => {
    const monthlyData = {};
    months.forEach((month) => {
      monthlyData[month] = calculateMonthlyExpenses(month);
    });
    return monthlyData;
  };

  const monthlyData = getMonthlyData();

  // Get the total for the selected month
  const totalMonthlyExpense = monthlyData[selectedMonth] || 0;

  // Calculate totals by category for selected month
  const getCategoryTotal = (category) => {
    const monthNumber = months.indexOf(selectedMonth) + 1;
    return monthlyExpenses
      .filter((expense) => {
        if (!expense.date) return false;
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() + 1 === monthNumber &&
          expense.category === category
        );
      })
      .reduce((sum, expense) => sum + (expense.amount || 0), 0);
  };

  if (loading && expenses.length === 0) {
    return <div className="p-4 text-center">Loading expenses data...</div>;
  }

  if (error && expenses.length === 0) {
    return (
      <div className="p-4 text-center text-red-600">
        Error loading expenses: {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-0">
          Expenses Management
        </h1>

        <div className="flex items-center space-x-2">
          {/* Calendar Date Picker Button */}
          <button
            onClick={() => setShowCalendar(true)}
            className="bg-white flex items-center space-x-2 px-3 py-2 border rounded hover:bg-gray-50"
          >
            <Calendar size={16} />
            <span>
              {selectedMonth} {selectedDate.year}
            </span>
          </button>

          {/* Show Calendar Modal */}
          {showCalendar && <CalendarModal />}

          <button
            onClick={() => {
              setEditExpense(null);
              setNewExpense({
                category: "Maintenance",
                amount: "",
                date: new Date().toISOString().split("T")[0],
                description: "",
              });
              setShowExpenseForm(!showExpenseForm);
            }}
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
                ₹{totalMonthlyExpense.toFixed(0)}
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
              <p className="text-xs md:text-sm text-gray-500">All Time Total</p>
              <p className="text-xl md:text-2xl font-bold text-blue-600">
                ₹{totalAllExpense.toFixed(0)}
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
                ₹{(getCategoryTotal("Utilities") / 1000).toFixed(0)}K
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
                {monthlyChange > 0 ? "+" : ""}
                {monthlyChange}%
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp size={20} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Expense Form */}
      {showExpenseForm && (
        <div className="bg-white p-4 shadow rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editExpense ? "Edit Expense" : "Add New Expense"}
          </h2>
          <form
            onSubmit={editExpense ? handleUpdate : handleSubmit}
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
                {editExpense ? "Update Expense" : "Add Expense"}
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
        {loading && <p className="text-center py-4">Loading expenses...</p>}
        {error && <p className="text-center text-red-600 py-4">{error}</p>}

        {!loading && !error && (
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
                {monthlyExpenses.map((expense) => (
                  <tr key={expense._id || expense.id}>
                    <td className="py-2 px-4">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
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
                          onClick={() => handleEditClick(expense)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete"
                          onClick={() =>
                            handleDelete(expense._id || expense.id)
                          }
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {monthlyExpenses.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-500">
                      No expenses found for {selectedMonth}. Add your first
                      expense!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensesComponent;
