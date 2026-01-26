// pages/SobreNosotros.jsx
import { corporateInfo } from "../utils/CorporateInfo";
import "../styles/SobreNosotros.css";

function SobreNosotros() {
  return (
    <div className="sobre-nosotros-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1>Sobre FactCloud</h1>
          <p className="hero-subtitle">
            Transformando la facturación electrónica en Colombia desde 2024
          </p>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card">
              <h2>🎯 {corporateInfo.mission.title}</h2>
              <p>{corporateInfo.mission.content}</p>
              <ul>
                {corporateInfo.mission.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="mv-card">
              <h2>🚀 {corporateInfo.vision.title}</h2>
              <p>{corporateInfo.vision.content}</p>
              <ul>
                {corporateInfo.vision.goals.map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="values-section">
        <div className="container">
          <h2>Nuestros Valores</h2>
          <div className="values-grid">
            {corporateInfo.values.map((value, index) => (
              <div key={index} className="value-card">
                <span className="value-icon">{value.icon}</span>
                <h3>{value.name}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="history-section">
        <div className="container">
          <h2>{corporateInfo.history.title}</h2>
          <div className="history-content">
            <p>{corporateInfo.history.foundation}</p>
            <p>{corporateInfo.history.motivation}</p>
            <p>{corporateInfo.history.journey}</p>
            <p>{corporateInfo.history.achievement}</p>

            <h3>Hitos Importantes</h3>
            <div className="timeline">
              {corporateInfo.history.milestones.map((milestone, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-date">{milestone.date}</div>
                  <div className="timeline-event">{milestone.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="why-section">
        <div className="container">
          <h2>¿Por qué elegir FactCloud?</h2>
          <div className="why-grid">
            {corporateInfo.whyChooseUs.map((reason, index) => (
              <div key={index} className="why-card">
                <h3>{reason.title}</h3>
                <p>{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default SobreNosotros;
