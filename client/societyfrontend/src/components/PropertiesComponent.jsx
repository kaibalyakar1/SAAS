// import React, { useState, useEffect } from "react";
// import {
//   Calendar,
//   DollarSign,
//   Home,
//   AlertTriangle,
//   CheckCircle,
//   TrendingUp,
//   BarChart2,
//   MessageSquare,
//   Check,
//   X as XIcon,
//   Clock,
//   Plus,
//   ChevronDown,
//   ChevronUp,
//   Trash,
//   Edit,
//   Search,
//   UserPlus,
//   User,
//   Save,
//   FileText,
//   Menu,
// } from "lucide-react";

// import { Bar, Line, Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import AdminSidebar from "./Admin/AdminSidebar";

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// // ----------------- PROPERTIES COMPONENT -----------------
// const PropertiesComponent = () => {
//   const [properties, setProperties] = useState([
//     {
//       id: 1,
//       houseNumber: "A-101",
//       owner: "Kaibalya Kar",
//       ownerContact: "9876543210",
//       ownerEmail: "kaibalya@example.com",
//       floors: 2,
//       area: "1200 sq ft",
//       residents: 4,
//       registrationDate: "2023-05-15",
//     },
//     {
//       id: 2,
//       houseNumber: "B-205",
//       owner: "Rahul Sharma",
//       ownerContact: "8765432109",
//       ownerEmail: "rahul@example.com",
//       floors: 1,
//       area: "950 sq ft",
//       residents: 3,
//       registrationDate: "2023-06-21",
//     },
//     {
//       id: 3,
//       houseNumber: "C-302",
//       owner: "Priya Patel",
//       ownerContact: "7654321098",
//       ownerEmail: "priya@example.com",
//       floors: 3,
//       area: "1500 sq ft",
//       residents: 5,
//       registrationDate: "2023-04-10",
//     },
//     {
//       id: 4,
//       houseNumber: "D-104",
//       owner: "Amit Singh",
//       ownerContact: "6543210987",
//       ownerEmail: "amit@example.com",
//       floors: 2,
//       area: "1100 sq ft",
//       residents: 4,
//       registrationDate: "2023-07-05",
//     },
//   ]);

//   const [showRegistrationForm, setShowRegistrationForm] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [newProperty, setNewProperty] = useState({
//     houseNumber: "",
//     owner: "",
//     ownerContact: "",
//     ownerEmail: "",
//     floors: 1,
//     area: "",
//     residents: 1,
//     registrationDate: new Date().toISOString().split("T")[0],
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewProperty((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setProperties((prev) => [
//       ...prev,
//       {
//         id: prev.length + 1,
//         ...newProperty,
//       },
//     ]);
//     setShowRegistrationForm(false);
//     setNewProperty({
//       houseNumber: "",
//       owner: "",
//       ownerContact: "",
//       ownerEmail: "",
//       floors: 1,
//       area: "",
//       residents: 1,
//       registrationDate: new Date().toISOString().split("T")[0],
//     });
//   };

//   const filteredProperties = properties.filter(
//     (property) =>
//       property.houseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       property.owner.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-4 ">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-0">
//           Property Management
//         </h1>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => setShowRegistrationForm(!showRegistrationForm)}
//             className="bg-blue-600 text-white px-3 py-2 rounded-md flex items-center text-sm"
//           >
//             <UserPlus size={16} className="mr-1" />
//             Register New Property
//           </button>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
//         <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-blue-500">
//           <div className="flex justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-500">
//                 Total Properties
//               </p>
//               <p className="text-xl md:text-2xl font-bold">
//                 {properties.length}
//               </p>
//             </div>
//             <div className="p-2 bg-blue-100 rounded-full">
//               <Home size={20} className="text-blue-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-green-500">
//           <div className="flex justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-500">
//                 Total Residents
//               </p>
//               <p className="text-xl md:text-2xl font-bold text-green-600">
//                 {properties.reduce((sum, p) => sum + parseInt(p.residents), 0)}
//               </p>
//             </div>
//             <div className="p-2 bg-green-100 rounded-full">
//               <User size={20} className="text-green-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-indigo-500">
//           <div className="flex justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-500">Total Area</p>
//               <p className="text-xl md:text-2xl font-bold text-indigo-600">
//                 {properties.reduce(
//                   (sum, p) => sum + parseInt(p.area.split(" ")[0]),
//                   0
//                 )}{" "}
//                 sq ft
//               </p>
//             </div>
//             <div className="p-2 bg-indigo-100 rounded-full">
//               <FileText size={20} className="text-indigo-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-amber-500">
//           <div className="flex justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-500">Average Floors</p>
//               <p className="text-xl md:text-2xl font-bold text-amber-600">
//                 {(
//                   properties.reduce((sum, p) => sum + parseInt(p.floors), 0) /
//                   properties.length
//                 ).toFixed(1)}
//               </p>
//             </div>
//             <div className="p-2 bg-amber-100 rounded-full">
//               <TrendingUp size={20} className="text-amber-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Registration Form */}
//       {showRegistrationForm && (
//         <div className="bg-white p-4 shadow rounded-lg mb-6">
//           <h2 className="text-lg font-semibold mb-4">Register New Property</h2>
//           <form
//             onSubmit={handleSubmit}
//             className="grid grid-cols-1 md:grid-cols-2 gap-4"
//           >
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 House Number
//               </label>
//               <input
//                 type="text"
//                 name="houseNumber"
//                 required
//                 value={newProperty.houseNumber}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Owner Name
//               </label>
//               <input
//                 type="text"
//                 name="owner"
//                 required
//                 value={newProperty.owner}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Contact Number
//               </label>
//               <input
//                 type="text"
//                 name="ownerContact"
//                 required
//                 value={newProperty.ownerContact}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="ownerEmail"
//                 value={newProperty.ownerEmail}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Number of Floors
//               </label>
//               <input
//                 type="number"
//                 name="floors"
//                 min="1"
//                 value={newProperty.floors}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Area (sq ft)
//               </label>
//               <input
//                 type="text"
//                 name="area"
//                 required
//                 value={newProperty.area}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Number of Residents
//               </label>
//               <input
//                 type="number"
//                 name="residents"
//                 min="1"
//                 value={newProperty.residents}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Registration Date
//               </label>
//               <input
//                 type="date"
//                 name="registrationDate"
//                 value={newProperty.registrationDate}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//             <div className="md:col-span-2 flex justify-end space-x-2 mt-2">
//               <button
//                 type="button"
//                 onClick={() => setShowRegistrationForm(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               >
//                 Register Property
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Search & Property List */}
//       <div className="bg-white p-4 shadow rounded-lg">
//         <div className="mb-4 relative">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <Search size={18} className="text-gray-400" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search by house number or owner name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//           />
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="py-2 px-4 text-left">House No.</th>
//                 <th className="py-2 px-4 text-left">Owner</th>
//                 <th className="py-2 px-4 text-left">Contact</th>
//                 <th className="py-2 px-4 text-left">Email</th>
//                 <th className="py-2 px-4 text-left">Floors</th>
//                 <th className="py-2 px-4 text-left">Area</th>
//                 <th className="py-2 px-4 text-left">Residents</th>
//                 <th className="py-2 px-4 text-left">Registration Date</th>
//                 <th className="py-2 px-4 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredProperties.map((property) => (
//                 <tr key={property.id}>
//                   <td className="py-2 px-4">{property.houseNumber}</td>
//                   <td className="py-2 px-4">{property.owner}</td>
//                   <td className="py-2 px-4">{property.ownerContact}</td>
//                   <td className="py-2 px-4">{property.ownerEmail}</td>
//                   <td className="py-2 px-4">{property.floors}</td>
//                   <td className="py-2 px-4">{property.area}</td>
//                   <td className="py-2 px-4">{property.residents}</td>
//                   <td className="py-2 px-4">{property.registrationDate}</td>
//                   <td className="py-2 px-4">
//                     <div className="flex space-x-1">
//                       <button
//                         className="p-1 text-blue-600 hover:text-blue-800"
//                         title="Edit"
//                       >
//                         <Edit size={16} />
//                       </button>
//                       <button
//                         className="p-1 text-red-600 hover:text-red-800"
//                         title="Delete"
//                       >
//                         <Trash size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ----------------- EXPENSES COMPONENT -----------------
// const ExpensesComponent = () => {
//   const [showExpenseForm, setShowExpenseForm] = useState(false);
//   const [selectedMonth, setSelectedMonth] = useState("April");
//   const months = ["January", "February", "March", "April", "May", "June"];

//   const [expenses, setExpenses] = useState([
//     {
//       id: 1,
//       category: "Maintenance",
//       amount: 25000,
//       date: "2025-04-05",
//       description: "Monthly general maintenance",
//     },
//     {
//       id: 2,
//       category: "Utilities",
//       amount: 18000,
//       date: "2025-04-08",
//       description: "Electricity and water bills",
//     },
//     {
//       id: 3,
//       category: "Security",
//       amount: 15000,
//       date: "2025-04-10",
//       description: "Security staff salaries",
//     },
//     {
//       id: 4,
//       category: "Cleaning",
//       amount: 12000,
//       date: "2025-04-12",
//       description: "Cleaning services and supplies",
//     },
//     {
//       id: 5,
//       category: "Repairs",
//       amount: 8000,
//       date: "2025-04-15",
//       description: "Repairs to common areas",
//     },
//   ]);

//   const [newExpense, setNewExpense] = useState({
//     category: "Maintenance",
//     amount: "",
//     date: new Date().toISOString().split("T")[0],
//     description: "",
//   });

//   const monthlyExpenseData = {
//     January: 65000,
//     February: 70000,
//     March: 75000,
//     April: 78000,
//     May: 72000,
//     June: 80000,
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewExpense((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setExpenses((prev) => [
//       ...prev,
//       {
//         id: prev.length + 1,
//         ...newExpense,
//         amount: parseFloat(newExpense.amount),
//       },
//     ]);
//     setShowExpenseForm(false);
//     setNewExpense({
//       category: "Maintenance",
//       amount: "",
//       date: new Date().toISOString().split("T")[0],
//       description: "",
//     });
//   };

//   // Data for expenses breakdown
//   const expensesData = {
//     labels: ["Maintenance", "Utilities", "Security", "Cleaning", "Repairs"],
//     datasets: [
//       {
//         data: [
//           expenses
//             .filter((e) => e.category === "Maintenance")
//             .reduce((sum, e) => sum + e.amount, 0),
//           expenses
//             .filter((e) => e.category === "Utilities")
//             .reduce((sum, e) => sum + e.amount, 0),
//           expenses
//             .filter((e) => e.category === "Security")
//             .reduce((sum, e) => sum + e.amount, 0),
//           expenses
//             .filter((e) => e.category === "Cleaning")
//             .reduce((sum, e) => sum + e.amount, 0),
//           expenses
//             .filter((e) => e.category === "Repairs")
//             .reduce((sum, e) => sum + e.amount, 0),
//         ],
//         backgroundColor: [
//           "#3b82f6",
//           "#8b5cf6",
//           "#ec4899",
//           "#f97316",
//           "#14b8a6",
//         ],
//       },
//     ],
//   };

//   // Data for monthly expenses trend
//   const monthlyExpensesData = {
//     labels: months,
//     datasets: [
//       {
//         label: "Monthly Expenses (₹)",
//         data: months.map((month) => monthlyExpenseData[month]),
//         borderColor: "#ef4444",
//         backgroundColor: "rgba(239, 68, 68, 0.1)",
//         tension: 0.3,
//         fill: true,
//       },
//     ],
//   };

//   return (
//     <div className="p-4">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-0">
//           Expenses Management
//         </h1>

//         <div className="flex items-center space-x-2">
//           <div className="flex items-center space-x-2 mr-2">
//             <Calendar size={18} />
//             <select
//               className="bg-white border rounded px-2 md:px-3 py-1"
//               value={selectedMonth}
//               onChange={(e) => setSelectedMonth(e.target.value)}
//             >
//               {months.map((month) => (
//                 <option key={month} value={month}>
//                   {month} 2025
//                 </option>
//               ))}
//             </select>
//           </div>

//           <button
//             onClick={() => setShowExpenseForm(!showExpenseForm)}
//             className="bg-blue-600 text-white px-3 py-2 rounded-md flex items-center text-sm"
//           >
//             <Plus size={16} className="mr-1" />
//             Add Expense
//           </button>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
//         <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-red-500">
//           <div className="flex justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-500">
//                 Total Expenses ({selectedMonth})
//               </p>
//               <p className="text-xl md:text-2xl font-bold text-red-600">
//                 ₹
//                 {(
//                   expenses.reduce((sum, e) => sum + e.amount, 0) / 1000
//                 ).toFixed(0)}
//                 K
//               </p>
//             </div>
//             <div className="p-2 bg-red-100 rounded-full">
//               <DollarSign size={20} className="text-red-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-blue-500">
//           <div className="flex justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-500">Maintenance</p>
//               <p className="text-xl md:text-2xl font-bold text-blue-600">
//                 ₹
//                 {(
//                   expenses
//                     .filter((e) => e.category === "Maintenance")
//                     .reduce((sum, e) => sum + e.amount, 0) / 1000
//                 ).toFixed(0)}
//                 K
//               </p>
//             </div>
//             <div className="p-2 bg-blue-100 rounded-full">
//               <Home size={20} className="text-blue-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-purple-500">
//           <div className="flex justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-500">Utilities</p>
//               <p className="text-xl md:text-2xl font-bold text-purple-600">
//                 ₹
//                 {(
//                   expenses
//                     .filter((e) => e.category === "Utilities")
//                     .reduce((sum, e) => sum + e.amount, 0) / 1000
//                 ).toFixed(0)}
//                 K
//               </p>
//             </div>
//             <div className="p-2 bg-purple-100 rounded-full">
//               <AlertTriangle size={20} className="text-purple-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-green-500">
//           <div className="flex justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-500">Monthly Change</p>
//               <p className="text-xl md:text-2xl font-bold text-green-600">
//                 +4%
//               </p>
//             </div>
//             <div className="p-2 bg-green-100 rounded-full">
//               <TrendingUp size={20} className="text-green-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add Expense Form */}
//       {showExpenseForm && (
//         <div className="bg-white p-4 shadow rounded-lg mb-6">
//           <h2 className="text-lg font-semibold mb-4">Add New Expense</h2>
//           <form
//             onSubmit={handleSubmit}
//             className="grid grid-cols-1 md:grid-cols-2 gap-4"
//           >
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Category
//               </label>
//               <select
//                 name="category"
//                 value={newExpense.category}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="Maintenance">Maintenance</option>
//                 <option value="Utilities">Utilities</option>
//                 <option value="Security">Security</option>
//                 <option value="Cleaning">Cleaning</option>
//                 <option value="Repairs">Repairs</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Amount (₹)
//               </label>
//               <input
//                 type="number"
//                 name="amount"
//                 required
//                 value={newExpense.amount}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Date
//               </label>
//               <input
//                 type="date"
//                 name="date"
//                 value={newExpense.date}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <input
//                 type="text"
//                 name="description"
//                 value={newExpense.description}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//             <div className="md:col-span-2 flex justify-end space-x-2 mt-2">
//               <button
//                 type="button"
//                 onClick={() => setShowExpenseForm(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               >
//                 Add Expense
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
//         {/* Expenses Breakdown */}
//         <div className="bg-white p-3 md:p-4 shadow rounded-lg">
//           <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4">
//             Expenses Breakdown
//           </h2>
//           <div className="h-48 md:h-64">
//             <Pie data={expensesData} options={{ maintainAspectRatio: false }} />
//           </div>
//         </div>

//         {/* Monthly Expenses Trend */}
//         <div className="bg-white p-3 md:p-4 shadow rounded-lg">
//           <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4">
//             Monthly Expenses Trend
//           </h2>
//           <div className="h-48 md:h-64">
//             <Line
//               data={monthlyExpensesData}
//               options={{
//                 maintainAspectRatio: false,
//                 plugins: { legend: { display: false } },
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Expenses Table */}
//       <div className="bg-white p-4 shadow rounded-lg">
//         <h2 className="text-lg font-semibold mb-4">Expense Records</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="py-2 px-4 text-left">Date</th>
//                 <th className="py-2 px-4 text-left">Category</th>
//                 <th className="py-2 px-4 text-left">Amount</th>
//                 <th className="py-2 px-4 text-left">Description</th>
//                 <th className="py-2 px-4 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {expenses.map((expense) => (
//                 <tr key={expense.id}>
//                   <td className="py-2 px-4">{expense.date}</td>
//                   <td className="py-2 px-4">{expense.category}</td>
//                   <td className="py-2 px-4">
//                     ₹{expense.amount.toLocaleString()}
//                   </td>
//                   <td className="py-2 px-4">{expense.description}</td>
//                   <td className="py-2 px-4">
//                     <div className="flex space-x-1">
//                       <button
//                         className="p-1 text-blue-600 hover:text-blue-800"
//                         title="Edit"
//                       >
//                         <Edit size={16} />
//                       </button>
//                       <button
//                         className="p-1 text-red-600 hover:text-red-800"
//                         title="Delete"
//                       >
//                         <Trash size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ----------------- PAYMENTS COMPONENT -----------------
// const PaymentsComponent = () => {
//   const [selectedMonth, setSelectedMonth] = useState("April");
//   const [showPaymentForm, setShowPaymentForm] = useState(false);
//   const [payments, setPayments] = useState([]); // Add this line

//   const handleMonthChange = (event) => {
//     setSelectedMonth(event.target.value);
//   };

//   const handlePaymentSubmit = (event) => {
//     event.preventDefault();
//     // Handle payment submission logic here
//     setShowPaymentForm(false);
//   };

//   const handlePaymentFormToggle = () => {
//     setShowPaymentForm(!showPaymentForm);
//   };

//   return (
//     <div>
//       {/* Payment Form */}
//       {showPaymentForm && (
//         <div className="bg-white p-3 md:p-4 shadow rounded-lg">
//           <h2 className="text-base md:text-lg font-semibold mb-2 md:mb-4">
//             Add Payment
//           </h2>
//           <form onSubmit={handlePaymentSubmit}>
//             {/* Payment form fields */}
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Add Payment
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// const ComplaintsComponent = () => {
//   const [complaints, setComplaints] = useState([
//     {
//       id: 1,
//       houseNo: "A-101",
//       ownerName: "Kaibalya Kar",
//       complaintDate: "2025-04-10",
//       description: "Water leakage from the ceiling",
//       proof: "leak-image.jpg",
//       status: "pending",
//     },
//     {
//       id: 2,
//       houseNo: "B-205",
//       ownerName: "Rahul Sharma",
//       complaintDate: "2025-04-08",
//       description: "Elevator not working properly",
//       proof: "elevator-video.mp4",
//       status: "ongoing",
//     },
//     {
//       id: 3,
//       houseNo: "C-302",
//       ownerName: "Priya Patel",
//       complaintDate: "2025-04-05",
//       description: "Garbage not collected regularly",
//       proof: "garbage-image.jpg",
//       status: "resolved",
//     },
//     {
//       id: 4,
//       houseNo: "D-104",
//       ownerName: "Amit Singh",
//       complaintDate: "2025-04-12",
//       description: "Noise complaint against neighbor",
//       proof: "noise-recording.mp3",
//       status: "pending",
//     },
//   ]);

//   const [showComplaintForm, setShowComplaintForm] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [selectedComplaint, setSelectedComplaint] = useState(null);

//   const [newComplaint, setNewComplaint] = useState({
//     houseNo: "",
//     ownerName: "",
//     complaintDate: new Date().toISOString().split("T")[0],
//     description: "",
//     proof: "",
//     status: "pending",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewComplaint((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setComplaints((prev) => [
//       ...prev,
//       {
//         id: prev.length + 1,
//         ...newComplaint,
//       },
//     ]);
//     setShowComplaintForm(false);
//     setNewComplaint({
//       houseNo: "",
//       ownerName: "",
//       complaintDate: new Date().toISOString().split("T")[0],
//       description: "",
//       proof: "",
//       status: "pending",
//     });
//   };

//   const handleStatusChange = (id, newStatus) => {
//     setComplaints(
//       complaints.map((complaint) =>
//         complaint.id === id ? { ...complaint, status: newStatus } : complaint
//       )
//     );
//   };

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "pending":
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//             <Clock size={12} className="mr-1" />
//             Pending
//           </span>
//         );
//       case "ongoing":
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//             <AlertTriangle size={12} className="mr-1" />
//             Ongoing
//           </span>
//         );
//       case "resolved":
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//             <CheckCircle size={12} className="mr-1" />
//             Resolved
//           </span>
//         );
//       default:
//         return null;
//     }
//   };

//   const filteredComplaints = complaints.filter(
//     (complaint) =>
//       (complaint.houseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         complaint.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) &&
//       (filterStatus === "all" || complaint.status === filterStatus)
//   );

//   const pendingCount = complaints.filter(
//     (complaint) => complaint.status === "pending"
//   ).length;
//   const ongoingCount = complaints.filter(
//     (complaint) => complaint.status === "ongoing"
//   ).length;
//   const resolvedCount = complaints.filter(
//     (complaint) => complaint.status === "resolved"
//   ).length;

//   return (
//     <div className="p-4">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-0">
//           Complaint Management
//         </h1>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => setShowComplaintForm(!showComplaintForm)}
//             className="bg-blue-600 text-white px-3 py-2 rounded-md flex items-center text-sm"
//           >
//             <MessageSquare size={16} className="mr-1" />
//             Register Complaint
//           </button>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6">
//         <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-yellow-500">
//           <div className="flex justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-500">
//                 Pending Complaints
//               </p>
//               <p className="text-xl md:text-2xl font-bold text-yellow-600">
//                 {pendingCount}
//               </p>
//             </div>
//             <div className="p-2 bg-yellow-100 rounded-full">
//               <Clock size={20} className="text-yellow-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-blue-500">
//           <div className="flex justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-500">
//                 Ongoing Complaints
//               </p>
//               <p className="text-xl md:text-2xl font-bold text-blue-600">
//                 {ongoingCount}
//               </p>
//             </div>
//             <div className="p-2 bg-blue-100 rounded-full">
//               <AlertTriangle size={20} className="text-blue-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-green-500">
//           <div className="flex justify-between">
//             <div>
//               <p className="text-xs md:text-sm text-gray-500">
//                 Resolved Complaints
//               </p>
//               <p className="text-xl md:text-2xl font-bold text-green-600">
//                 {resolvedCount}
//               </p>
//             </div>
//             <div className="p-2 bg-green-100 rounded-full">
//               <CheckCircle size={20} className="text-green-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add Complaint Form */}
//       {showComplaintForm && (
//         <div className="bg-white p-4 shadow rounded-lg mb-6">
//           <h2 className="text-lg font-semibold mb-4">Register New Complaint</h2>
//           <form
//             onSubmit={handleSubmit}
//             className="grid grid-cols-1 md:grid-cols-2 gap-4"
//           >
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 House Number
//               </label>
//               <input
//                 type="text"
//                 name="houseNo"
//                 required
//                 value={newComplaint.houseNo}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Owner Name
//               </label>
//               <input
//                 type="text"
//                 name="ownerName"
//                 required
//                 value={newComplaint.ownerName}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Complaint Date
//               </label>
//               <input
//                 type="date"
//                 name="complaintDate"
//                 value={newComplaint.complaintDate}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Proof (File)
//               </label>
//               <input
//                 type="file"
//                 name="proof"
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Complaint Description
//               </label>
//               <textarea
//                 name="description"
//                 required
//                 value={newComplaint.description}
//                 onChange={handleInputChange}
//                 rows={3}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//               ></textarea>
//             </div>
//             <div className="md:col-span-2 flex justify-end space-x-2 mt-2">
//               <button
//                 type="button"
//                 onClick={() => setShowComplaintForm(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               >
//                 Submit Complaint
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Search & Filter */}
//       <div className="bg-white p-4 shadow rounded-lg mb-6">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div className="relative w-full md:w-64">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search size={18} className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search by house no or owner..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//           </div>
//           <div className="flex space-x-2">
//             <button
//               onClick={() => setFilterStatus("all")}
//               className={`px-3 py-1 rounded ${
//                 filterStatus === "all"
//                   ? "bg-gray-200"
//                   : "bg-white border border-gray-300"
//               }`}
//             >
//               All
//             </button>
//             <button
//               onClick={() => setFilterStatus("pending")}
//               className={`px-3 py-1 rounded ${
//                 filterStatus === "pending"
//                   ? "bg-yellow-100 text-yellow-800"
//                   : "bg-white border border-gray-300"
//               }`}
//             >
//               Pending
//             </button>
//             <button
//               onClick={() => setFilterStatus("ongoing")}
//               className={`px-3 py-1 rounded ${
//                 filterStatus === "ongoing"
//                   ? "bg-blue-100 text-blue-800"
//                   : "bg-white border border-gray-300"
//               }`}
//             >
//               Ongoing
//             </button>
//             <button
//               onClick={() => setFilterStatus("resolved")}
//               className={`px-3 py-1 rounded ${
//                 filterStatus === "resolved"
//                   ? "bg-green-100 text-green-800"
//                   : "bg-white border border-gray-300"
//               }`}
//             >
//               Resolved
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Complaints List */}
//       <div className="bg-white p-4 shadow rounded-lg">
//         <h2 className="text-lg font-semibold mb-4">Complaints</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="py-2 px-4 text-left">House No.</th>
//                 <th className="py-2 px-4 text-left">Owner</th>
//                 <th className="py-2 px-4 text-left">Date</th>
//                 <th className="py-2 px-4 text-left">Description</th>
//                 <th className="py-2 px-4 text-left">Proof</th>
//                 <th className="py-2 px-4 text-left">Status</th>
//                 <th className="py-2 px-4 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredComplaints.map((complaint) => (
//                 <tr key={complaint.id}>
//                   <td className="py-2 px-4">{complaint.houseNo}</td>
//                   <td className="py-2 px-4">{complaint.ownerName}</td>
//                   <td className="py-2 px-4">{complaint.complaintDate}</td>
//                   <td className="py-2 px-4">
//                     <div className="max-w-xs truncate">
//                       {complaint.description}
//                     </div>
//                   </td>
//                   <td className="py-2 px-4">
//                     <a
//                       href="#"
//                       className="text-blue-600 hover:text-blue-800 underline"
//                     >
//                       View
//                     </a>
//                   </td>
//                   <td className="py-2 px-4">
//                     {getStatusBadge(complaint.status)}
//                   </td>
//                   <td className="py-2 px-4">
//                     <div className="flex space-x-1">
//                       <select
//                         value={complaint.status}
//                         onChange={(e) =>
//                           handleStatusChange(complaint.id, e.target.value)
//                         }
//                         className="text-sm border border-gray-300 rounded p-1"
//                       >
//                         <option value="pending">Pending</option>
//                         <option value="ongoing">Ongoing</option>
//                         <option value="resolved">Resolved</option>
//                       </select>
//                       <button
//                         onClick={() => setSelectedComplaint(complaint)}
//                         className="p-1 text-blue-600 hover:text-blue-800"
//                         title="View Details"
//                       >
//                         <Edit size={16} />
//                       </button>
//                       <button
//                         className="p-1 text-red-600 hover:text-red-800"
//                         title="Delete"
//                       >
//                         <Trash size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };
// // ----------------- MAIN COMPONENT -----------------

// export {
//   PropertiesComponent,
//   ExpensesComponent,
//   PaymentsComponent,
//   MainComponent,
//   ComplaintsComponent,
// };
