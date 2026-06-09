import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  useLoginMutation,
  useManagersQuery,
  useSignupMutation,
} from "../store/api.js";
import { setCredentials } from "../store/authSlice.js";

export default function AuthPage({ mode }) {
  const isSignup = mode === "signup";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    manager: "",
  });

  const [login, loginState] = useLoginMutation();
  const [signup, signupState] = useSignupMutation();

  const { data: managers = [] } = useManagersQuery(undefined, {
    skip: !isSignup,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = loginState.error || signupState.error;

  useEffect(() => {
    const data = loginState.data || signupState.data;

    if (data) {
      dispatch(setCredentials(data));
      navigate("/dashboard", { replace: true });
    }
  }, [loginState.data, signupState.data, dispatch, navigate]);

  const update = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    try {
      if (isSignup) {
        await signup({
          ...form,
          manager: form.manager || undefined,
        }).unwrap();
      } else {
        await login({
          email: form.email,
          password: form.password,
        }).unwrap();
      }
    } catch (err) {
      console.error("Authentication failed:", err);
    }
  };

  const loading = loginState.isLoading || signupState.isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Logo/Brand Section */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {isSignup
              ? "Join us and start managing your attendance"
              : "Sign in to your account to continue"}
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-all duration-300 hover:shadow-xl">
          <form onSubmit={submit} className="p-6 sm:p-8 space-y-5">
            {/* Name Field - Signup Only */}
            {isSignup && (
              <div className="transform transition-all duration-200">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <i className="fas fa-user mr-2 text-indigo-500"></i>
                  Full Name
                </label>
                <div className="relative">
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={update}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 pl-10"
                  />
                  <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <i className="fas fa-envelope mr-2 text-indigo-500"></i>
                Email Address
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 pl-10"
                />
                <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <i className="fas fa-lock mr-2 text-indigo-500"></i>
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={update}
                  placeholder="••••••••"
                  minLength={6}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 pl-10"
                />
                <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Minimum 6 characters
              </p>
            </div>

            {/* Role & Manager Fields - Signup Only */}
            {isSignup && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <i className="fas fa-user-tag mr-2 text-indigo-500"></i>
                    Role
                  </label>
                  <div className="relative">
                    <select
                      name="role"
                      value={form.role}
                      onChange={update}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none pl-10"
                    >
                      <option value="employee">👔 Employee</option>
                      <option value="manager">📊 Manager</option>
                      <option value="admin">⚙️ Admin</option>
                    </select>
                    <i className="fas fa-user-tag absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                {form.role === "employee" && (
                  <div className="transform transition-all duration-300 animate-in slide-in-from-top-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <i className="fas fa-user-tie mr-2 text-indigo-500"></i>
                      Assign Manager
                    </label>
                    <div className="relative">
                      <select
                        name="manager"
                        value={form.manager}
                        onChange={update}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none pl-10"
                      >
                        <option value="">No Manager Assigned</option>
                        {managers.map((manager) => (
                          <option key={manager._id} value={manager._id}>
                            {manager.name} ({manager.role})
                          </option>
                        ))}
                      </select>
                      <i className="fas fa-user-tie absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg p-4 animate-shake">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="fas fa-exclamation-circle text-red-500"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      {error?.data?.message ||
                        error?.message ||
                        "Authentication failed"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  Please wait...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <i
                    className={`fas ${isSignup ? "fa-user-plus" : "fa-sign-in-alt"}`}
                  ></i>
                  {isSignup ? "Sign Up" : "Log In"}
                </span>
              )}
            </button>

            {/* Toggle Auth Mode Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {isSignup ? "Already have an account?" : "Need an account?"}{" "}
                <Link
                  to={isSignup ? "/login" : "/signup"}
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 hover:underline"
                >
                  <i
                    className={`fas ${isSignup ? "fa-sign-in-alt" : "fa-user-plus"} mr-1`}
                  ></i>
                  {isSignup ? "Log In" : "Sign Up"}
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>Secure authentication • Protected by industry standards</p>
        </div>
      </div>

      {/* Custom Animation Keyframes - Add to your global CSS or tailwind config */}
      <style jsx>{`
        @keyframes slide-in-from-top {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-in {
          animation: slide-in-from-top 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
