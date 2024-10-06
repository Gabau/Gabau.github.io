import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";

const NavBarWrapper = () => {
  return (
    <>
      <Navbar />
      <div className="w-full h-full">
        <Outlet />
      </div>
    </>
  );
};

export default NavBarWrapper;
