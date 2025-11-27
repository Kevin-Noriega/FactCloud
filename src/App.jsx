//import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import MainLayout from "./layouts/MainLayout"; 
import Login from "./pages/Login";

// Páginas principales
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Productos from "./pages/Productos";
import Facturas from "./pages/Facturas";
import Reportes from "./pages/Reportes";
import RegistrarUsuario from "./pages/RegistrarUsuario";
import Perfil from "./pages/Perfil";

const NotFound = () => (
    <div className="text-center py-5">
        <h1 className="display-1 text-danger">404</h1>
        <p className="lead">Página no encontrada.</p>
    </div>
);


function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrarUsuario" element={<RegistrarUsuario/>} />

        <Route element={<MainLayout />}> 
          


          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/facturas" element={<Facturas />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/Perfil" element={<Perfil />} />

        </Route>
          
          <Route path="*" element={<NotFound />} /> 
        
      </Routes>
    </Router>
  );
}

export default App;
