import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

// Componentes de Layout
import MainLayout from "./layouts/MainLayout"; 
import Login from "./pages/Login";

// Páginas principales
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Productos from "./pages/Productos";
import Facturas from "./pages/Facturas";
import Reportes from "./pages/Reportes";
import RegistrarUsuario from "./pages/RegistrarUsuario";

// Componente de página no encontrada
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
        
        {/* 1. Ruta de Login (Separada) */}
        <Route path="/" element={<Login />} />
        <Route path="/registrar-usuario" element={<RegistrarUsuario/>} />

        {/* 2. Ruta de Layout Principal (Parent Route con Sidebar) */}
        <Route element={<MainLayout />}> 
          
          {/* Rutas Hijas (Se renderizan dentro de <Outlet /> en MainLayout) */}


          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/facturas" element={<Facturas />} />
          <Route path="/reportes" element={<Reportes />} />
          
          {/* Ruta 404/Not Found, usando el mismo Layout */}
          <Route path="*" element={<NotFound />} /> 

        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
