import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToHash from "./components/ScrollToHash";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SignalRProvider } from "./contexts/SignalRContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/Auth";
import PublicLayout from "./layouts/PublicLayout";
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
import SobreNosotros from "./pages/SobreNosotros";
import ComoFunciona from "./pages/ComoFunciona";
import DIAN from "./pages/DIAN";
import Soporte from "./pages/Soporte";
import NotaDebito from "./pages/NotaDebito";
import NotaCredito from "./pages/NotaCredito";
import Tienda from "./pages/Tienda";
import Checkout from "./pages/Checkout";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const NotFound = () => (
  <div className="text-center py-5">
    <h1 className="display-1 text-danger">404</h1>
    <p className="lead">Página no encontrada.</p>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <SignalRProvider>
          <ScrollToHash />

          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>

            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/planes" element={<Planes />} />
              <Route path="/comoFunciona" element={<ComoFunciona />} />
              <Route path="/dian" element={<DIAN />} />
              <Route path="/soporte" element={<Soporte />} />
              <Route path="/sobreNosotros" element={<SobreNosotros />} />
            </Route>

            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/notaCredito" element={<NotaCredito />} />
              <Route path="/notaDebito" element={<NotaDebito />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/facturas" element={<Facturas />} />
              <Route path="/reportes" element={<Reportes />} />
              <Route path="/tienda" element={<Tienda />} />
              <Route path="/perfil" element={<Perfil />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </SignalRProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
