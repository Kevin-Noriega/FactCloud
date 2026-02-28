import React from "react";
import canalesAtencion from "../CanalesAtencion";

export const Contact = () => {
  const canales = canalesAtencion.slice(1, 4);

  return (
    <div id="contacto" className="contact-section">
      <div className="contact-container">
        <div className="contact-info">
          <span className="section-label">Contacto</span>
          <h2>¿Necesitas ayuda?</h2>
          <p>
            Nuestro equipo está listo para responder tus preguntas y acompañarte
            en el proceso.
          </p>

          <div className="contact-methods">
            {canales.map((canales, idx) => (
              <div key={idx} className="contact-method">
                <div className="method-icon">{canales.icono}</div>
                <div>
                  <p>{canales.descripcion}</p>
                  <a href={canales.href} className="contact-link">
                    {canales.accion}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="contact-form">
          <h3>Envíanos un mensaje</h3>
          <form>
            <div className="form-group">
              <label>Nombre completo</label>
              <input type="text" placeholder="Juan Pérez" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="juan@empresa.com" />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="tel" placeholder="+57 300 123 4567" />
              </div>
            </div>

            <div className="form-group">
              <label>Empresa</label>
              <input type="text" placeholder="Mi Empresa SAS" />
            </div>

            <div className="form-group">
              <label>¿En qué podemos ayudarte?</label>
              <textarea
                rows="4"
                placeholder="Cuéntanos sobre tu negocio y necesidades..."
              ></textarea>
            </div>

            <button type="submit" className="btn-submit">
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
