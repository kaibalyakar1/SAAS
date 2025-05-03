import { useEffect, useState } from "react";

const UserWelcome = ({
  user,
  unpaid,
  currentPayment,
  currentMonth,
  onPayNow,
  isProcessing,
}) => {
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

  return (
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
                Payment for {currentMonth} is pending. Please clear your dues.
              </p>
              <button
                onClick={onPayNow}
                disabled={isProcessing}
                className={`mt-2 ${
                  isProcessing ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
                } text-white text-sm px-4 py-1 rounded-full transition duration-300 flex items-center`}
              >
                {isProcessing ? (
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
                    Processing...
                  </>
                ) : (
                  <>Pay Now ₹{currentPayment?.amount}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserWelcome;
