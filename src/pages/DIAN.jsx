import { useState, useEffect } from "react";
import {
  FiUsers, FiList, FiFileText, FiShield,
  FiGlobe, FiChevronDown, FiChevronUp, FiExternalLink, FiCheckCircle
} from "react-icons/fi";
import { Link } from "react-router-dom";
import normativa from "../utils/DIAN/Normativa";
import especificaciones from "../utils/DIAN/Especificaciones";
import documentos from "../utils/DIAN/Documentos ";
import obligados from "../utils/DIAN/Obligados";
import requisitos from "../utils/DIAN/Requisitos";
import faqsDian from "../utils/FAQS";
import cumplimiento from "../utils/DIAN/cumplimiento";
import "../styles/DIAN.css";

const DIAN = () => {
  const [activeTab, setActiveTab] = useState("obligados");
  const [openFAQ, setOpenFAQ] = useState(null);
  const faqs = faqsDian.filter(f => f.seccion === "dian");
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="dian-page">

      {/* Hero — usa clases globales de index.css */}
      <section className="hero-section">
        <img
          src="/img/img_hero_DIAN.webp"
          alt="Nubee - Facturación electrónica Colombia"
          className="hero-image"
        />
        <div className="container">
          <span className="hero-badge">Información oficial DIAN</span>
          <h1>Facturación electrónica en Colombia</h1>
          <p className="hero-description">
            Guía completa sobre los requisitos, la normativa vigente y el proceso de habilitación
            para cumplir con las obligaciones de facturación electrónica ante la DIAN.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="tabs-section">
        <div className="container">
          <div className="tabs-container">
            {[
              { id: "obligados", icon: <FiUsers />, label: "¿Quiénes están obligados?" },
              { id: "requisitos", icon: <FiList />, label: "Requisitos y pasos" },
              { id: "documentos", icon: <FiFileText />, label: "Tipos de documentos" },
              { id: "normativa", icon: <FiShield />, label: "Marco normativo" },
            ].map(tab => (
              <button key={tab.id} className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)} type="button">
                <div className="tab-icon-wrapper">{tab.icon}</div>
                <span className="tab-text">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === "obligados" && (
              <div className="content-panel fade-in">
                <h2>Calendario de obligatoriedad</h2>
                <p className="panel-intro">La DIAN ha establecido un cronograma progresivo basado en el tipo de contribuyente y nivel de ingresos anuales.</p>
                <div className="obligados-grid">
                  {obligados.map((item, idx) => (
                    <div key={idx} className={`obligado-card estado-${item.estado}`}>
                      <div className="obligado-header">
                        <h3>{item.categoria}</h3>
                        <span className={`estado-badge ${item.estado}`}>
                          {item.estado === "activo" && "Obligatorio"}
                          {item.estado === "progresivo" && "En implementación"}
                          {item.estado === "voluntario" && "Voluntario"}
                        </span>
                      </div>
                      <p className="obligado-desc">{item.descripcion}</p>
                      <div className="obligado-plazo"><strong>Plazo:</strong> {item.plazo}</div>
                    </div>
                  ))}
                </div>
                <div className="info-alert">
                  <div className="alert-icon-wrapper"><FiCheckCircle /></div>
                  <div className="alert-content">
                    <strong>Consejo Nubee:</strong> Aunque no estés obligado todavía,
                    implementar facturación electrónica de forma voluntaria te permite adelantarte y automatizar procesos.
                  </div>
                </div>
              </div>
            )}

            {activeTab === "requisitos" && (
              <div className="content-panel fade-in">
                <h2>Requisitos para facturar electrónicamente</h2>
                <p className="panel-intro">Cumplir con estos requisitos es fundamental para habilitar la facturación electrónica.</p>
                <div className="requisitos-lista">
                  {requisitos.map((req, idx) => (
                    <div key={idx} className="requisito-block">
                      <div className="requisito-header">
                        <span className="requisito-icono">{req.icono}</span>
                        <div className="requisito-info">
                          <h3>{req.titulo}</h3>
                          <p>{req.descripcion}</p>
                        </div>
                      </div>
                      <div className="requisito-pasos">
                        <h4>Cómo obtenerlo:</h4>
                        <ol>{req.pasos.map((p, i) => <li key={i}>{p}</li>)}</ol>
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="subsection-title">Especificaciones técnicas</h3>
                <div className="especificaciones-table">
                  <table>
                    <thead><tr><th>Componente</th><th>Especificación</th><th>Detalle técnico</th></tr></thead>
                    <tbody>
                      {especificaciones.map((spec, idx) => (
                        <tr key={idx}>
                          <td className="spec-componente">{spec.componente}</td>
                          <td className="spec-especificacion">{spec.especificacion}</td>
                          <td>{spec.detalle}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "documentos" && (
              <div className="content-panel fade-in">
                <h2>Tipos de documentos electrónicos</h2>
                <p className="panel-intro">El sistema soporta múltiples tipos de documentos tributarios.</p>
                <div className="documentos-grid">
                  {documentos.map((doc, idx) => (
                    <div key={idx} className="documento-card">
                      <div className="documento-header">
                        <span className="documento-codigo">{doc.codigo}</span>
                        <h3>{doc.tipo}</h3>
                      </div>
                      <p className="documento-desc">{doc.descripcion}</p>
                      <div className="documento-uso"><strong>Uso:</strong> {doc.uso}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "normativa" && (
              <div className="content-panel fade-in">
                <h2>Marco legal vigente</h2>
                <p className="panel-intro">La facturación electrónica en Colombia está regulada por múltiples resoluciones y decretos.</p>
                <div className="normativa-lista">
                  {normativa.map((norma, idx) => (
                    <div key={idx} className="normativa-card">
                      <div className="normativa-header">
                        <h3>{norma.resolucion}</h3>
                        <span className="normativa-fecha">{norma.fecha}</span>
                      </div>
                      <h4 className="normativa-tema">{norma.tema}</h4>
                      <ul className="normativa-contenido">
                        {norma.contenido.map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                      <div className={`normativa-impacto impacto-${norma.impacto.split(" ")[0].toLowerCase()}`}>
                        <strong>Impacto:</strong> {norma.impacto}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="enlaces-oficiales">
                  <h3>Recursos oficiales DIAN</h3>
                  <div className="enlaces-grid">
                    {[
                      { href: "https://www.dian.gov.co", icon: <FiGlobe />, title: "Portal DIAN", desc: "Sitio oficial con toda la normativa" },
                      { href: "https://catalogo-vpfe.dian.gov.co", icon: <FiFileText />, title: "Catálogo VPFE", desc: "Documentación técnica y anexos" },
                      { href: "https://www.dian.gov.co/atencionciudadano", icon: <FiUsers />, title: "Atención al ciudadano", desc: "Soporte y consultas oficiales" },
                    ].map((enlace, idx) => (
                      <a key={idx} href={enlace.href} target="_blank" rel="noopener noreferrer" className="enlace-card">
                        <div className="enlace-icon-wrapper">{enlace.icon}</div>
                        <div className="enlace-content"><h4>{enlace.title}</h4><p>{enlace.desc}</p></div>
                        <FiExternalLink className="enlace-arrow" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cumplimiento */}
      <section className="cumplimiento-section">
        <div className="container">
          <h2>Nubee cumple todos los requisitos DIAN</h2>
          <p className="cumplimiento-intro">Nuestra plataforma está 100% alineada con la normativa vigente.</p>
          <div className="cumplimiento-grid">
            {cumplimiento.map((item, idx) => (
              <div key={idx} className="cumplimiento-item">
                <div className="cumplimiento-check"><FiCheckCircle /></div>
                <h4>{item.titulo}</h4>
                <p>{item.descripcion}</p>
              </div>
            ))}
          </div>
          <div className="cumplimiento-cta">
            <Link to="/planes" className="btn-primary-large">Comenzar a facturar con Nubee</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container">
          <h2>Preguntas frecuentes</h2>
          <p className="section-intro">Encuentra respuestas rápidas sobre facturación electrónica.</p>
          <div className="faq-lista">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`faq-item ${openFAQ === idx ? "open" : ""}`}>
                <button className="faq-question" onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}>
                  <span className="faq-text">{faq.pregunta}</span>
                  <span className="faq-toggle">{openFAQ === idx ? <FiChevronUp /> : <FiChevronDown />}</span>
                </button>
                {openFAQ === idx && <div className="faq-answer"><p>{faq.respuesta}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default DIAN;