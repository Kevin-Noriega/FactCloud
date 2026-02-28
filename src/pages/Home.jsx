import {useEffect } from "react";
import caracteristicas from "../utils/Home/Caracteristicas";
import "../Styles/Home.css";
import {
  CheckCircle,
  PersonLock,
  Cloud
} from "react-bootstrap-icons";
import { Faq } from "../components/homePage/Faq";
import {Contact} from "../components/homePage/Contact";
import {HeroBanner} from "../components/homePage/HeroBanner";
  import {Planes} from "../components/homePage/Planes";

export default function Home() {


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="landing-wrapper">
      <HeroBanner />
      <Planes />

      

      <section className="social-proof">
        <p className="social-text">Confiado por empresas en toda Colombia</p>
        <div className="trust-badges">
          <div className="badge">
            <CheckCircle size={18} /> Autorizado DIAN
          </div>
          <div className="badge">
            <PersonLock size={18} /> Datos encriptados
          </div>
          <div className="badge">
           <Cloud size={18} /> 100% en la nube

          </div>
        </div>
      </section>

      <section id="producto" className="features-section">
        <div className="container">
          <h2>Todo lo que necesitas en un solo lugar</h2>
          <p className="section-header-producto">
            Potencia tu negocio con herramientas profesionales
          </p>

          <div className="features-grid">
            {caracteristicas.map((caracteristicas, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon">{caracteristicas.icono}</div>
                <h3>{caracteristicas.titulo}</h3>
                <p>{caracteristicas.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <Contact />
      
      <Faq />

      
    </div>
  );
}
``