import React from "react";

const PaymentSummaryCard = ({ paymentHistory, paid, unpaidCount }) => {
  return (
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
            <span className="font-medium text-red-600">{unpaidCount}</span>
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
  );
};

export default PaymentSummaryCard;
