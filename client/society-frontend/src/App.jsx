import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Navbar = lazy(() => import("./components/Navbar.jsx"));
const Footer = lazy(() => import("./components/Footer.jsx"));
const LoginSignup = lazy(() => import("./pages/LoginSignup.jsx"));
const UserDashboard = lazy(() => import("./components/UserDashboard.jsx"));

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<LoginSignup />} />
        <Route path="/dashboard/user" element={<UserDashboard />} />
        {/* baad mein admin dashboard bhi add hoga yahan */}
      </Routes>
      <Footer />
    </Suspense>
  );
};

export default App;
