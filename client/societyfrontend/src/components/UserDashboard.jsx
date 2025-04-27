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

const UserDashboard = ({ user }) => {
  console.log("storedUser", user);
  const [paymentHistory, setPaymentHistory] = useState([
    { month: "January", amount: 500, status: "Paid", date: "2025-01-01" },
    { month: "February", amount: 500, status: "Paid", date: "2025-02-01" },
    { month: "March", amount: 500, status: "Unpaid", date: null },
    { month: "April", amount: 500, status: "Unpaid", date: null },
  ]);
  const url = import.meta.env.VITE_API_URL;
  const quotes = [
    "Great things take time, but they're worth the wait.",
    "Every rupee you spend keeps your society running!",
    "Discipline in payments is discipline in life.",
    "Community strength begins with your contributions.",
  ];

  const [randomQuote, setRandomQuote] = useState("");
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [problemDetails, setProblemDetails] = useState({
    description: "",
    image: null,
    imagePreview: null,
    category: "General",
  });

  const problemCategories = [
    "General",
    "Electrical",
    "Plumbing",
    "Security",
    "Cleaning",
    "Parking",
    "Other",
  ];

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
  const [reportedProblems, setReportedProblems] = useState([]);
  const [isLoadingProblems, setIsLoadingProblems] = useState(false);
  const [showProblemsTable, setShowProblemsTable] = useState(false);
  const fetchReportedProblems = async () => {
    const token = localStorage.getItem("token");
    setIsLoadingProblems(true);

    try {
      const response = await fetch(
        `${url}/api/v1/problem/user-problem`,
        // "proc/api/v1/problem/user-problem",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("response", response);

      if (response.ok) {
        const data = await response.json();
        setReportedProblems(data.data || []);
        setShowProblemsTable(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to fetch problems",
          text: "Could not retrieve your reported problems. Please try again.",
          confirmButtonColor: "#4F46E5",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Could not connect to the server. Please try again later.",
        confirmButtonColor: "#4F46E5",
      });
    } finally {
      setIsLoadingProblems(false);
    }
  };

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

  const generateBill = (payment) => {
    if (!payment || payment.status !== "Paid") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Cannot generate receipt for unpaid bills!",
      });
      return;
    }

    // Create PDF document
    const doc = new jsPDF();

    // Set document properties
    doc.setProperties({
      title: `Nayan Vihar Maintenance Bill - ${payment.month}`,
      subject: "Maintenance Bill Receipt",
      author: "Nayan Vihar Society",
      creator: "Nayan Vihar Management",
    });

    // Add watermark with house number
    doc.setFont("helvetica", "bold");
    doc.setTextColor(230, 230, 230); // Light gray color
    doc.setFontSize(60);

    // Save the current state
    doc.saveGraphicsState();

    // Rotate and position the watermark
    const watermarkText = `HOUSE ${user.houseNumber}`;
    doc.translate(105, 150);
    doc.rotate(-45);
    doc.text(watermarkText, 0, 0, { align: "center" });

    // Restore to original state
    doc.restoreGraphicsState();

    // Header section
    doc.setFillColor(0, 51, 102);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("NAYAN VIHAR", 105, 20, { align: "center" });
    doc.setFontSize(16);
    doc.text("MAINTENANCE RECEIPT", 105, 30, { align: "center" });

    // Bill info section
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, 50, 180, 100, 3, 3);

    // Bill details
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 51, 102);
    doc.setFontSize(14);
    doc.text("RECEIPT DETAILS", 105, 60, { align: "center" });

    // Separator line
    doc.setLineWidth(0.2);
    doc.line(30, 65, 180, 65);

    // Customer details section
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text("House Number:", 30, 80);
    doc.text("Resident Name:", 30, 90);
    doc.text("Bill Month:", 30, 100);
    doc.text("Amount Paid:", 30, 110);
    doc.text("Payment Date:", 30, 120);
    doc.text("Payment Status:", 30, 130);

    // Values
    doc.setFont("helvetica", "normal");
    doc.text(user.houseNumber, 100, 80);
    doc.text(user.name, 100, 90);
    doc.text(payment.month, 100, 100);
    doc.setFont("helvetica", "bold");
    doc.text(`₹${payment.amount}`, 100, 110);
    doc.setFont("helvetica", "normal");
    doc.text(payment.date, 100, 120);
    doc.setTextColor(0, 128, 0);
    doc.text("PAID", 100, 130);

    // Footer
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, 160, 180, 40, 3, 3);

    doc.setTextColor(0, 51, 102);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Thank you for your timely payment!", 105, 175, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(
      [
        "This is an electronically generated receipt and does not require a signature.",
        "For any queries, please contact the society office or email: nayanvihar@example.com",
        "Office Hours: Monday to Saturday (10:00 AM - 6:00 PM)",
      ],
      105,
      185,
      { align: "center", maxWidth: 160 }
    );

    // Add receipt number and date
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const receiptNumber = `RECEIPT#: NV-${user.houseNumber}-${Date.now()
      .toString()
      .substring(8)}`;
    doc.text(receiptNumber, 20, 240);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 150, 240);

    // Save the PDF
    doc.save(`maintenance_bill_${payment.month.replace(" ", "_")}.pdf`);

    // Success notification
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "PDF bill generated!",
      text: "Your receipt has been downloaded",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProblemSubmit = async (e) => {
    const token = localStorage.getItem("token");
    e.preventDefault();

    // Set loading state to true
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("ownerName", user.ownerName);
    formData.append("houseNumber", user.houseNumber);
    formData.append("phoneNumber", user.phoneNumber);
    formData.append("category", problemDetails.category);
    formData.append("description", problemDetails.description);

    if (problemDetails.image) {
      formData.append("image", problemDetails.image);
    }

    try {
      const response = await fetch(`${url}/api/v1/problem/report`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      // Set loading state to false
      setIsSubmitting(false);

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Problem Reported!",
          text: "Your issue has been submitted successfully. We'll get back to you soon.",
          confirmButtonColor: "#4F46E5",
        });

        // Reset form and close modal
        setProblemDetails({
          description: "",
          image: null,
          imagePreview: null,
          category: "General",
        });
        setShowProblemModal(false);
      } else {
        const result = await response.json();
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: result.message || "An error occurred. Please try again.",
          confirmButtonColor: "#4F46E5",
        });
      }
    } catch (error) {
      // Set loading state to false in case of error
      setIsSubmitting(false);

      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Could not connect to the server. Please try again later.",
        confirmButtonColor: "#4F46E5",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProblemDetails({
        ...problemDetails,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
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
    if (status === "Paid") {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          Paid
        </span>
      );
    } else {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
          Unpaid
        </span>
      );
    }
  };
  const handlePayNow = (payment) => {
    // Payment gateway integration would go here
    Swal.fire({
      title: "Process Payment",
      text: `You're about to pay ₹${payment.amount} for ${payment.month}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Proceed to Payment",
    }).then((result) => {
      if (result.isConfirmed) {
        // Simulate payment processing here
        // In a real application, you would redirect to a payment gateway
      }
    });
  };

  return (
    <>
      <div className="min-h-screen w-full bg-gray-50">
        {/* Problem Report Modal */}
        {showProblemModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Report a Problem
                  </h3>
                  <button
                    onClick={() => setShowProblemModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleProblemSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Your Details
                    </label>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm">
                        <span className="font-medium">Name:</span>{" "}
                        {user.ownerName}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">House No:</span>{" "}
                        {user.houseNumber}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Contact:</span>{" "}
                        {user.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Issue Category
                    </label>
                    <select
                      value={problemDetails.category}
                      onChange={(e) =>
                        setProblemDetails({
                          ...problemDetails,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      {problemCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Describe the Problem
                    </label>
                    <textarea
                      value={problemDetails.description}
                      onChange={(e) =>
                        setProblemDetails({
                          ...problemDetails,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      rows="4"
                      placeholder="Please describe the issue in detail..."
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Upload Image (Optional)
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        {problemDetails.imagePreview ? (
                          <img
                            src={problemDetails.imagePreview}
                            alt="Preview"
                            className="h-full w-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-8 h-8 mb-4 text-gray-500"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG (MAX. 5MB)
                            </p>
                          </div>
                        )}
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowProblemModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        "Submit Problem"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {showProblemsTable && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <svg
                        className="h-5 w-5 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Your Reported Problems
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowProblemsTable(false)}
                    className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                    aria-label="Close"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {reportedProblems.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date Reported
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {reportedProblems.map((problem) => (
                            <tr
                              key={problem._id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                  {problem.category}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 max-w-xs overflow-hidden text-ellipsis">
                                  {problem.description}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    problem.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : problem.status === "In Progress"
                                      ? "bg-blue-100 text-blue-800"
                                      : problem.status === "Resolved"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {problem.status || "Pending"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(
                                  problem.createdAt
                                ).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="bg-gray-100 p-4 rounded-full inline-flex">
                        <svg
                          className="mx-auto h-10 w-10 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <h3 className="mt-4 text-base font-medium text-gray-900">
                        No problems reported
                      </h3>
                      <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                        You haven't reported any problems yet. When you do,
                        they'll appear here.
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => setShowProblemsTable(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Main Content */}
        <div className="container mx-auto p-4 md:p-6">
          {/* Welcome Section */}
          <div className="mb-8 bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500 transform hover:scale-102 transition-transform duration-300">
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome, {user.ownerName}!
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
                    <p className="font-medium text-gray-800">
                      {user.ownerName}
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
                    <p className="font-medium text-gray-800">
                      {user.phoneNumber}
                    </p>
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

                <button
                  onClick={fetchReportedProblems}
                  className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition duration-300 shadow"
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  View Reported Problems
                  {isLoadingProblems && (
                    <svg
                      className="animate-spin ml-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                </button>

                <button
                  onClick={() => setShowProblemModal(true)}
                  className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg transition duration-300 shadow"
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
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  Report a Problem
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
                          <button
                            className="text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full transition duration-300"
                            onClick={() => handlePayNow(payment)}
                          >
                            Pay Now
                          </button>
                        ) : (
                          <button
                            className="text-sm bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-full transition duration-300"
                            onClick={() => generateBill(payment)}
                          >
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
