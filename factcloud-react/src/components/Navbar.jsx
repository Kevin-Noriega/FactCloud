import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar px-3">
      <a className="navbar-brand fs-4" href="/dashboard">
        Fact<span className="text-success">Cloud</span>
      </a>
      <button onClick={() => navigate("/")} className="btn btn-outline-light btn-sm">
        Cerrar sesión
      </button>
    </nav>
  );
};

export default Navbar;
