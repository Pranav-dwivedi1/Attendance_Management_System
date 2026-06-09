import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const savedPreference = localStorage.getItem("dark-mode");
    if (savedPreference !== null) {
      return savedPreference === "true";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    
    console.log("Dark mode toggled:", darkMode); // Debug log
    
    if (darkMode) {
      root.classList.add("dark");
      console.log("Added dark class to HTML"); // Debug log
    } else {
      root.classList.remove("dark");
      console.log("Removed dark class from HTML"); // Debug log
    }

    localStorage.setItem("dark-mode", darkMode.toString());
  }, [darkMode]);

  // Check current state on mount
  useEffect(() => {
    console.log("Initial dark mode state:", darkMode);
    console.log("HTML classes:", document.documentElement.classList);
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        console.log("Toggle clicked"); // Debug log
        setDarkMode((current) => !current);
      }}
      className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white p-3 text-slate-900 shadow-sm transition-colors duration-200 hover:border-slate-400 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-800"
      aria-label={darkMode ? "Disable dark mode" : "Enable dark mode"}
    >
      {darkMode ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M21.752 15.002A9.718 9.718 0 0 1 12 21.75 9.75 9.75 0 1 1 20.25 12c0 .24-.011.48-.034.717a.75.75 0 0 1-1.054.704 7.5 7.5 0 1 0-8.188-10.877.75.75 0 0 1-.902-1.086A9.75 9.75 0 1 1 21.75 12c0 .277-.027.55-.079.818a.75.75 0 0 1 .081.184Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M12 18.25a6.25 6.25 0 1 0 0-12.5 6.25 6.25 0 0 0 0 12.5ZM12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm0-20a.75.75 0 0 1 .75.75V3.5a.75.75 0 0 1-1.5 0V.75A.75.75 0 0 1 12 0Zm0 20a.75.75 0 0 1 .75.75v2.75a.75.75 0 0 1-1.5 0V20.75A.75.75 0 0 1 12 20Zm11.25-8.25a.75.75 0 0 1-.75.75H19.5a.75.75 0 0 1 0-1.5h2.75a.75.75 0 0 1 .75.75ZM4.5 12a.75.75 0 0 1-.75.75H1a.75.75 0 0 1 0-1.5h2.75A.75.75 0 0 1 4.5 12Zm15.25 6.467a.75.75 0 0 1-1.06 0l-1.947-1.947a.75.75 0 1 1 1.06-1.06l1.947 1.947a.75.75 0 0 1 0 1.06Zm-12.427-12.427a.75.75 0 0 1-1.06 0L4.316 4.093a.75.75 0 1 1 1.06-1.06l1.947 1.947a.75.75 0 0 1 0 1.06ZM20.25 4.093a.75.75 0 0 1 0 1.06l-1.947 1.947a.75.75 0 1 1-1.06-1.06l1.947-1.947a.75.75 0 0 1 1.06 0ZM4.316 19.967a.75.75 0 0 1 0 1.06l-1.947 1.947a.75.75 0 1 1-1.06-1.06l1.947-1.947a.75.75 0 0 1 1.06 0Z" />
        </svg>
      )}
    </button>
  );
}