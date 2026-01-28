import { 
  Bullseye, 
  Rocket, 
  LightningChargeFill, 
  Gem, 
  StarFill, 
  ShieldFillCheck, 
  HandThumbsUpFill, 
  Stars,
  CheckCircleFill,
  ClockHistory,
  Calendar3
} from "react-bootstrap-icons";
import{ useEffect } from "react";
import ventajas from "../utils/ComoFunciona/Ventajas"
import { corporateInfo } from "../utils/CorporateInfo";
import "../styles/SobreNosotros.css";

function SobreNosotros() {
  const valueIcons = {
    "Innovación": <LightningChargeFill size={48} />,
    "Transparencia": <Gem size={48} />,
    "Excelencia": <StarFill size={48} />,
    "Confiabilidad": <ShieldFillCheck size={48} />,
    "Compromiso": <HandThumbsUpFill size={48} />,
    "Accesibilidad": <Stars size={48} />
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="sobre-nosotros-page">
      <section className="hero-section">
      <img 
    src="/img/img_hero_sobreNosotros.webp"
    alt="Empresario usando FactCloud" 
    className="hero-image"
  />
        <div className="container">
                      <span className="hero-badge">Quiénes Somos</span>

          <h1>Sobre FactCloud</h1>
          <p className="hero-description">
              Simplificando la facturación electrónica <br />
      para empresas y profesionales en Colombia.
          </p>
        </div>
      </section>

      <section className="mission-vision-section">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card">
              <div className="mv-card-header">
                <Bullseye size={40} className="mv-icon" />
                <h2>{corporateInfo.mission.title}</h2>
              </div>
              <p>{corporateInfo.mission.content}</p>
              <ul>
                {corporateInfo.mission.keyPoints.map((point, index) => (
                  <li key={index}>
                    <CheckCircleFill size={18} className="list-icon" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mv-card">
              <div className="mv-card-header">
                <Rocket size={40} className="mv-icon" />
                <h2>{corporateInfo.vision.title}</h2>
              </div>
              <p>{corporateInfo.vision.content}</p>
              <ul>
                {corporateInfo.vision.goals.map((goal, index) => (
                  <li key={index}>
                    <CheckCircleFill size={18} className="list-icon" />
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <h2>Nuestros Valores</h2>
          <div className="values-grid">
            {corporateInfo.values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">
                  {valueIcons[value.name] || <Stars size={48} />}
                </div>
                <h3>{value.name}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="history-section">
        <div className="container">
          <div className="history-header">
            <ClockHistory size={48} className="history-icon" />
            <h2>{corporateInfo.history.title}</h2>
          </div>
          <div className="history-content">
            <p>{corporateInfo.history.foundation}</p>
            <p>{corporateInfo.history.motivation}</p>
            <p>{corporateInfo.history.journey}</p>
            <p>{corporateInfo.history.achievement}</p>

            <h3>
              <Calendar3 size={32} className="me-2" />
              Hitos Importantes
            </h3>
            <div className="timeline">
              {corporateInfo.history.milestones.map((milestone, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker">
                    <CheckCircleFill size={16} />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-date">{milestone.date}</div>
                    <div className="timeline-event">{milestone.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

       <section className="ventajas-section">
        <div className="container">
          <h2>Por qué elegir FactCloud</h2>
          <div className="ventajas-grid">
            {ventajas.map((ventaja, idx) => (
              <div key={idx} className="ventaja-card">
                <div className="ventaja-metrica">{ventaja.metrica}</div>
                <h3>{ventaja.titulo}</h3>
                <p>{ventaja.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default SobreNosotros;
