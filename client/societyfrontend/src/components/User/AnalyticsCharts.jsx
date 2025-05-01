import { Pie, Bar } from "react-chartjs-2";

const AnalyticsCharts = ({ paymentHistory }) => {
  const paid = paymentHistory.filter((p) => p.status === "paid").length;
  const unpaidCount = paymentHistory.filter(
    (p) => p.status === "unpaid"
  ).length;

  const pieData = {
    labels: ["paid", "unpaid"],
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
        data: paymentHistory.map((p) => (p.status === "paid" ? p.amount : 0)),
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Payment Status
        </h3>
        <div className="h-64">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Monthly Payments
        </h3>
        <div className="h-64">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
