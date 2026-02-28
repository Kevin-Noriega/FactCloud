import { Outlet } from "react-router-dom";
import NavBarSecondary from "./NavbarSecondary";
import Footer from "./Footer";

export default function RegisterLayout() {
  return (
    <>
     
      <NavBarSecondary />
      <Outlet />
      <Footer/>
    </>
  );
}
