import { useEffect, useState } from "react";
import "./Landing.css";
import FactCloudLogo from "../img/logo2.png"
import dashboard from "../img/dashboard.png"
import listadoFacturas from "../img/facturas.png";
import novedades from "../img/novedades.png";
import topVentas from "../img/reporteventa.png";
import topClientes from "../img/topclientes.png";
import productosVendidos from "../img/productosVendidos.png";

export default function Landing() {
  
const [imagenZoom, setImagenZoom] = useState(null);

  useEffect(() => {
    // guardar estilos anteriores
    const prevBg = document.body.style.background;
    const prevColor = document.body.style.color;

    // aplicar solo para la landing
    document.body.style.background =
      "radial-gradient(circle at top, #101735, #050713)";
    document.body.style.color = "#f9fafb";

    // limpiar al salir de la landing
    return () => {
      document.body.style.background = prevBg;
      document.body.style.color = prevColor;
    };
  }, []);
  const styles = {
  examplesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // 3 columnas fijas
    gap: "18px",
    marginTop: "18px",
  },
  exampleImage: {
    borderRadius: "10px",
    overflow: "hidden",
    height: "180px", // mismo alto para todas
  },
  exampleImgTag: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "10px",
    cursor: "pointer",
  },
};

  return (
    <div className="landing">
      {/* HEADER */}
      <header className="landing__header">
         <img 
                  id="sidebar-logo"
                  src={FactCloudLogo} 
                  alt="logoFactCloud"
                   style={{ width: "15%" }} 
                />

        <nav className="landing__nav">
          <a href="#features">Características</a>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#ejemplos">Visualizaciones</a>
          <a href="#contacto" className="btn-link btn-link--outline">
            Contactar
          </a>
          <a href="/login" className="btn-link">
            Ingresar
          </a>
        </nav>
      </header>

      {/* HERO */}
      <main className="landing__hero">
        <section className="landing__hero-text">
          <h1>
            Facturación electrónica en la{" "}
            <span className="highlight">nube</span> para PYMES colombianas.
          </h1>
          <p className="hero-subtitle">
            FactCloud centraliza tu facturación electrónica, envía comprobantes
            por correo y mantiene el historial de ventas siempre disponible,
            listo para DIAN.
          </p>

          <div className="hero-badges">
            <span className="badge">Envío automático por email</span>
            <span className="badge">Historial de facturas en tiempo real</span>
            <span className="badge">Pensado para micro y pequeñas empresas</span>
          </div>

          <div className="hero-actions">
            <button
              className="btn btn-primary"
              onClick={() => (window.location.href = "/login")}
            >
              Probar FactCloud
            </button>
            
          </div>

          <p className="hero-note">
            Sin instalar nada. Solo necesitas un navegador y conexión a internet.
          </p>
        </section>

        {/* Tarjeta tipo preview */}
        <aside
          className="landing__hero-card"
          aria-label="Vista previa de una factura en FactCloud"
        >
          <div className="card-header">
            <div>
              <strong>Factura #FC-01234</strong>
              <div className="card-header__subtitle">
                Cliente: Panadería La 24
              </div>
            </div>
            <span className="pill pill--green">Enviada por email</span>
          </div>

          <table className="mini-table">
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Cantidad</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Productos de panadería</td>
                <td>35</td>
                <td className="amount">$420.000</td>
              </tr>
              <tr>
                <td>IVA (19%)</td>
                <td>-</td>
                <td>$79.800</td>
              </tr>
              <tr>
                <td>
                  <strong>Total factura</strong>
                </td>
                <td>-</td>
                <td className="amount">$499.800</td>
              </tr>
            </tbody>
          </table>

          <p className="card-note">
            FactCloud genera el PDF y el XML, los almacena en la nube y los envía
            al cliente en segundos.
          </p>
        </aside>
      </main>

      {/* CARACTERÍSTICAS */}
      <section id="features" className="section section--light">
        <h2>Todo lo que necesitas para facturar</h2>
        <p className="section-subtitle">
          Funcionalidades pensadas para negocios pequeños que necesitan
          facturación ordenada sin volverse expertos en sistemas.
        </p>

        <div className="features-grid">
          <article className="feature-card">
            <h3>Registro rápido de facturas</h3>
            <p>
              Crea facturas en segundos con tus productos, clientes y formas de
              pago ya configurados. Ideal para puntos de venta con alta rotación.
            </p>
          </article>

          <article className="feature-card">
            <h3>Envío automático por correo</h3>
            <p>
              Cada factura se envía al correo del cliente con su PDF y XML
              adjuntos, usando un servicio de correo transaccional confiable.
            </p>
          </article>

          <article className="feature-card">
            <h3>Historial y control</h3>
            <p>
              Consulta qué facturas se enviaron, a quién y cuándo, todo desde un
              solo panel en la nube, filtrando por fechas y clientes.
            </p>
          </article>

          <article className="feature-card">
            <h3>Diseñado para Colombia</h3>
            <p>
              Estructura preparada para integrarse con requisitos de
              facturación electrónica, CUFE y numeraciones de la DIAN.
            </p>
          </article>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="section">
        <h2>Cómo funciona FactCloud</h2>
        <div className="steps">
          <div className="step">
            <span className="step-number">1</span>
            <h3>Configura tu negocio</h3>
            <p>
              Registra tus datos, resoluciones, productos y clientes una sola
              vez. FactCloud guarda la configuración para futuras facturas.
            </p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <h3>Genera la factura</h3>
            <p>
              Desde el panel web seleccionas cliente, productos y forma de pago.
              El sistema calcula automáticamente subtotales, IVA y total.
            </p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <h3>Envía y almacena</h3>
            <p>
              FactCloud envía la factura por correo al cliente, guarda el PDF y
              XML en la nube y marca el estado de envío en el historial.
            </p>
          </div>
        </div>
      </section>
<section id="visualizaciones" className="section section--light">
  <h2>Visualizaciones de la plataforma</h2>
  <p className="section-subtitle">
    Módulos clave de FactCloud.
  </p>

  <div style={styles.examplesGrid}>
    {/* 1. Dashboard general */}
    <div className="example-card">
      <div style={styles.exampleImage}>
        <img
          src={dashboard}
          alt="Dashboard general de FactCloud"
          style={styles.exampleImgTag}
          onClick={() => setImagenZoom(dashboard)}
        />
      </div>
      <p>
        Panel principal con métricas de facturas, clientes, productos y
        ventas totales en tiempo real.
      </p>
    </div>

    {/* 2. Listado de facturas */}
    <div className="example-card">
      <div style={styles.exampleImage}>
        <img
          src={listadoFacturas}
          alt="Listado de facturas"
          style={styles.exampleImgTag}
          onClick={() => setImagenZoom(listadoFacturas)}
        />
      </div>
      <p>
        Tabla de facturas con estados, totales y acceso rápido al envío por
        correo a cada cliente.
      </p>
    </div>

    {/* 3. Novedades */}
    <div className="example-card">
      <div style={styles.exampleImage}>
        <img
          src={novedades}
          alt="Centro de ayuda y novedades"
          style={styles.exampleImgTag}
          onClick={() => setImagenZoom(novedades)}
        />
      </div>
      <p>
        Centro de ayuda con tutoriales rápidos, normatividad DIAN y
        novedades de FactCloud para mantenerte actualizado.
      </p>
    </div>

    {/* 4. Top ventas */}
    <div className="example-card">
      <div style={styles.exampleImage}>
        <img
          src={topVentas}
          alt="Top de ventas"
          style={styles.exampleImgTag}
          onClick={() => setImagenZoom(topVentas)}
        />
      </div>
      <p>
        Vista de top ventas por día, mes o producto para identificar tus
        mejores periodos de ingreso.
      </p>
    </div>

    {/* 5. Top clientes */}
    <div className="example-card">
      <div style={styles.exampleImage}>
        <img
          src={topClientes}
          alt="Top clientes"
          style={styles.exampleImgTag}
          onClick={() => setImagenZoom(topClientes)}
        />
      </div>
      <p>
        Ranking de clientes con mayor facturación y número de compras para
        enfocar tus esfuerzos comerciales.
      </p>
    </div>

    {/* 6. Productos más vendidos */}
    <div className="example-card">
      <div style={styles.exampleImage}>
        <img
          src={productosVendidos}
          alt="Productos más vendidos"
          style={styles.exampleImgTag}
          onClick={() => setImagenZoom(productosVendidos)}
        />
      </div>
      <p>
        Listado de productos más vendidos y su participación en las ventas
        totales del negocio.
      </p>
    </div>
  </div>
</section>


{imagenZoom && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}
    onClick={() => setImagenZoom(null)}
  >
    <img
      src={imagenZoom}
      alt="Vista ampliada"
      style={{
        maxWidth: "90vw",
        maxHeight: "90vh",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
      }}
    />
  </div>
)}

      {/* CONTACTO / CTA FINAL */}
      <section id="contacto" className="section section--cta">
        <div className="cta-content">
          <div>
            <h2>¿Te gustaría usar FactCloud en tu negocio?</h2>
            <p>
              Escríbenos para agendar una demo o para integrar FactCloud como
              parte de tu proyecto de grado o solución empresarial.
            </p>
          </div>
          <div className="cta-actions">
            <a href="mailto:yeimararaujomedina@gmail.com" className="btn btn-secondary">
              Hablar por correo
            </a>
            <a href="https://wa.me/573216878825" className="btn btn-secondary">
              Hablar por WhatsApp
            </a>
          </div>
        </div>
      </section>
      {/* FOOTER */}
     <footer className="footer">
  <div className="footer__top">
    <div className="footer__brand">
       <img 
                  id="sidebar-logo"
                  src={FactCloudLogo} 
                  alt="logoFactCloud"
                   style={{ width: "60%" }} 
                />
      <p>
        Facturación electrónica en la nube para pequeños negocios colombianos.
        Fácil de usar, siempre disponible.
      </p>
    </div>

    <div className="footer__cols">
      <div className="footer__col">
        <h4>Producto</h4>
        <a href="#features">Características</a>
        <a href="#como-funciona">Cómo funciona</a>
        <a href="#ejemplos">Visualizaciones de pantalla</a>
      </div>

      <div className="footer__col">
        <h4>Recursos</h4>
        <a href="/login">Ingresar al sistema</a>
        <a href="#contacto">Soporte</a>
      </div>

      <div className="footer__col">
        <h4>Contacto</h4>
        <a href="mailto:yeimararaujomedina@gmail.com">
          factcloud.soporte@factcloud.com
        </a>
        <a href="https://wa.me/573216878825" target="_blank" rel="noreferrer">
          WhatsApp soporte
        </a>
      </div>
    </div>
  </div>

  <div className="footer__bottom">
    <span>
      © {new Date().getFullYear()} FactCloud S.A.S – Todos los derechos
      reservados.
    </span>
    <div className="footer__bottom-links">
      <a href="#">Términos</a>
      <a href="#">Privacidad</a>
    </div>
  </div>
</footer>

    </div>
  );
}
