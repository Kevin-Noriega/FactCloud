import { useState, useEffect } from "react";
import "../styles/DIAN.css";
import { Link } from "react-router-dom";
import normativa from "../utils/DIAN/Normativa";
import especificaciones from "../utils/DIAN/Especificaciones";
import documentos from "../utils/DIAN/Documentos ";
import obligados from "../utils/DIAN/Obligados";
import requisitos from "../utils/DIAN/Requisitos";
import faqsDian from "../utils/FAQS";
import cumplimiento from "../utils/DIAN/cumplimiento";

const DIAN = () => {
  const [activeTab, setActiveTab] = useState("obligados");
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = faqsDian.filter((faq) => faq.seccion === "dian");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="dian-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">Información oficial DIAN</span>
            <h1>Facturación electrónica en Colombia</h1>
            <p className="hero-description">
              Guía completa sobre los requisitos, la normativa vigente y el
              proceso de habilitación para cumplir con las obligaciones de
              facturación electrónica ante la DIAN.
            </p>
          </div>
        </div>
      </section>

      <section className="tabs-section">
        <div className="container">
          <div className="tabs-container">
            <button
              className={`tab-button ${
                activeTab === "obligados" ? "active" : ""
              }`}
              onClick={() => setActiveTab("obligados")}
            >
              <span className="tab-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  class="bi bi-people"
                  viewBox="0 0 16 16"
                >
                  <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                </svg>
              </span>
              <span className="tab-text">¿Quiénes están obligados?</span>
            </button>
            <button
              className={`tab-button ${
                activeTab === "requisitos" ? "active" : ""
              }`}
              onClick={() => setActiveTab("requisitos")}
            >
              <span className="tab-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  class="bi bi-list-check"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3.854 2.146a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 3.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 7.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0"
                  />
                </svg>
              </span>
              <span className="tab-text">Requisitos y pasos</span>
            </button>
            <button
              className={`tab-button ${
                activeTab === "documentos" ? "active" : ""
              }`}
              onClick={() => setActiveTab("documentos")}
            >
              <span className="tab-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  class="bi bi-file-earmark-text"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
                  <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                </svg>
              </span>
              <span className="tab-text">Tipos de documentos</span>
            </button>
            <button
              className={`tab-button ${
                activeTab === "normativa" ? "active" : ""
              }`}
              onClick={() => setActiveTab("normativa")}
            >
              <span className="tab-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  class="bi bi-shield-check"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56" />
                  <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                </svg>
              </span>
              <span className="tab-text">Marco normativo</span>
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "obligados" && (
              <div className="content-panel fade-in">
                <h2>Calendario de obligatoriedad</h2>
                <p className="panel-intro">
                  La DIAN ha establecido un cronograma progresivo basado en el
                  tipo de contribuyente y nivel de ingresos anuales. Identifica
                  en qué categoría te encuentras.
                </p>
                <div className="obligados-grid">
                  {obligados.map((item, idx) => (
                    <div
                      key={idx}
                      className={`obligado-card estado-${item.estado}`}
                    >
                      <div className="obligado-header">
                        <h3>{item.categoria}</h3>
                        <span className={`estado-badge ${item.estado}`}>
                          {item.estado === "activo" && "Obligatorio"}
                          {item.estado === "progresivo" && "En implementación"}
                          {item.estado === "voluntario" && "Voluntario"}
                        </span>
                      </div>
                      <p className="obligado-desc">{item.descripcion}</p>
                      <div className="obligado-plazo">
                        <strong>Plazo:</strong> {item.plazo}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="info-alert">
                  <div className="alert-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      fill="currentColor"
                      class="bi bi-lightbulb-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m3 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1-.5-.5" />
                    </svg>
                  </div>
                  <div className="alert-content">
                    <strong>Consejo:</strong> Aunque no estés obligado todavía,
                    implementar facturación electrónica de forma voluntaria te
                    permite adelantarte, automatizar procesos y evitar
                    contratiempos de última hora.
                  </div>
                </div>
              </div>
            )}

            {activeTab === "requisitos" && (
              <div className="content-panel fade-in">
                <h2>Requisitos para facturar electrónicamente</h2>
                <p className="panel-intro">
                  Cumplir con estos 5 requisitos es fundamental para habilitar
                  la facturación electrónica. Cada paso está diseñado para
                  garantizar seguridad y trazabilidad fiscal.
                </p>
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
                        <ol>
                          {req.pasos.map((paso, i) => (
                            <li key={i}>{paso}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="subsection-title">Especificaciones técnicas</h3>
                <div className="especificaciones-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Componente</th>
                        <th>Especificación</th>
                        <th>Detalle técnico</th>
                      </tr>
                    </thead>
                    <tbody>
                      {especificaciones.map((spec, idx) => (
                        <tr key={idx}>
                          <td className="spec-componente">{spec.componente}</td>
                          <td className="spec-especificacion">
                            {spec.especificacion}
                          </td>
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
                <p className="panel-intro">
                  El sistema de facturación electrónica soporta múltiples tipos
                  de documentos tributarios. Conoce cuándo usar cada uno.
                </p>
                <div className="documentos-grid">
                  {documentos.map((doc, idx) => (
                    <div key={idx} className="documento-card">
                      <div className="documento-header">
                        <span className="documento-codigo">{doc.codigo}</span>
                        <h3>{doc.tipo}</h3>
                      </div>
                      <p className="documento-desc">{doc.descripcion}</p>
                      <div className="documento-uso">
                        <strong>Uso:</strong> {doc.uso}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "normativa" && (
              <div className="content-panel fade-in">
                <h2>Marco legal vigente</h2>
                <p className="panel-intro">
                  La facturación electrónica en Colombia está regulada por
                  múltiples resoluciones y decretos. Conoce las normas más
                  importantes.
                </p>
                <div className="normativa-lista">
                  {normativa.map((norma, idx) => (
                    <div key={idx} className="normativa-card">
                      <div className="normativa-header">
                        <h3>{norma.resolucion}</h3>
                        <span className="normativa-fecha">{norma.fecha}</span>
                      </div>
                      <h4 className="normativa-tema">{norma.tema}</h4>
                      <ul className="normativa-contenido">
                        {norma.contenido.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                      <div
                        className={`normativa-impacto impacto-${norma.impacto
                          .split(" ")[0]
                          .toLowerCase()}`}
                      >
                        <strong>Impacto:</strong> {norma.impacto}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="enlaces-oficiales">
                  <h3>Recursos oficiales DIAN</h3>
                  <div className="enlaces-grid">
                    <a
                      href="https://www.dian.gov.co"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="enlace-card"
                    >
                      <div className="enlace-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="40"
                          fill="currentColor"
                          class="bi bi-globe"
                          viewBox="0 0 16 16"
                        >
                          <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z" />
                        </svg>
                      </div>
                      <div className="enlace-content">
                        <h4>Portal DIAN</h4>
                        <p>Sitio oficial con toda la normativa</p>
                      </div>
                      <div className="enlace-arrow">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M7 4l6 6-6 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </a>
                    <a
                      href="https://catalogo-vpfe.dian.gov.co"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="enlace-card"
                    >
                      <div className="enlace-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="40"
                          fill="currentColor"
                          class="bi bi-files"
                          viewBox="0 0 16 16"
                        >
                          <path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1M3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
                        </svg>
                      </div>
                      <div className="enlace-content">
                        <h4>Catálogo VPFE</h4>
                        <p>Documentación técnica y anexos</p>
                      </div>
                      <div className="enlace-arrow">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M7 4l6 6-6 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </a>
                    <a
                      href="https://www.dian.gov.co/atencionciudadano"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="enlace-card"
                    >
                      <div className="enlace-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="40"
                          fill="currentColor"
                          class="bi bi-chat-dots"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                          <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2" />
                        </svg>
                      </div>
                      <div className="enlace-content">
                        <h4>Atención al ciudadano</h4>
                        <p>Soporte y consultas oficiales</p>
                      </div>
                      <div className="enlace-arrow">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M7 4l6 6-6 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="cumplimiento-section">
        <div className="container">
          <h2>FactCloud cumple todos los requisitos DIAN</h2>
          <p className="cumplimiento-intro">
            Nuestra plataforma está 100% alineada con la normativa vigente y se
            actualiza automáticamente con cada cambio regulatorio.
          </p>
          <div className="cumplimiento-grid">
            {cumplimiento.map((cumplimiento, idx) => (
              <div key={idx} className="cumplimiento-item">
                <div className="cumplimiento-check">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    class="bi bi-check-lg"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                  </svg>
                </div>
                <h4>{cumplimiento.titulo}</h4>
                <p>{cumplimiento.descripcion}</p>
              </div>
            ))}
          </div>
          <div className="cumplimiento-cta">
            <Link to="/planes" className="btn-primary-large">
              Comenzar a facturar con FactCloud
            </Link>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <h2>Preguntas frecuentes</h2>
          <p className="section-intro">
            Encuentra respuestas rápidas a las consultas más comunes sobre como
            funciona.
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

export default DIAN;
