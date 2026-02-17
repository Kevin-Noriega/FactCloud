import { useEffect} from "react";
import { ToastContainer } from "react-toastify";
import "../styles/Dashboard.css";
import { HeroBanner } from "../components/dashboard/HeroBanner";
import { useDashboard } from "../hooks/useDashboard";
import { Tutoriales } from "../components/dashboard/Tutoriales";
import { NormativasDian } from "../components/dashboard/NormativasDian";
import { Estadisticas } from "../components/dashboard/estadisticas";


function Dashboard() {

  const {loading}=useDashboard();

  useEffect(() => {
  }, []);



  if (loading) {
    return (
      <div className="loading-dashboard">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <HeroBanner />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Estadisticas/>
      

      <div className="content-grid">
        <Tutoriales/>
        <NormativasDian/>
      </div>
    </div>
  );
}

export default Dashboard;
