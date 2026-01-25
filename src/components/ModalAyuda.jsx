import { useEffect, useState } from "react";
import { 
  XCircle, 
  QuestionCircle,
  Search,
  Book,
  PlayCircle,
  Headset,
  FileEarmarkText,
  ChevronRight,
  Envelope,
  Telephone,
  ChatDots
} from "react-bootstrap-icons";
import "../styles/ModalAyuda.css";
import faqsAyuda from "../utils/FAQS"

function ModalAyuda({ isOpen, onClose }) {
  const [busqueda, setBusqueda] = useState("");
  const [seccionActiva, setSeccionActiva] = useState("principal");
  const faqs = faqsAyuda.filter(faq => faq.seccion === 'cuenta')
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const recursos = [
    {
      titulo: "Guía de inicio rápido",
      descripcion: "Aprende a usar FactCloud en 10 minutos",
      icono: <Book size={24} />,
      link: "#"
    },
    {
      titulo: "Video tutoriales",
      descripcion: "Tutoriales paso a paso en video",
      icono: <PlayCircle size={24} />,
      link: "#"
    },
    {
      titulo: "Documentación completa",
      descripcion: "Toda la información técnica y funcional",
      icono: <FileEarmarkText size={24} />,
      link: "#"
    },
    {
      titulo: "Blog de FactCloud",
      descripcion: "Consejos, trucos y actualizaciones",
      icono: <ChatDots size={24} />,
      link: "#"
    }
  ];

  const preguntasFiltradas = faqs.filter(
    p => p.pregunta.toLowerCase().includes(busqueda.toLowerCase()) ||
         p.respuesta.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="modal-overlay-ayuda" onClick={onClose}>
      <div className="modal-container-ayuda" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-ayuda">
          <div className="modal-title-ayuda">
            <QuestionCircle size={24} className="me-2" />
            <h3>Centro de Ayuda</h3>
          </div>
          <button className="modal-close-ayuda" onClick={onClose}>
            <XCircle size={24} />
          </button>
        </div>

        <div className="modal-body-ayuda">
          {seccionActiva === "principal" && (
            <>
              <div className="ayuda-search">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar en la ayuda..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>

              <div className="ayuda-section">
                <h4 className="ayuda-section-title">Preguntas Frecuentes</h4>
                <div className="faq-list">
                  {preguntasFiltradas.map((faq, index) => (
                    <details key={index} className="faq-item">
                      <summary className="faq-question">
                        <ChevronRight size={16} className="faq-icon" />
                        <span>{faq.pregunta}</span>
                        <span className="faq-categoria">{faq.categoria}</span>
                      </summary>
                      <div className="faq-answer">
                        <p>{faq.respuesta}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>

              <div className="ayuda-section">
                <h4 className="ayuda-section-title">Recursos de Ayuda</h4>
                <div className="recursos-grid">
                  {recursos.map((recurso, index) => (
                    <a key={index} href={recurso.link} className="recurso-card">
                      <div className="recurso-icon">{recurso.icono}</div>
                      <div className="recurso-content">
                        <h5 className="recurso-titulo">{recurso.titulo}</h5>
                        <p className="recurso-descripcion">{recurso.descripcion}</p>
                      </div>
                      <ChevronRight size={20} className="recurso-arrow" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Contacto */}
              <div className="ayuda-section">
                <h4 className="ayuda-section-title">¿Necesitas más ayuda?</h4>
                <div className="contacto-grid">
                  <button 
                    className="contacto-card"
                    onClick={() => setSeccionActiva("soporte")}
                  >
                    <Headset size={28} />
                    <h5>Soporte Técnico</h5>
                    <p>Contacta con nuestro equipo</p>
                  </button>

                  <a href="mailto:soporte@factcloud.com" className="contacto-card">
                    <Envelope size={28} />
                    <h5>Email</h5>
                    <p>soporte@factcloud.com</p>
                  </a>

                  <a href="tel:+573001234567" className="contacto-card">
                    <Telephone size={28} />
                    <h5>Teléfono</h5>
                    <p>+57 300 123 4567</p>
                  </a>

                  <button className="contacto-card">
                    <ChatDots size={28} />
                    <h5>Chat en vivo</h5>
                    <p>Lun-Vie 8am-6pm</p>
                  </button>
                </div>
              </div>
            </>
          )}

          {seccionActiva === "soporte" && (
            <div className="soporte-form">
              <button 
                className="btn-volver"
                onClick={() => setSeccionActiva("principal")}
              >
                ← Volver
              </button>

              <h4 className="form-title">Contactar Soporte</h4>
              <p className="form-subtitle">
                Describe tu problema y nuestro equipo te responderá pronto
              </p>

              <form className="form-soporte">
                <div className="form-group">
                  <label className="form-label">Asunto</label>
                  <input
                    type="text"
                    className="form-input-ayuda"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Categoría</label>
                  <select className="form-select-ayuda">
                    <option value="">Selecciona una categoría</option>
                    <option value="facturas">Facturas</option>
                    <option value="clientes">Clientes</option>
                    <option value="productos">Productos</option>
                    <option value="dian">DIAN</option>
                    <option value="cuenta">Mi cuenta</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-textarea-ayuda"
                    rows="5"
                    placeholder="Describe detalladamente tu problema o pregunta..."
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Adjuntar archivo (opcional)</label>
                  <input
                    type="file"
                    className="form-file-ayuda"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <small className="form-hint">Formatos: JPG, PNG, PDF, DOC (Max 5MB)</small>
                </div>

                <button type="submit" className="btn-enviar-soporte">
                  <Envelope size={18} className="me-2" />
                  Enviar solicitud
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalAyuda;
