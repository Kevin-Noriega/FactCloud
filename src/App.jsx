import { Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { SignalRProvider } from "./contexts/SignalRContext";
import ScrollToHash from "./components/ScrollToHash";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/Auth";
import PublicLayout from "./layouts/PublicLayout";
import RegisterLayout from "./layouts/registerLayout";

import Home from "./pages/Home";
import Planes from "./pages/PlanesPage";
import SobreNosotros from "./pages/SobreNosotros";
import ComoFunciona from "./pages/ComoFunciona";
import DIAN from "./pages/DIAN";
import Soporte from "./pages/Soporte";
import Login from "./pages/Login";
import PSEResultado from "./pages/PSEResultado";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Productos from "./components/ProductosServicios/Productos";
import Facturas from "./components/ventas/documentosVenta/Facturas";
import NuevaFactura from "./pages/NuevaFactura";
import NuevoDocumentoSoporte from "./pages/NuevoDocumentoSoporte";
import NuevaNotaCredito from "./pages/NuevaNotaCredito";
import NuevaNotaDebito from "./pages/NuevaNotaDebito";
import Ventas from "./pages/Ventas";
import ComprasGastos from "./pages/ComprasGastos";
import DocumentoSoporte from "./components/comprasGastos/DocumentoSoporte";
import Reportes from "./pages/Reportes";
import Perfil from "./pages/Perfil";
import NuevoProducto_Servicio from "./pages/NuevoProducto_Servicio";
import ImportarProductosExcel from "./components/ProductosServicios/ImportarProductoExcel";
import Tienda from "./pages/Tienda";
import Checkout from "./pages/Checkout";
import { ProtectedLayout } from "./components/ProtectedLayout";
import HabilitacionDian from "./components/dashboard/Habilitacion/HabilitacionDian";
import NuevoClienteEmpresa from "./components/Clientes/NuevoClienteEmpresa";
import HabilitacionDSE from "./components/dashboard/Habilitacion/HabilitacionDSE";
import HabilitacionFacturacionFE from "./components/dashboard/Habilitacion/HabilitacionFacturacionFE";
import Impuestos from "./pages/Impuestos";
import PerfilCliente from "./pages/PerfilCliente";
import CuentasContables from "./pages/CuentasContables";
const NotFound = () => (
  <div className="text-center py-5">
    <h1 className="display-1 text-danger">404</h1>
    <p className="lead">Página no encontrada.</p>
    <a href="/" className="btn btn-primary mt-3">
      Volver al Inicio
    </a>
  </div>
);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 2 },
  },
});

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Verificando sesión...</span>
        </div>
        <p style={{ marginTop: "1rem", color: "#6c757d" }}>
          Restaurando sesión...
        </p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SignalRProvider>
        <ScrollToHash />
        <Routes>
          {/* Rutas Públicas */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/planes" element={<Planes />} />
            <Route path="/sobreNosotros" element={<SobreNosotros />} />
            <Route path="/comoFunciona" element={<ComoFunciona />} />
            <Route path="/dian" element={<DIAN />} />
            <Route path="/soporte" element={<Soporte />} />
          </Route>

          {/* Rutas de Autenticación (redirige si ya logueado?) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Rutas de Registro/Checkout */}
          <Route element={<RegisterLayout />}>
            <Route path="/registro" element={<Registro />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pse/resultado" element={<PSEResultado />} />
          </Route>

          {/* Rutas Protegidas */}
          <Route element={<ProtectedLayout />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route
                path="/nuevo-clientee"
                element={<NuevoClienteEmpresa />}
              />{" "}
              {/* Corregido path */}
              <Route path="/productos" element={<Productos />} />
              <Route
                path="/crearProducto"
                element={<NuevoProducto_Servicio />}
              />
              <Route
                path="/crearProducto/editar/:id"
                element={<NuevoProducto_Servicio />}
              />
              <Route
                path="/productos/importar-excel"
                element={<ImportarProductosExcel />}
              />
              <Route path="/ventas" element={<Ventas />} />
              <Route path="/nueva-factura" element={<NuevaFactura />} />
              <Route
                path="/nuevo-documento-soporte"
                element={<NuevoDocumentoSoporte />}
              />
              <Route
                path="/nueva-nota-credito"
                element={<NuevaNotaCredito />}
              />
              <Route path="/nueva-nota-debito" element={<NuevaNotaDebito />} />
              <Route path="/habilitacion-dian" element={<HabilitacionDian />} />
              <Route
                path="/habilitacion-dian/factura-electronica"
                element={<HabilitacionFacturacionFE />}
              />
              <Route
                path="/habilitacion-dian/habilitacionDSE"
                element={<HabilitacionDSE />}
              />
              <Route path="/compras-gastos" element={<ComprasGastos />} />
              <Route path="/facturas" element={<Facturas />} />
              <Route path="/documentoSoporte" element={<DocumentoSoporte />} />
              <Route path="/reportes" element={<Reportes />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/tienda" element={<Tienda />} />
              <Route path="/tienda/:categoria" element={<Tienda />} />
              <Route path="/impuestos" element={<Impuestos />} />
              <Route path="/perfil-cliente/:id" element={<PerfilCliente />} />
              <Route path="/cuentas-contables" element={<CuentasContables />} />
            </Route>
          </Route>

          {/* 404 Global */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SignalRProvider>
    </QueryClientProvider>
  );
}

export default App;
