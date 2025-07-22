import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../appContext/UserContext";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import baseURL from "../API/baseUrl";

export default function LoginPage() {
  const { setUserInContext } = useUser();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      setLoading(true);
      const response = await fetch(`${baseURL}/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: values.username,
          password: values.password,
        }),
      });
      setLoading(false);
      if (response.status == 200) {
        const data = await response.json();
        setUserInContext(data);

        // Get roleName safely from both possible structures
        console.log("User Data:", data);
        const roleName =
        
          data?.data?.profile?.role?.roleName?.toLowerCase();
console.log("Role Name:", roleName);
        if (roleName === "admin") {
          navigate("/dashboard/Vendordashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.error("Invalid Credentials");
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main login card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-teal-100 overflow-hidden">
          {/* Header section with gradient */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-teal-100 text-sm mt-1">
              Sign in to your account
            </p>
          </div>

          {/* Form section */}
          <div className="px-8 py-8">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Username field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Username or Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                  </div>
                  <input
                    name="username"
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 transition-all duration-200 bg-gray-50 focus:bg-white"
                    required
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    placeholder="Enter your username or email"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 transition-all duration-200 bg-gray-50 focus:bg-white"
                    required
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    placeholder="Enter your password"
                    onKeyDown={(e) => {
                      if (e.key == "enter") formik.handleSubmit();
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <a
                  href="/"
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium hover:underline transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:from-teal-400 disabled:to-teal-500 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                style={{ cursor: "pointer" }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </form>

            {/* Sign up link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-teal-600 hover:text-teal-700 font-semibold hover:underline transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Additional decorative elements */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Secure login protected by advanced encryption
          </p>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
