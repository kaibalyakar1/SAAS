import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginSignup = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  // 👇 Added loading state
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
    houseNumber: "",
    role: "TENANT",
    numberOfFloors: "1FLOOR",
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseURL = import.meta.env.VITE_API_URL;

    // 👇 Set loading to true when request starts
    setIsLoading(true);

    if (isLogin) {
      if (!formData.phone || !formData.password) {
        Swal.fire("Error", "Please fill in all fields!", "error");
        setIsLoading(false);
        return;
      }
      console.log("Form Data:", formData);

      // Static Admin Login Check
      if (formData.phone === "7978797141" && formData.password === "NV1234") {
        setIsLoading(false);
        Swal.fire("Admin Login", "Welcome Admin!", "success").then(() => {
          navigate("/dashboard/admin");
        });
        return;
      }

      // Normal User Login
      try {
        const res = await axios.post(`${baseURL}/api/v1/auth/login`, {
          phoneNumber: formData.phone,
          password: formData.password,
        });

        const { success, user, token, message } = res.data;
        setIsLoading(false);

        if (success) {
          Swal.fire("Login Successful", message, "success").then(() => {
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/dashboard/user");
          });
        } else {
          Swal.fire("Login Failed", message, "error");
        }
      } catch (err) {
        setIsLoading(false);
        Swal.fire(
          "Error",
          err.response?.data?.message || "Server error",
          "error"
        );
      }
    } else {
      // Signup logic
      if (
        !formData.phone ||
        !formData.password ||
        !formData.confirmPassword ||
        !formData.name ||
        !formData.email ||
        !formData.houseNumber
      ) {
        Swal.fire("Error", "Please fill in all fields!", "error");
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        Swal.fire("Error", "Passwords do not match!", "error");
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.post(`${baseURL}/api/v1/auth/signup`, {
          ownerName: formData.name,
          phoneNumber: formData.phone,
          email: formData.email,
          houseNumber: formData.houseNumber,
          flatType: formData.numberOfFloors,
          role: formData.role,
          password: formData.password,
        });
        console.log("Form Data:", formData);

        setIsLoading(false);

        if (res.data.success) {
          Swal.fire("Signup Successful", "Account created!", "success");
          setTimeout(() => setIsLogin(true), 1000);
        } else {
          Swal.fire("Error", res.data.message || "Signup failed", "error");
        }
      } catch (err) {
        setIsLoading(false);
        Swal.fire(
          "Error",
          err.response?.data?.message || "Server error",
          "error"
        );
      }
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4 py-12">
      <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
          {isLogin ? "Login" : "Signup"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="houseNumber"
                placeholder="House Number (e.g., NV123)"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                onChange={handleInputChange}
                required
              />
              <div className="flex space-x-4">
                <div className="w-full">
                  <label className="block text-sm">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="OWNER">Owner</option>
                    <option value="TENANT">Tenant</option>
                  </select>
                </div>
              </div>
              <div className="w-full">
                <label className="block text-sm">Number of Floors</label>
                <select
                  name="numberOfFloors"
                  value={formData.numberOfFloors}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="1FLOOR">1</option>
                  <option value="2FLOOR">2</option>
                  <option value="2.5FLOOR">2.5</option>
                  <option value="3FLOOR">3</option>
                </select>
              </div>
            </>
          )}

          <input
            type="text"
            name="phone"
            placeholder="Mobile Number"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={handleInputChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            onChange={handleInputChange}
            required
          />

          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              onChange={handleInputChange}
              required
            />
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-300 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              // 👇 Loading spinner
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                {isLogin ? "Logging in..." : "Creating Account..."}
              </div>
            ) : (
              <span>{isLogin ? "Login" : "Create Account"}</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:underline font-medium"
              disabled={isLoading}
            >
              {isLogin ? "Signup" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginSignup;
