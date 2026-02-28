import React from 'react'
import { ArrowRight, BookmarkCheck, Clock, FileEarmarkPdf, FileEarmarkText } from 'react-bootstrap-icons'

export const NormativasDian = () => {
  return (
    
        <div className="normativa-section">
          <div className="section-card">
            <div className="section-header">
              <h5 className="section-title">Normatividad DIAN</h5>
            </div>
            <div className="normativa-list">
              <a
                href="https://www.dian.gov.co/normatividad/Normatividad/Resoluci%C3%B3n%20000165%20de%2001-11-2023.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="normativa-item"
              >
                <div className="normativa-icon">
                  <FileEarmarkPdf size={20} />
                </div>
                <div className="normativa-content">
                  <p className="normativa-title">Resolución 000165 de 2023</p>
                  <small className="normativa-subtitle">
                    Facturación electrónica obligatoria
                  </small>
                </div>
                <ArrowRight size={18} className="normativa-arrow" />
              </a>

              <a
                href="https://www.dian.gov.co/Prensa/Paginas/NG-Comunicado-de-Prensa-026-2025.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="normativa-item"
              >
                <div className="normativa-icon">
                  <Clock size={20} />
                </div>
                <div className="normativa-content">
                  <p className="normativa-title">Plazo de 48 horas</p>
                  <small className="normativa-subtitle">
                    Para envío a la DIAN
                  </small>
                </div>
                <ArrowRight size={18} className="normativa-arrow" />
              </a>

              <a
                href="https://www.dian.gov.co/impuestos/factura-electronica/Documents/Abece-FE-Facturador.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="normativa-item"
              >
                <div className="normativa-icon">
                  <BookmarkCheck size={20} />
                </div>
                <div className="normativa-content">
                  <p className="normativa-title">Artículo 617 E.T.</p>
                  <small className="normativa-subtitle">
                    Requisitos de factura
                  </small>
                </div>
                <ArrowRight size={18} className="normativa-arrow" />
              </a>

              <a
                href="https://normograma.dian.gov.co/dian/compilacion/docs/concepto_tributario_dian_0051929_2000.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="normativa-item"
              >
                <div className="normativa-icon">
                  <FileEarmarkText size={20} />
                </div>
                <div className="normativa-content">
                  <p className="normativa-title">Conservación 5 años</p>
                  <small className="normativa-subtitle">
                    Archivo de documentos
                  </small>
                </div>
                <ArrowRight size={18} className="normativa-arrow" />
              </a>
            </div>

            <a
              href="https://www.dian.gov.co"
              target="_blank"
              rel="noopener noreferrer"
              className="normativa-button"
            >
              Ver más en DIAN.gov.co
              <ArrowRight size={16} className="ms-2" />
            </a>
          </div>
        </div>
  )
}
