import { useEffect, useState } from "react";
import { PritLogo } from "../assets/staticIcons";
import { Darkmode, Lightmode } from "../assets";

const Header = () => {
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
    <section className="flex items-center w-full ">
      <div className="flex flex-1 justify-center">
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
          {theme == "dark" ? <Lightmode /> : <Darkmode />}
        </button>
      </div>
    </section>
  );
};

export default Header;
