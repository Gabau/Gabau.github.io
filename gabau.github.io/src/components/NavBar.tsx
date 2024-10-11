import { Link } from "react-router-dom";
import MoonSunToggle from "./MoonSunToggle";
import { useContext, useRef, useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap/gsap-core";
import GithubIcon from "/github-mark.svg"
import LighGithubIcon from "/github-mark-white.svg"
import ThemeContext from "../context/ThemeContext";
import { FaLinkedin, FaLinkedinIn } from "react-icons/fa";

const RightItems = () => {
  const {theme} = useContext(ThemeContext);

  return (<div className="flex flex-row space-x-6">
      <Link to="https://www.linkedin.com/in/gabriel-au-chen-xi-9a764b21b/" className="flex h-8">
        {theme === "light" && <FaLinkedin className="w-full h-full"/>}
        {theme === "dark" && <FaLinkedinIn className="w-full h-full" />}
      </Link>
      <Link to="https://github.com/Gabau" className="flex h-8">
        {theme === "light" && <img src={GithubIcon} className="object-contain w-auto h-auto" />}
        {theme === "dark" && <img src={LighGithubIcon} className="object-contain w-auto h-auto" />}
      </Link>
      <MoonSunToggle />
    </div>);
}

const NavDrawer = ({
  openDrawer,
  onDrawerClose,
  height,
}: {
  openDrawer: boolean;
  onDrawerClose: () => void;
  height?: number;
}) => {
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const heightWrapper = height ?? 384;
  useGSAP(() => {
    if (openDrawer) {
      gsap.to(drawerRef.current, { duration: 1, top: "0px" });
    } else {
        gsap.to(drawerRef.current, { duration: 1, top: `-${heightWrapper}px` });
    }
  }, [openDrawer]);
  return (
    <>
      <div
        ref={drawerRef}
        style={{ height: heightWrapper, top: -heightWrapper }}
        className={`flex bg-slate-300 flex-col justify-end absolute w-full dark:bg-slate-700 z-10`}
      >
        <ul className="space-y-2 p-2">
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
      </div>

      <div
        onClick={() => {
          onDrawerClose();
        }}
        className="z-9 bg-black/45 absolute w-screen h-screen"
        hidden={!openDrawer}
      ></div>
    </>
  );
};

const Navbar = () => {
  const [expandMenu, setExpandMenu] = useState(false);

  // handle small width screens
  if (window.screen.availWidth < 1024) {
    return (
      <div className="w-full">
        <NavDrawer
          height={250}
          openDrawer={expandMenu}
          onDrawerClose={() => setExpandMenu(false)}
        />
        <nav className="bg-gray-200 z-10 dark:bg-gray-800 p-4 flex justify-between items-center sticky md:h-14 xl:h-14 sm:h-10 w-full top-0">
          <ul className="flex space-x-6">
            <button onClick={() => setExpandMenu(!expandMenu)}>
              <CiMenuBurger />
            </button>
          </ul>
          <RightItems />
        </nav>
      </div>
    );
  }

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
      <RightItems />
    </nav>
  );
};

export default Navbar;
