import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice.js";
import DarkModeToggle from "./DarkModeToggle.jsx";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const signOut = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
    setIsMobileMenuOpen(false);
  };

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize (switch to desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = "unset";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = "unset";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Lock scroll when menu opens
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = "unset";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = "unset";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg dark:bg-gray-900/95"
            : "bg-white shadow-md dark:bg-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
            {/* Logo/Brand */}
            <Link
              className="flex items-center space-x-1.5 sm:space-x-2 group flex-shrink-0"
              to="/dashboard"
              onClick={closeMobileMenu}
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl p-1.5 sm:p-2 transform transition-transform group-hover:scale-105">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-white"
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
              <span className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Attendly
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <DarkModeToggle />
              {user ? (
                <div className="flex items-center space-x-1 lg:space-x-2">
                  {/* User Info Badge */}
                  <div className="px-2 lg:px-3 py-2 text-sm text-gray-600 dark:text-gray-300 flex items-center space-x-2">
                    <div className="w-7 h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs lg:text-sm font-medium">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <span className="hidden xl:inline font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                      {user.name}
                    </span>
                  </div>

                  <Link
                    to="/dashboard"
                    className="px-3 lg:px-4 py-2 text-sm lg:text-base text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition-colors duration-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 whitespace-nowrap"
                  >
                    <i className="fas fa-tachometer-alt mr-1 lg:mr-2"></i>
                    <span className="hidden lg:inline">Dashboard</span>
                    <span className="lg:hidden">Home</span>
                  </Link>
                  <Link
                    to="/reports"
                    className="px-3 lg:px-4 py-2 text-sm lg:text-base text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition-colors duration-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 whitespace-nowrap"
                  >
                    <i className="fas fa-chart-line mr-1 lg:mr-2"></i>
                    Reports
                  </Link>
                  <button
                    type="button"
                    onClick={signOut}
                    className="px-3 lg:px-4 py-2 text-sm lg:text-base bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 ml-1 lg:ml-2 shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    <i className="fas fa-sign-out-alt mr-1 lg:mr-2"></i>
                    <span className="hidden sm:inline">Logout</span>
                    <span className="sm:hidden">Exit</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1 lg:space-x-2">
                  <Link
                    to="/login"
                    className="px-3 lg:px-4 py-2 text-sm lg:text-base text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition-colors duration-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 whitespace-nowrap"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-3 lg:px-4 py-2 text-sm lg:text-base bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:hidden">
              <DarkModeToggle />
              <button
                ref={menuButtonRef}
                onClick={toggleMobileMenu}
                className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-around">
                  <span
                    className={`block w-5 sm:w-6 h-0.5 bg-current transform transition-all duration-300 ${
                      isMobileMenuOpen ? "rotate-45 translate-y-1.5 sm:translate-y-2" : ""
                    }`}
                  ></span>
                  <span
                    className={`block w-5 sm:w-6 h-0.5 bg-current transition-all duration-300 ${
                      isMobileMenuOpen ? "opacity-0" : ""
                    }`}
                  ></span>
                  <span
                    className={`block w-5 sm:w-6 h-0.5 bg-current transform transition-all duration-300 ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-1.5 sm:-translate-y-2" : ""
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 z-40 md:hidden ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Navigation Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-900 shadow-2xl transition-all duration-300 ease-in-out transform z-50 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-1.5">
                <svg
                  className="h-5 w-5 text-white"
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
              <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Attendly
              </span>
            </div>
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Close menu"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {user ? (
              <>
                {/* Mobile User Info */}
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-base font-medium">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                >
                  <i className="fas fa-tachometer-alt w-5 mr-3 text-lg"></i>
                  <span className="flex-1">Dashboard</span>
                  <i className="fas fa-chevron-right text-xs opacity-50"></i>
                </Link>
                
                <Link
                  to="/reports"
                  onClick={closeMobileMenu}
                  className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                >
                  <i className="fas fa-chart-line w-5 mr-3 text-lg"></i>
                  <span className="flex-1">Reports</span>
                  <i className="fas fa-chevron-right text-xs opacity-50"></i>
                </Link>

                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={signOut}
                    className="w-full flex items-center px-4 py-3 text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200"
                  >
                    <i className="fas fa-sign-out-alt w-5 mr-3 text-lg"></i>
                    <span className="flex-1 text-left">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                >
                  <i className="fas fa-sign-in-alt w-5 mr-3 text-lg"></i>
                  <span className="flex-1">Login</span>
                  <i className="fas fa-chevron-right text-xs opacity-50"></i>
                </Link>
                
                <Link
                  to="/signup"
                  onClick={closeMobileMenu}
                  className="flex items-center px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                >
                  <i className="fas fa-user-plus w-5 mr-3 text-lg"></i>
                  <span className="flex-1">Sign Up</span>
                  <i className="fas fa-arrow-right text-xs"></i>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              © 2026 Attendly
            </p>
          </div>
        </div>
      </div>
    </>
  );
}