import { Outlet, useLocation } from "react-router-dom";
import NavBarSecondary from "./NavbarSecondary";
import Footer from "./Footer";

export default function RegisterLayout() {
  const location = useLocation();
  const isCheckout = location.pathname === "/checkout";

  return (
    <>
      {!isCheckout && <NavBarSecondary />}
      <Outlet />
    </>
  );
}
