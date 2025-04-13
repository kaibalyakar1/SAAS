import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Navbar from "./Navbar";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const UserDashboard = () => {
  const [user, setUser] = useState({
    houseNumber: "A-101",
    name: "Kaibalya Kar",
    email: "kaibalya@example.com",
    phone: "+91-XXXXXXXXXX",
  });

  const [paymentHistory, setPaymentHistory] = useState([
    { month: "January", amount: 500, status: "Paid", date: "2025-01-01" },
    { month: "February", amount: 500, status: "Paid", date: "2025-02-01" },
    { month: "March", amount: 500, status: "Unpaid", date: null },
    { month: "April", amount: 500, status: "Unpaid", date: null },
  ]);

  const quotes = [
    "Great things take time, but they're worth the wait.",
    "Every rupee you spend keeps your society running!",
    "Discipline in payments is discipline in life.",
    "Community strength begins with your contributions.",
  ];

  const [randomQuote, setRandomQuote] = useState("");

  useEffect(() => {
    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const current = paymentHistory.find((p) => p.month === currentMonth);
  const unpaid = current && current.status === "Unpaid";

  useEffect(() => {
    if (unpaid) {
      setTimeout(() => {
        Swal.fire({
          icon: "warning",
          title: `Payment Pending for ${currentMonth}`,
          html: `<strong>Please pay your dues of ₹${current.amount}.</strong>`,
          showCancelButton: true,
          confirmButtonText: "Pay Now",
          confirmButtonColor: "#4F46E5",
          cancelButtonText: "Later",
          backdrop: `rgba(0,0,123,0.4)`,
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });
      }, 1000);
    }
  }, [unpaid, current, currentMonth]);

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(paymentHistory);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payment History");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(fileData, "payment_history.xlsx");

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Excel file downloaded!",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const generateBill = () => {
    const latest = paymentHistory.find((p) => p.status === "Paid");
    if (!latest) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No paid bills found to generate receipt!",
      });
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 128);
    doc.text("Nayan Vihar Maintenance Bill", 20, 20);

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`House: ${user.houseNumber}`, 20, 40);
    doc.text(`Resident: ${user.name}`, 20, 50);
    doc.text(`Month: ${latest.month}`, 20, 60);
    doc.text(`Amount: ₹${latest.amount}`, 20, 70);
    doc.text(`Paid on: ${latest.date}`, 20, 80);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for your timely payment!", 20, 100);

    doc.save("maintenance_bill.pdf");

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "PDF bill generated!",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const paid = paymentHistory.filter((p) => p.status === "Paid").length;
  const unpaidCount = paymentHistory.filter(
    (p) => p.status === "Unpaid"
  ).length;

  const pieData = {
    labels: ["Paid", "Unpaid"],
    datasets: [
      {
        data: [paid, unpaidCount],
        backgroundColor: ["#4ADE80", "#F87171"],
        borderColor: ["#22C55E", "#EF4444"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    maintainAspectRatio: false,
  };

  const barData = {
    labels: paymentHistory.map((p) => p.month),
    datasets: [
      {
        label: "Maintenance Payment",
        data: paymentHistory.map((p) => (p.status === "Paid" ? p.amount : 0)),
        backgroundColor: "#60A5FA",
        borderColor: "#3B82F6",
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Payment History",
      },
    },
    maintainAspectRatio: false,
  };

  const getPaymentStatusLabel = (status) => {
    return status === "Paid" ? (
      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
        Paid
      </span>
    ) : (
      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
        Unpaid
      </span>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}

        {/* Main Content */}
        <div className="container mx-auto p-4 md:p-6">
          {/* Welcome Section */}
          <div className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500 transform hover:scale-102 transition-transform duration-300">
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome, {user.name}!
              {!unpaid && <span className="ml-2 text-green-500">✓</span>}
            </h2>
            <p className="text-gray-600 mt-2 italic">"{randomQuote}"</p>

            {unpaid && (
              <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      Payment for {currentMonth} is pending. Please clear your
                      dues.
                    </p>
                    <button className="mt-2 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1 rounded-full transition duration-300">
                      Pay Now ₹{current?.amount}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Details & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* User Details Card */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-indigo-50 p-4 border-b border-indigo-100">
                <h3 className="text-xl font-semibold text-indigo-800">
                  Resident Details
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 rounded-full p-3 mr-4">
                    <svg
                      className="h-6 w-6 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-800">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 rounded-full p-3 mr-4">
                    <svg
                      className="h-6 w-6 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">House No</p>
                    <p className="font-medium text-gray-800">
                      {user.houseNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 rounded-full p-3 mr-4">
                    <svg
                      className="h-6 w-6 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-indigo-100 rounded-full p-3 mr-4">
                    <svg
                      className="h-6 w-6 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">{user.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-indigo-50 p-4 border-b border-indigo-100">
                <h3 className="text-xl font-semibold text-indigo-800">
                  Quick Actions
                </h3>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <button
                  onClick={downloadExcel}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition duration-300 shadow"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download Payment History
                </button>

                <button
                  onClick={generateBill}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition duration-300 shadow"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Generate Latest Bill
                </button>

                <button className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition duration-300 shadow">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  View Society Calendar
                </button>

                <button className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg transition duration-300 shadow">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  Submit Complaint
                </button>
              </div>
            </div>

            {/* Payment Summary Card */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-indigo-50 p-4 border-b border-indigo-100">
                <h3 className="text-xl font-semibold text-indigo-800">
                  Payment Summary
                </h3>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Total Payments</span>
                    <span className="font-medium">{paymentHistory.length}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Paid</span>
                    <span className="font-medium text-green-600">{paid}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Pending</span>
                    <span className="font-medium text-red-600">
                      {unpaidCount}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Total Amount Paid</span>
                    <span className="font-medium">₹{paid * 500}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${(paid / paymentHistory.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-center mt-2 text-sm text-gray-600">
                    {Math.round((paid / paymentHistory.length) * 100)}% payments
                    complete
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Payment Status Chart */}
            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Payment Status
              </h3>
              <div className="h-64">
                <Pie data={pieData} options={pieOptions} />
              </div>
            </div>

            {/* Monthly Payment Chart */}
            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Monthly Payments
              </h3>
              <div className="h-64">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="bg-indigo-50 p-4 border-b border-indigo-100">
              <h3 className="text-xl font-semibold text-indigo-800">
                Payment History
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentHistory.map((payment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{payment.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentStatusLabel(payment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.date || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.status === "Unpaid" ? (
                          <button className="text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full transition duration-300">
                            Pay Now
                          </button>
                        ) : (
                          <button className="text-sm bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-full transition duration-300">
                            View Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
