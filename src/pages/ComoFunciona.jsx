import{ useState, useEffect} from "react";
import "../styles/ComoFunciona.css";
import { Link } from "react-router-dom";
import pasos from "../utils/ComoFunciona/Pasos";
import caracteristicas from "../utils/ComoFunciona/Caracteristicas";
import planes from "../utils/ComoFunciona/Planes";
import tecnologias from "../utils/ComoFunciona/Tecnologias"
import proceso from "../utils/ComoFunciona/Proceso";
import faqsFuncionamiento from "../utils/FAQS"

const faqs = faqsFuncionamiento.filter(faq => faq.seccion === 'como-funciona')

const ComoFunciona = () => {
  const [selectedPlan, setSelectedPlan] = useState("basico");
    const [openFAQ, setOpenFAQ] = useState(null);

useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  return (
    <div className="como-funciona-page">
     <section className="hero-section">
  <img 
    src="/img/img_hero_comoFunciona.webp"
    alt="Empresario usando FactCloud" 
    className="hero-image"
  />
  
  <div className="container">
    <span className="hero-badge">Aprende cómo funciona</span>
    <h1>¿Cómo funciona FactCloud?</h1>
    <p className="hero-description">
      Desde el registro hasta tu primera factura electrónica validada por
      DIAN en solo 10 minutos. Sin complicaciones técnicas ni
      configuraciones complejas.
    </p>
  </div>
</section>



      <section className="pasos-section">
        <div className="container">
          <h2>4 pasos para facturar electrónicamente</h2>
          <div className="pasos-timeline">
            {pasos.map((paso, idx) => (
              <div key={idx} className="paso-item">
                <div className="paso-numero">{paso.numero}</div>
                <div className="paso-content">
                  <h3>{paso.titulo}</h3>
                  <p className="paso-descripcion">{paso.descripcion}</p>
                  <ul className="paso-detalles">
                    {paso.detalles.map((detalle, i) => (
                      <li key={i}>{detalle}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section id="caracteristicas" className="caracteristicas-section">
        <div className="container">
          <h2>Funcionalidades por plan</h2>
          <div className="planes-selector">
            {planes.map((plan) => (
              <button
                key={plan.id}
                className={`plan-tab ${
                  selectedPlan === plan.id ? "active" : ""
                }`}
                onClick={() => setSelectedPlan(plan.id)}
                style={{
                  borderColor: "transparent",
                }}
              >
                {plan.nombre}
              </button>
            ))}
          </div>

          <div className="caracteristicas-lista">
            {caracteristicas.map((cat, idx) => (
              <div key={idx} className="categoria-block">
                <h3 className="categoria-titulo">{cat.categoria}</h3>
                <div className="items-grid">
                  {cat.items.map((item, i) => {
                    const disponible = item.planes.includes(selectedPlan);
                    return (
                      <div
                        key={i}
                        className={`item-card ${
                          disponible ? "disponible" : "no-disponible"
                        }`}
                      >
                        <div className="item-header">
                          <span
                            className={`item-check ${
                              disponible ? "activo" : ""
                            }`}
                          >
                            {disponible ? "✓" : "−"}
                          </span>
                          <h4>{item.nombre}</h4>
                        </div>
                        <p>{item.descripcion}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="planes-cta">
            <Link to="/planes" className="btn-ver-planes">
              Ver planes y precios completos
            </Link>
          </div>
        </div>
      </section>

      <section id= "tecnologias"className="tecnologia-section">
        <div className="tecnologia-container">
          <h2>Tecnología detrás de FactCloud</h2>
          <p className="section-intro">
            Plataforma construida con las mejores prácticas de desarrollo y
            tecnologías enterprise probadas en producción.
          </p>

          <div className="tecnologia-grid">
            {tecnologias.map((tec, idx) =>(
            <div  key = {idx} className="tech-card">
              <div className="tech-icon">{tec.icono}</div>
              <h3>{tec.titulo}</h3>
              <p>{tec.descripcion}</p>
            </div>
            ))}
          </div>
        </div>
      </section>

      <section className="proceso-facturacion">
        <div className="container">
          <h2>El proceso técnico detrás de cada factura</h2>
          <div className="proceso-flow">
            {proceso.map((proc, idx) => (
            <div key={idx} className="flow-step">
              <div className="flow-number">{proc.numer}</div>
              <h4>{proc.titulo}</h4>
              <p>{proc.descripcion}</p>
            </div>
            
            ))}
           </div>
           
        </div>
      </section>
      
       <section className="faq-section">
        <div className="container">
          <h2>Preguntas frecuentes</h2>
          <p className="section-intro">
            Encuentra respuestas rápidas a las consultas más comunes sobre como funciona.
          </p>
          <div className="faq-lista">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`faq-item ${openFAQ === idx ? "open" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                >
                  
                  <span className="faq-text">{faq.pregunta}</span>
                  <span className="faq-toggle">
                    {openFAQ === idx ? "−" : "+"}
                  </span>
                </button>
                {openFAQ === idx && (
                  <div className="faq-answer">
                    <p>{faq.respuesta}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComoFunciona;
