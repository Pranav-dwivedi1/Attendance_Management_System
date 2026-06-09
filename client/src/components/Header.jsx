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

  // Dashboard Icon SVG
  const DashboardIcon = () => (
    <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  // Reports Icon SVG
  const ReportsIcon = () => (
    <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  // Logout Icon SVG
  const LogoutIcon = () => (
    <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );

  // Login Icon SVG
  const LoginIcon = () => (
    <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
  );

  // Signup Icon SVG
  const SignupIcon = () => (
    <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  );

  // Close Icon SVG
  const CloseIcon = () => (
    <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg dark:bg-gray-900/95"
            : "bg-white shadow-md dark:bg-gray-900"
        }`}
      >
        <div className="w-full">
          <div className="flex justify-between items-center h-14 xs:h-16 sm:h-18 md:h-20 px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8">
            {/* Logo/Brand */}
            <Link
              className="flex items-center gap-2 group flex-shrink-0"
              to="/dashboard"
              onClick={closeMobileMenu}
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-1.5 xs:p-2 transform transition-transform group-hover:scale-105">
                <svg
                  className="h-5 w-5 xs:h-6 xs:w-6 text-white"
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
              <span className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Attendly
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2 lg:space-x-3">
              <DarkModeToggle />
              {user ? (
                <div className="flex items-center space-x-2 lg:space-x-3">
                  {/* User Info Badge */}
                  <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 flex items-center space-x-2">
                    <div className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <span className="hidden xl:inline font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </span>
                  </div>

                  <Link
                    to="/dashboard"
                    className="px-3 lg:px-4 py-2 text-sm lg:text-base text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition-colors duration-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/reports"
                    className="px-3 lg:px-4 py-2 text-sm lg:text-base text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition-colors duration-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  >
                    Reports
                  </Link>
                  <button
                    type="button"
                    onClick={signOut}
                    className="px-3 lg:px-4 py-2 text-sm lg:text-base bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <Link
                    to="/login"
                    className="px-3 lg:px-4 py-2 text-sm lg:text-base text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition-colors duration-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-3 lg:px-4 py-2 text-sm lg:text-base bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button - Pure CSS Hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <DarkModeToggle />
              <button
                ref={menuButtonRef}
                onClick={toggleMobileMenu}
                className="relative w-10 h-10 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 flex items-center justify-center"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                <div className="w-5 h-5 flex flex-col justify-between items-center">
                  <span
                    className={`block w-full h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                    }`}
                  />
                  <span
                    className={`block w-full h-0.5 bg-current transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`block w-full h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 z-40 md:hidden ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Sidebar Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 ease-in-out transform z-50 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
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
              <CloseIcon />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {user ? (
              <div className="space-y-4">
                {/* User Info Card */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl">
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

                {/* Navigation Links */}
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                >
                  <DashboardIcon />
                  <span className="flex-1 font-medium">Dashboard</span>
                  <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                
                <Link
                  to="/reports"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                >
                  <ReportsIcon />
                  <span className="flex-1 font-medium">Reports</span>
                  <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                {/* Logout Button */}
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={signOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200"
                  >
                    <LogoutIcon />
                    <span className="flex-1 text-left font-medium">Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                >
                  <LoginIcon />
                  <span className="flex-1 font-medium">Login</span>
                  <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                
                <Link
                  to="/signup"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                >
                  <SignupIcon />
                  <span className="flex-1 font-medium">Sign Up</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              © 2026 Attendly. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}