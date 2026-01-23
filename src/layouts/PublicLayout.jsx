import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";

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
