import { Link } from "react-router-dom";
import MoonSunToggle from "./MoonSunToggle";

const Navbar = () => {
  return (
    <nav className="bg-gray-200 dark:bg-gray-800 p-4 flex justify-between items-center sticky md:h-14 xl:h-14 sm:h-10 w-full top-0">
      <ul className="flex space-x-6">
        <li className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer">
          <Link to="/">Home</Link>
        </li>
        <li className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer">
          <Link to="/about">About</Link>
        </li>
        <li className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer">
          <Link to="/contact">Contact</Link>
        </li>
        <li className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer">
          <Link to="/projects">Projects</Link>
        </li>
        <li className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer">
          <Link to="/playground">Playground</Link>
        </li>
      </ul>
      {/* <button
        className="text-black dark:text-white bg-transparent border-none cursor-pointer"
        onClick={() => {
            if (theme === 'light') {
                setTheme('dark');
            } else {
                setTheme('light');
            }
        }}
      >
        {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
      </button> */}
      <MoonSunToggle />
    </nav>
  );
};

export default Navbar;
