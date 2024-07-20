import { useEffect, useState } from "react";
import { Darkmode, Lightmode } from "./assets";

function App() {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("color-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleThemeToggle = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
      setTheme("dark");
    }
  };

  return (
    <section className=" dark:bg-darkBg bg-lightBg h-screen w-full bg-[linear-gradient(147deg,#f9fcff_0%,#dee4ea_74%)] dark:bg-[linear-gradient(315deg,#2b4162_0%,#12100e_74%)]">
      <div className="w-full flex justify-end">
        <button
          id="theme-toggle"
          type="button"
          onClick={handleThemeToggle}
          className="text-gray-500   dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
        >
          {theme == "dark" ? <Lightmode /> : <Darkmode />}
        </button>
      </div>
    </section>
  );
}

export default App;
