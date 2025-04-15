import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // 👈 add this

const LoginSignup = () => {
  const navigate = useNavigate(); // 👈 initialize
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
    houseNumber: "",
    role: "tenant",
    numberOfFloors: "1",
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      if (!formData.phone || !formData.password) {
        Swal.fire("Error", "Please fill in all fields!", "error");
        return;
      }

      // 👉 Static Admin Login Check
      if (formData.phone === "7978797141" && formData.password === "NV1234") {
        Swal.fire("Admin Login", "Welcome Admin!", "success").then(() => {
          navigate("/dashboard/admin");
        });
        return;
      }

      // 👉 Normal User Login
      Swal.fire("Login Successful", "Welcome back!", "success").then(() => {
        navigate("/dashboard/user");
      });
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
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        Swal.fire("Error", "Passwords do not match!", "error");
        return;
      }

      Swal.fire("Signup Successful", "Account created!", "success");
      setTimeout(() => setIsLogin(true), 1000);
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
                    <option value="tenant">Tenant</option>
                    <option value="owner">Owner</option>
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
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="2.5">2.5</option>
                  <option value="3">3</option>
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-300"
          >
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:underline font-medium"
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
