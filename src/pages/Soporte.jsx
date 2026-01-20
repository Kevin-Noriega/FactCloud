import React, { useState, useEffect } from "react";
import "../styles/Soporte.css";
import canalesAtencion from "../components/CanalesAtencion";
import slaData from "../utils/Soporte/SlaData"

const Soporte = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    empresa: "",
    telefono: "",
    categoria: "tecnico",
    prioridad: "normal",
    asunto: "",
    mensaje: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí integrarías con tu backend ASP.NET
    console.log("Ticket creado:", formData);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        nombre: "",
        email: "",
        empresa: "",
        telefono: "",
        categoria: "tecnico",
        prioridad: "normal",
        asunto: "",
        mensaje: "",
      });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const canales = canalesAtencion.slice(1, 4);
  const canalesFooter = canalesAtencion.slice(2, 4);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="soporte-page">
      <section className="hero-section">
        <div className="container">
          <span className="hero-badge">¿Necesitas Ayuda?</span>
          <h1>Centro de soporte</h1>
          <p className="hero-description">
            Estamos aquí para ayudarte. Encuentra respuestas rápidas, crea
            tickets de soporte o contacta directamente a nuestro equipo
            especializado.
          </p>
        </div>
      </section>

      <section className="ticket-section">
        <div className="container">
          <div className="ticket-layout">
            <div className="ticket-main">
              <h2>Crear ticket de soporte</h2>
              <p className="ticket-intro">
                Completa el formulario y nuestro equipo te responderá según la
                prioridad seleccionada. Recibirás una copia en tu correo.
              </p>

              {submitted && (
                <div className="success-alert">
                  <div className="success-icon">✓</div>
                  <div className="success-content">
                    <strong>Ticket creado exitosamente</strong>
                    <p>Te hemos enviado una confirmación a {formData.email}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="ticket-form">
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="nombre">Nombre completo *</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="juan@empresa.com"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="empresa">Empresa</label>
                    <input
                      type="text"
                      id="empresa"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleChange}
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="categoria">Categoría *</label>
                    <select
                      id="categoria"
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      required
                    >
                      <option value="tecnico">Soporte técnico</option>
                      <option value="facturacion">Facturación y pagos</option>
                      <option value="cuenta">Gestión de cuenta</option>
                      <option value="integracion">Integración API</option>
                      <option value="dian">Problemas con DIAN</option>
                      <option value="bug">Reporte de bug</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="prioridad">Prioridad *</label>
                    <select
                      id="prioridad"
                      name="prioridad"
                      value={formData.prioridad}
                      onChange={handleChange}
                      required
                    >
                      <option value="baja">Baja (48h)</option>
                      <option value="normal">Normal (24h)</option>
                      <option value="alta">Alta (4h)</option>
                      <option value="critica">Crítica (1h)</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="asunto">Asunto *</label>
                  <input
                    type="text"
                    id="asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    required
                    placeholder="Describe brevemente el problema o consulta"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="mensaje">Descripción detallada *</label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Proporciona todos los detalles: pasos para reproducir, mensajes de error, capturas de pantalla, etc."
                  ></textarea>
                  <span className="field-hint">
                    Cuanta más información proporciones, más rápido podremos
                    ayudarte
                  </span>
                </div>

                <button type="submit" className="btn-submit">
                  Enviar ticket
                </button>
              </form>
            </div>
            <section className="canales-section">
              <div className="container">
                <h2>Canales de atención</h2>
                <div className="canales-grid">
                  {canales.map((canal, idx) => (
                    <div key={idx} className="canal-card">
                      <div className="canal-icono">{canal.icono}</div>
                      <h3>{canal.titulo}</h3>
                      <div className="canal-disponibilidad">
                        {canal.disponibilidad}
                      </div>
                      <div className="canal-footer">
                        <button
                          className="canal-accion"
                          onClick={() => window.open(canal.href, "blank")}
                        >
                          {canal.accion}
                          
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="sla-section">
        <div className="container">
          <h2>Tiempos de respuesta (SLA)</h2>
          <p className="section-intro">
            Nuestros compromisos de atención según la prioridad del ticket.
            Tiempos medidos en horas hábiles (Lun-Vie 8am-6pm GMT-5).
          </p>
          <div className="sla-grid">
            {slaData.map((sla, idx) => (
              <div key={idx} className="sla-card">
                <div className="sla-header" style={{ background: sla.color }}>
                  <h3>{sla.prioridad}</h3>
                  <div className="sla-tiempo">{sla.tiempo}</div>
                </div>
                <div className="sla-content">
                  <p className="sla-descripcion">{sla.descripcion}</p>
                  <h5>Ejemplos:</h5>
                  <ul className="sla-ejemplos">
                    {sla.ejemplos.map((ejemplo, i) => (
                      <li key={i}>{ejemplo}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="sla-nota">
            <strong>Nota importante:</strong> Estos tiempos son de primera
            respuesta. La resolución completa depende de la complejidad del
            caso. Tickets críticos tienen seguimiento continuo hasta resolución.
          </div>
        </div>
      </section>

      <section className="contacto-directo">
        <div className="container">
          <div className="contacto-content">
            <div className="contacto-info">
              <h2>¿Necesitas atención inmediata?</h2>
              <p>
                Para problemas críticos que impidan tu operación, contáctanos
                directamente por teléfono o WhatsApp. Nuestro equipo está listo
                para atenderte.
              </p>
              <div className="contacto-acciones">
                {canalesFooter.map((canal, idx) => (
                  <a key={idx} href={canal.href} className="btn-contacto">
                    <span className="btn-icono">{canal.icono}</span>
                    <span className="btn-texto">{canal.accion}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="contacto-horario">
              <h4>Horarios de atención</h4>
              <div className="horario-item">
                <span className="horario-dia">Lunes a Viernes</span>
                <span className="horario-hora">8:00 AM - 6:00 PM</span>
              </div>
              <div className="horario-item">
                <span className="horario-dia">Sábados</span>
                <span className="horario-hora">9:00 AM - 1:00 PM</span>
              </div>
              <div className="horario-item">
                <span className="horario-dia">Domingos y festivos</span>
                <span className="horario-hora">Solo emergencias críticas</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Soporte;
