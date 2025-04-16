import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import Dashboard from "./components/Dashboard.jsx";
import UnderConstruction from "./pages/UnderConstruction.jsx";
import AdminDashboard from "./components/Admin/AdminHomeDashboard.jsx";
import ComplaintsComponent from "./components/Admin/AdminComplaintsDashboard.jsx";
import ExpensesComponent from "./components/Admin/AdminExpenses.jsx";
import PaymentsComponent from "./components/Admin/AdminPayments.jsx";
import Properties from "./components/Admin/AdminProperties.jsx";
import MainComponent from "./pages/AdminPanel.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Navbar = lazy(() => import("./components/Navbar.jsx"));
const Footer = lazy(() => import("./components/Footer.jsx"));
const LoginSignup = lazy(() => import("./pages/LoginSignup.jsx"));

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<LoginSignup />} />
        <Route path="/dashboard/user" element={<Dashboard />} />
        <Route path="/dashboard/admin" element={<MainComponent />} />
        <Route path="/under-construction" element={<UnderConstruction />} />

        {/* baad mein admin dashboard bhi add hoga yahan */}
      </Routes>
    </Suspense>
  );
};

export default App;
