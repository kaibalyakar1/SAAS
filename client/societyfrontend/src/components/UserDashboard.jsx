import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
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
import UserWelcome from "./User/UserWelcome";
import ResidentDetails from "./User/ResidentDetails";
import QuickActions from "./User/QuickActions";
import AnalyticsCharts from "./User/AnalyticsCharts";
import PaymentHistoryTable from "./User/PaymentHistoryTable";
import ProblemModal from "./User/ProblemModal";
import ProblemsTable from "./User/ProblemsTable";

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
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [isLoadingProblems, setIsLoadingProblems] = useState(false);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [showProblemsTable, setShowProblemsTable] = useState(false);
  const [reportedProblems, setReportedProblems] = useState([]);
  const [problemDetails, setProblemDetails] = useState({
    description: "",
    image: null,
    imagePreview: null,
    category: "General",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = import.meta.env.VITE_API_URL;

  // Get current month/year
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  // Normalize month names for comparison
  const normalizeMonth = (month) => month?.toLowerCase().trim();
  const getValidMonth = (payment) => {
    // Try to parse existing month
    if (payment.month && payment.month !== "Invalid Date") {
      return payment.month;
    }
    // Fallback to createdAt month
    if (payment.createdAt) {
      return new Date(payment.createdAt).toLocaleString("default", {
        month: "long",
      });
    }
    return null;
  };
  // Find current payment safely
  const currentPayment = paymentHistory.find((p) => {
    const paymentMonth = getValidMonth(p);
    return paymentMonth === currentMonth && p.year === currentYear.toString();
  });

  const unpaid = !currentPayment || currentPayment.status !== "paid";

  // Debug logs
  useEffect(() => {
    console.log("Current payment data:", {
      paymentHistory,
      currentMonth,
      currentYear,
      currentPayment,
      unpaid,
    });
  }, [paymentHistory]);

  const problemCategories = [
    "General",
    "Electrical",
    "Plumbing",
    "Security",
    "Cleaning",
    "Parking",
    "Other",
  ];

  // Fetch payment history
  const fetchPaymentHistory = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("token", token);
      const response = await fetch(`${url}/api/v1/payment/my-payments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setPaymentHistory(data.payments || []);
        console.log("paymentHistory", data.payments);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to fetch payments",
          text: "Could not retrieve payment history. Please try again.",
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
      setIsLoading(false);
    }
  };

  // Initialize Razorpay payment
  // In UserDashboard component
  const handlePayNow = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${url}/api/v1/payment/create-order`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          month: currentMonth,
          year: new Date().getFullYear().toString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create payment order");
      }

      const { order, user } = await response.json();

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        const options = {
          key: "rzp_live_5bU9trlYsJpxn9",
          amount: order.amount,
          currency: "INR",
          name: "Nayan Vihar Society",
          description: `Maintenance Payment for ${currentMonth} ${new Date().getFullYear()}`,
          image: "/logo.png",
          order_id: order.id,
          handler: function (response) {
            // Show processing modal
            Swal.fire({
              title: "Processing Payment",
              html: "Please wait while we verify your payment...",
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });

            // Verify payment
            verifyPayment(response, token);
          },
          prefill: {
            name: user.ownerName,
            email: user.email || "",
            contact: user.phoneNumber || "",
          },
          notes: {
            houseNumber: user.houseNumber,
            month: currentMonth,
            year: new Date().getFullYear().toString(),
          },
          theme: {
            color: "#4F46E5",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      script.onerror = () => {
        throw new Error("Failed to load Razorpay script");
      };

      document.body.appendChild(script);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: error.message,
        confirmButtonColor: "#4F46E5",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  const verifyPayment = async (response, token) => {
    const verification = await fetch(`${url}/api/v1/payment/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      }),
    });

    if (!verification.ok) {
      const error = await verification.json();
      throw new Error(error.message || "Payment verification failed");
    }

    Swal.fire({
      icon: "success",
      title: "Payment Successful!",
      text: "Your payment has been processed successfully.",
    });
  };

  // Separate function to handle payment verification

  // Generate PDF receipt
  const generateBill = (payment) => {
    if (!payment || payment.status !== "paid") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Cannot generate receipt for unpaid bills!",
      });
      return;
    }

    const doc = new jsPDF();

    // Set document properties
    doc.setProperties({
      title: `Nayan Vihar Maintenance Bill - ${payment.month} ${payment.year}`,
      subject: "Maintenance Bill Receipt",
      author: "Nayan Vihar Society",
      creator: "Nayan Vihar Management",
    });

    // Add watermark
    const watermarkText = `HOUSE ${user.houseNumber}`;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(230, 230, 230);
    doc.setFontSize(60);
    doc.text(watermarkText, 105, 150, {
      align: "center",
      angle: -45,
    });

    // Header section
    doc.setFillColor(0, 51, 102);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("NAYAN VIHAR", 105, 20, { align: "center" });
    doc.setFontSize(16);
    doc.text("MAINTENANCE RECEIPT", 105, 30, { align: "center" });

    // Receipt box
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, 50, 180, 100, 3, 3);

    // Section title
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text("RECEIPT DETAILS", 105, 60, { align: "center" });
    doc.setLineWidth(0.2);
    doc.line(30, 65, 180, 65);

    // Labels
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("House Number:", 30, 80);
    doc.text("Resident Name:", 30, 90);
    doc.text("Bill Month:", 30, 100);
    doc.text("Amount Paid:", 30, 110);
    doc.text("Payment Date:", 30, 120);
    doc.text("Payment Status:", 30, 130);

    // Values
    doc.setFont("helvetica", "normal");
    doc.text(user.houseNumber, 100, 80);
    doc.text(user.ownerName, 100, 90);
    doc.text(`${payment.month} ${payment.year}`, 100, 100);
    doc.setFont("helvetica", "bold");
    doc.text(`₹${payment.amount}`, 100, 110);
    doc.setFont("helvetica", "normal");
    doc.text(new Date(payment.paymentDate).toLocaleDateString(), 100, 120);
    doc.setTextColor(0, 128, 0);
    doc.text("PAID", 100, 130);

    // Footer section
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

    // Receipt number and timestamp
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const receiptNumber = `RECEIPT#: NV-${user.houseNumber}-${Date.now()
      .toString()
      .substring(8)}`;
    doc.text(receiptNumber, 20, 240);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 150, 240);

    // Save the PDF
    doc.save(`maintenance_bill_${payment.month}_${payment.year}.pdf`);

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "PDF bill generated!",
      text: "Your receipt has been downloaded",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  // Download Excel
  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      paymentHistory.map((p) => ({
        Month: p.month,
        Year: p.year,
        Amount: p.amount,
        Status: p.status,
        "Payment Date": p.paymentDate
          ? new Date(p.paymentDate).toLocaleDateString()
          : "-",
      }))
    );
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

  // Fetch reported problems
  const fetchReportedProblems = async () => {
    const token = localStorage.getItem("token");
    setIsLoadingProblems(true);

    try {
      const response = await fetch(`${url}/api/v1/problem/user-problem`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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

  // Handle problem submission
  const handleProblemSubmit = async (e) => {
    const token = localStorage.getItem("token");
    e.preventDefault();

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

      setIsSubmitting(false);

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Problem Reported!",
          text: "Your issue has been submitted successfully. We'll get back to you soon.",
          confirmButtonColor: "#4F46E5",
        });

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
      setIsSubmitting(false);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Could not connect to the server. Please try again later.",
        confirmButtonColor: "#4F46E5",
      });
    }
  };

  // Handle image change for problem report
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

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  // Show payment reminder if current month is unpaid
  useEffect(() => {
    if (unpaid && currentPayment?.amount) {
      const timer = setTimeout(() => {
        try {
          Swal.fire({
            icon: "warning",
            title: `Payment Pending for ${currentMonth} ${currentYear}`,
            html: `<strong>Please pay your dues of ₹${currentPayment.amount}.</strong>`,
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
          }).then((result) => {
            if (result.isConfirmed) {
              handlePayNow({
                month: currentMonth,
                year: currentYear.toString(),
                amount: currentPayment.amount,
              });
            }
          });
        } catch (error) {
          console.error("Error showing payment alert:", error);
          Swal.fire({
            icon: "error",
            title: "Something went wrong",
            text: "Unable to show payment reminder. Please try again later.",
          });
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [unpaid, currentPayment, currentMonth, currentYear]);

  console.log(currentPayment);
  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto p-4 md:p-6">
        <UserWelcome
          user={user}
          unpaid={unpaid}
          currentPayment={currentPayment}
          currentMonth={currentMonth}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <ResidentDetails user={user} />

          <QuickActions
            downloadExcel={downloadExcel}
            generateBill={generateBill}
            fetchReportedProblems={fetchReportedProblems}
            setShowProblemModal={setShowProblemModal}
            isLoadingProblems={isLoadingProblems}
          />

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
                  <span className="font-medium text-green-600">
                    {paymentHistory.filter((p) => p.status === "paid").length}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-medium text-red-600">
                    {paymentHistory.filter((p) => p.status !== "paid").length}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Total Amount Paid</span>
                  <span className="font-medium">
                    ₹
                    {paymentHistory
                      .filter((p) => p.status === "paid")
                      .reduce((sum, p) => sum + p.amount, 0)}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${
                        (paymentHistory.filter((p) => p.status === "paid")
                          .length /
                          Math.max(paymentHistory.length, 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="text-center mt-2 text-sm text-gray-600">
                  {Math.round(
                    (paymentHistory.filter((p) => p.status === "paid").length /
                      Math.max(paymentHistory.length, 1)) *
                      100
                  )}
                  % payments complete
                </div>
              </div>
            </div>
          </div>
        </div>

        <AnalyticsCharts paymentHistory={paymentHistory} />
        <PaymentHistoryTable
          paymentHistory={paymentHistory}
          generateBill={generateBill}
          handlePayNow={handlePayNow}
        />
      </div>

      <ProblemModal
        showProblemModal={showProblemModal}
        setShowProblemModal={setShowProblemModal}
        problemDetails={problemDetails}
        setProblemDetails={setProblemDetails}
        handleProblemSubmit={handleProblemSubmit}
        isSubmitting={isSubmitting}
        user={user}
        problemCategories={problemCategories}
        handleImageChange={handleImageChange}
      />

      <ProblemsTable
        showProblemsTable={showProblemsTable}
        setShowProblemsTable={setShowProblemsTable}
        reportedProblems={reportedProblems}
        isLoadingProblems={isLoadingProblems}
      />
    </div>
  );
};

export default UserDashboard;
