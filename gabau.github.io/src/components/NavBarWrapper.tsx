import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";

const NavBarWrapper = () => {
  return (
    <>
      <Navbar />
      <div className="w-full h-full overflow-auto">
        <Outlet />
      </div>
    </>
  );
};

export default NavBarWrapper;
