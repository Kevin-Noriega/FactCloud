import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import NavBar from "./Navbar";
import Footer from "./Footer";

export default function PublicLayout() {
  return (
    <>
      <TopBar />
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
}
