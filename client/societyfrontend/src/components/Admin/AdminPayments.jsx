import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  Circle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  // Status filter removed as we're only showing successful payments
  const [sortConfig, setSortConfig] = useState({
    key: "paymentDate",
    direction: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Monthly summary stats
  const [summary, setSummary] = useState({
    totalAmount: 0,
    pendingAmount: 0,
    successfulAmount: 0,
    failedAmount: 0,
    totalPayments: 0,
  });

  useEffect(() => {
    // Fetch payments data from API
    const fetchPayments = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch(`${url}/api/v1/payment/admin/all`);
        const data = await response.json();

        if (data.success) {
          setPayments(data.payments);
          calculateSummary(data.payments);
        } else {
          setError("Failed to fetch payments data");
        }
      } catch (err) {
        setError("Error connecting to the server");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const calculateSummary = (paymentData) => {
    const summary = paymentData.reduce(
      (acc, payment) => {
        acc.totalAmount += payment.amount;
        acc.totalPayments += 1;

        if (payment.status === "pending") {
          acc.pendingAmount += payment.amount;
        } else if (payment.status === "success") {
          acc.successfulAmount += payment.amount;
        } else if (payment.status === "failed") {
          acc.failedAmount += payment.amount;
        }

        return acc;
      },
      {
        totalAmount: 0,
        pendingAmount: 0,
        successfulAmount: 0,
        failedAmount: 0,
        totalPayments: 0,
      }
    );

    setSummary(summary);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Only showing success status with green color
  const getStatusIcon = () => {
    return <CheckCircle className="text-green-500" size={18} />;
  };

  const getStatusColor = () => {
    return "bg-green-100 text-green-800";
  };

  const handleExportCSV = () => {
    // Create CSV content
    const headers = [
      "House Number",
      "Amount",
      "Month",
      "Payment ID",
      "Status",
      "Payment Date",
    ];
    const csvRows = [
      headers.join(","),
      ...filteredPayments.map((payment) =>
        [
          payment.houseNumber,
          payment.amount,
          payment.month,
          payment.paymentId,
          payment.status,
          formatDate(payment.paymentDate),
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute(
      "download",
      `payments-export-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Filter and sort the payments
  const filteredPayments = payments
    .filter((payment) => {
      // Only show successful payments
      if (payment.status !== "success") return false;

      const matchesSearch =
        payment.houseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMonth = filterMonth ? payment.month === filterMonth : true;

      return matchesSearch && matchesMonth;
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Payments Dashboard
        </h1>

        {/* Summary Cards - Only showing successful payments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <h3 className="text-sm text-gray-500 font-medium">
              Total Successful Payments
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              {payments.filter((p) => p.status === "success").length}
            </p>
            <p className="text-lg font-semibold text-green-600">
              ${summary.successfulAmount}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <h3 className="text-sm text-gray-500 font-medium">
              Average Payment
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              $
              {payments.filter((p) => p.status === "success").length > 0
                ? (
                    summary.successfulAmount /
                    payments.filter((p) => p.status === "success").length
                  ).toFixed(2)
                : "0.00"}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <h3 className="text-sm text-gray-500 font-medium">
              Latest Payment Date
            </h3>
            <p className="text-xl font-bold text-gray-800">
              {payments.filter((p) => p.status === "success").length > 0
                ? formatDate(
                    payments
                      .filter((p) => p.status === "success")
                      .sort(
                        (a, b) =>
                          new Date(b.paymentDate) - new Date(a.paymentDate)
                      )[0].paymentDate
                  )
                : "No payments"}
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                placeholder="Search by house number or payment ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter size={16} className="mr-2" />
                Filter
                {showFilters ? (
                  <ChevronUp size={16} className="ml-1" />
                ) : (
                  <ChevronDown size={16} className="ml-1" />
                )}
              </button>

              <button
                onClick={handleExportCSV}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Download size={16} className="mr-2" />
                Export CSV
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="p-4 border-b grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Month
                </label>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                >
                  <option value="">All Months</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status filter removed as we're only showing successful payments */}

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilterMonth("");
                    setSearchTerm("");
                  }}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Payment Transactions
            </h2>
            <p className="text-sm text-gray-500">
              Showing {filteredPayments.length} of {payments.length} payments
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("houseNumber")}
                  >
                    <div className="flex items-center">
                      House Number
                      {sortConfig.key === "houseNumber" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center">
                      Amount
                      {sortConfig.key === "amount" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("month")}
                  >
                    <div className="flex items-center">
                      Month
                      {sortConfig.key === "month" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        ))}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment ID
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {sortConfig.key === "status" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("paymentDate")}
                  >
                    <div className="flex items-center">
                      Payment Date
                      {sortConfig.key === "paymentDate" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        ))}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.houseNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${payment.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="font-mono">{payment.paymentId}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {getStatusIcon(payment.status)}
                          <span className="ml-1 capitalize">
                            {payment.status}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.paymentDate)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No payment records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredPayments.length > 0 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{filteredPayments.length}</span>{" "}
                results
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
