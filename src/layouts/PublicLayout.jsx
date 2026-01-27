import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import NavBar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "../components/ChatBot";

export default function PublicLayout() {
  return (
    <>
      <TopBar />
      <NavBar />
      <Outlet />
      <Footer />
      <Chatbot />
    </>
  );
}
