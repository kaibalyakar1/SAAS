import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale } from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale);

const data = {
  labels: ["Paid", "Unpaid"],
  datasets: [
    {
      label: "Houses",
      data: [38, 12],
      backgroundColor: ["#22c55e", "#ef4444"],
    },
  ],
};

const options = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      precision: 0,
    },
  },
};

const PaymentChart = () => {
  return <Bar data={data} options={options} />;
};

export default PaymentChart;
