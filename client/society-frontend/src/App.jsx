import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Navbar = lazy(() => import("./components/Navbar.jsx"));
const Footer = lazy(() => import("./components/Footer.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Suspense>
  );
};

export default App;
