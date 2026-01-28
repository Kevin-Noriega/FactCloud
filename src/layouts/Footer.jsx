import { Link } from "react-router-dom";
import "../styles/Footer.css";
export default function Footer() {
    return (
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img
              src="/img/logoFCwhite.png"
              alt="FactCloud"
              className="footer-logo"
            />
            <p>
              Facturación electrónica simple y poderosa para PYMES colombianas.
            </p>
            <div className="footer-country">Operando en Colombia</div>
            <div className="footer-social">
              <a href="#" aria-label="LinkedIn">
                LinkedIn
              </a>
              <a href="#" aria-label="Twitter">
                Twitter
              </a>
              <a href="#" aria-label="Instagram">
                Instagram
              </a>
            </div>
          </div>

          <div className="footer-links-group">
            <div className="footer-column">
              <h4>Producto</h4>
              <a href="/comoFunciona#caracteristicas" >Características</a>
              <a href="/planes#planes">Precios</a>
              <a href="/comoFunciona#tecnologias">Integraciones</a>
            </div>

            <div className="footer-column">
              <h4>Recursos</h4>
              <Link to="/soporte">Centro de ayuda</Link>
            </div>

            <div className="footer-column">
              <h4>Empresa</h4>
              <a href="#">Nosotros</a>
              <a href="/soporte">Contacto</a>
              <a href="#">Términos</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <small className="footer-copy">
            © {new Date().getFullYear()} FACTCLOUD
          </small>
        </div>
      </footer>
      );
    }