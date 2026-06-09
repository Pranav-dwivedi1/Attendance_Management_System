import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row justify-between items-center gap-2">
          {/* Copyright */}
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
            <p>© {currentYear} Attendly. All rights reserved.</p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-gray-500 dark:text-gray-400 order-1 sm:order-2">
            <Link 
              to="/privacy" 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-300 dark:text-gray-600 hidden xs:inline">•</span>
            <Link 
              to="/terms" 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <span className="text-gray-300 dark:text-gray-600 hidden xs:inline">•</span>
            <Link 
              to="/help" 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              Help Center
            </Link>
            <span className="text-gray-300 dark:text-gray-600 hidden xs:inline">•</span>
            <Link 
              to="/contact" 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Social Links (Optional) */}
        <div className="flex justify-center space-x-4 mt-4 pt-2 border-t border-gray-100 dark:border-gray-800">
          <a
            href="#"
            className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter text-sm sm:text-base"></i>
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin text-sm sm:text-base"></i>
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <i className="fab fa-github text-sm sm:text-base"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}