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

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("dark-mode", darkMode.toString());
  }, [darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e) => {
      if (localStorage.getItem("dark-mode") === null) {
        setDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((current) => !current);
    
    // Add haptic feedback on supported devices
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={`
        relative inline-flex items-center justify-center
        rounded-full border border-slate-300 dark:border-slate-600
        p-2.5 xs:p-2.5 sm:p-3
        text-slate-900 dark:text-slate-100
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        ${isPressed ? 'scale-95' : 'scale-100'}
        ${isHovered && !isPressed ? 'scale-105' : ''}
        bg-white dark:bg-slate-900
        hover:border-slate-400 hover:bg-slate-100
        dark:hover:border-slate-500 dark:hover:bg-slate-800
        shadow-sm hover:shadow-md
        active:shadow-inner
      `}
      aria-label={darkMode ? "Disable dark mode" : "Enable dark mode"}
      aria-live="polite"
    >
      {/* Animated background effect */}
      <span className="absolute inset-0 rounded-full overflow-hidden">
        <span 
          className={`
            absolute inset-0 transition-all duration-300 ease-out
            ${darkMode ? 'opacity-0' : 'opacity-100'}
          `}
        >
          <span className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-10 rounded-full"></span>
        </span>
        <span 
          className={`
            absolute inset-0 transition-all duration-300 ease-out
            ${darkMode ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <span className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-10 rounded-full"></span>
        </span>
      </span>

      {/* Sun/Moon icons with animation */}
      <div className="relative z-10">
        <div
          className={`
            transition-all duration-300 transform
            ${darkMode ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}
          `}
        >
          {darkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 xs:h-5 xs:w-5 sm:h-5 sm:w-5"
              aria-hidden="true"
            >
              <path d="M21.752 15.002A9.718 9.718 0 0 1 12 21.75 9.75 9.75 0 1 1 20.25 12c0 .24-.011.48-.034.717a.75.75 0 0 1-1.054.704 7.5 7.5 0 1 0-8.188-10.877.75.75 0 0 1-.902-1.086A9.75 9.75 0 1 1 21.75 12c0 .277-.027.55-.079.818a.75.75 0 0 1 .081.184Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 xs:h-5 xs:w-5 sm:h-5 sm:w-5"
              aria-hidden="true"
            >
              <path d="M12 18.25a6.25 6.25 0 1 0 0-12.5 6.25 6.25 0 0 0 0 12.5ZM12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm0-20a.75.75 0 0 1 .75.75V3.5a.75.75 0 0 1-1.5 0V.75A.75.75 0 0 1 12 0Zm0 20a.75.75 0 0 1 .75.75v2.75a.75.75 0 0 1-1.5 0V20.75A.75.75 0 0 1 12 20Zm11.25-8.25a.75.75 0 0 1-.75.75H19.5a.75.75 0 0 1 0-1.5h2.75a.75.75 0 0 1 .75.75ZM4.5 12a.75.75 0 0 1-.75.75H1a.75.75 0 0 1 0-1.5h2.75A.75.75 0 0 1 4.5 12Zm15.25 6.467a.75.75 0 0 1-1.06 0l-1.947-1.947a.75.75 0 1 1 1.06-1.06l1.947 1.947a.75.75 0 0 1 0 1.06Zm-12.427-12.427a.75.75 0 0 1-1.06 0L4.316 4.093a.75.75 0 1 1 1.06-1.06l1.947 1.947a.75.75 0 0 1 0 1.06ZM20.25 4.093a.75.75 0 0 1 0 1.06l-1.947 1.947a.75.75 0 1 1-1.06-1.06l1.947-1.947a.75.75 0 0 1 1.06 0ZM4.316 19.967a.75.75 0 0 1 0 1.06l-1.947 1.947a.75.75 0 1 1-1.06-1.06l1.947-1.947a.75.75 0 0 1 1.06 0Z" />
            </svg>
          )}
        </div>
      </div>

      {/* Ripple effect on click */}
      <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
        <span
          className={`
            absolute inset-0 bg-white dark:bg-black
            transition-all duration-300 ease-out
            transform scale-0 opacity-0
            group-active:scale-100 group-active:opacity-20
          `}
        />
      </span>

      {/* Tooltip for better UX on desktop */}
      <span className="sr-only">
        {darkMode ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </button>
  );
}