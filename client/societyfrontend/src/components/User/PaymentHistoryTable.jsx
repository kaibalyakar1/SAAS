const PaymentHistoryTable = ({
  paymentHistory,
  generateBill,
  handlePayNow,
}) => {
  const getPaymentStatusLabel = (status) => {
    if (status.toLowerCase() === "paid") {
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

  return (
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
                <td className="px-6 py-4 whitespace-nowrap">{payment.month}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ₹{payment.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPaymentStatusLabel(payment.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {payment.paymentDate
                    ? new Date(payment.paymentDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {payment.status === "paid" ? (
                    <button
                      className="text-sm bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-full transition duration-300"
                      onClick={() => generateBill(payment)}
                    >
                      View Receipt
                    </button>
                  ) : (
                    <button
                      className="text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full transition duration-300"
                      onClick={() => handlePayNow(payment)}
                    >
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistoryTable;
