import { useContext, useEffect } from "react";
import { PritLogo } from "../assets/staticIcons";
import { Darkmode, Lightmode } from "../assets";
import { ThemeContext } from "../context/ThemeContext";

const Header = () => {
  const themeContext = useContext(ThemeContext);
  useEffect(() => {
    const storedTheme = localStorage.getItem("color-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      themeContext?.setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      themeContext?.setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleThemeToggle = () => {
    if (themeContext?.theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
      themeContext?.setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
      themeContext?.setTheme("dark");
    }
  };

  return (
    <section className="flex items-center w-full ">
      <div className="flex flex-1 justify-center items-center gap-2">
        <img src={PritLogo} alt="Logo" className="size-10" />
        <span className="font-semibold  text-2xl dark:text-white">
          Prit Meet
        </span>
      </div>
      <div className="">
        <button
          id="theme-toggle"
          type="button"
          onClick={handleThemeToggle}
          className="text-gray-500   dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
        >
          {themeContext?.theme == "dark" ? <Lightmode /> : <Darkmode />}
        </button>
      </div>
    </section>
  );
};

export default Header;
