import { Outlet } from "react-router-dom";
import NavBarSecondary from "./NavbarSecondary";

export default function RegisterLayout() {
  return (
    <>
     
      <NavBarSecondary />
      <Outlet />
    </>
  );
}
