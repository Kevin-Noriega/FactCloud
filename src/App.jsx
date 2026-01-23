import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToHash from "./components/ScrollToHash";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/Auth";
import PublicLayout from "./layouts/PublicLayout";
import TopBar from "./components/TopBar";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";

// Páginas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Productos from "./pages/Productos";
import Facturas from "./pages/Facturas";
import Reportes from "./pages/Reportes";
import Perfil from "./pages/Perfil";
import Planes from "./pages/Planes";
import ComoFunciona from "./pages/ComoFunciona";
import DIAN from "./pages/DIAN";
import Soporte from "./pages/Soporte";

const NotFound = () => (
  <div className="text-center py-5">
    <h1 className="display-1 text-danger">404</h1>
    <p className="lead">Página no encontrada.</p>
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToHash />

      <Routes>
        {/* 🔹 AUTH (sin navbar/footer) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Route>

        {/* 🔹 PÚBLICO */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/comoFunciona" element={<ComoFunciona />} />
          <Route path="/dian" element={<DIAN />} />
          <Route path="/soporte" element={<Soporte />} />
        </Route>

        {/* 🔹 PRIVADO (app logueada) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/facturas" element={<Facturas />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
