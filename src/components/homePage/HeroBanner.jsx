import React from 'react'
import { CheckCircle, GraphUpArrow, PlayCircle } from 'react-bootstrap-icons'

export const HeroBanner = () => {
  return (
    <div className="home-hero-section">
            <div className="hero-container">
              <h1 className="hero-title">
                Facturación electrónica
                <br />
                <span className="gradient-text">simple y poderosa</span>
              </h1>
    
              <p className="home-hero-description">
                La plataforma más intuitiva para PYMES colombianas. Emite facturas
                <br className="hide-mobile" />
                ilimitadas con cumplimiento DIAN automático.
              </p>
    
              <div className="hero-cta">
                <button
                  className="btn-secondary-hero"
                  onClick={() => document.getElementById("demo").scrollIntoView()}
                >
                  <PlayCircle size={20} />
    
                  Ver demo
                </button>
              </div>
              <div className="floating-card card-1">
                <div className="card-icon">
                  <CheckCircle size={30} />
    
                </div>
                <div className="card-text">
                  <strong>Factura enviada</strong>
                  <span>$297.500</span>
                </div>
              </div>
              <div className="floating-card card-2">
                <div className="card-icon">
                  <GraphUpArrow size={30} />
    
                </div>
                <div className="card-text">
                  <strong>Ventas del mes</strong>
                  <span>+28% vs anterior</span>
                </div>
              </div>
            </div>
          </div>
  )
}
