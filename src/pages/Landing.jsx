// src/pages/Landing.jsx
import React from "react";

export default function Landing() {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <title>FactCloud - Facturación Electrónica en la Nube</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div className="page" style={styles.page}>
          {/* HEADER */}
          <header style={styles.header}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>F</div>
              <span>FactCloud</span>
            </div>
            <nav style={styles.nav}>
              <a href="#features">Características</a>
              <a href="#como-funciona">Cómo funciona</a>
              <a href="#contacto">Contacto</a>
              <a href="/login">Ingresar</a>
            </nav>
          </header>

          {/* HERO */}
          <main style={styles.hero}>
            <section>
              <h1 style={styles.heroTitle}>
                Facturación electrónica en la{" "}
                <span style={styles.heroHighlight}>nube</span> para pymes
                colombianas.
              </h1>
              <p style={styles.heroText}>
                FactCloud centraliza tu facturación electrónica, envía
                comprobantes por correo y mantiene el historial de ventas siempre
                disponible, listo para DIAN.
              </p>

              <div style={styles.heroBadges}>
                <span style={styles.badge}>Envío automático por email</span>
                <span style={styles.badge}>
                  Historial de facturas en tiempo real
                </span>
                <span style={styles.badge}>
                  Pensado para micro y pequeñas empresas
                </span>
              </div>

              <div style={styles.heroActions}>
                <button style={styles.btnPrimary}>Probar FactCloud</button>
                <button style={styles.btnOutline}>Ver demo de facturación</button>
              </div>
              <p style={styles.heroNote}>
                Sin instalar nada. Solo necesitas un navegador y conexión a
                internet.
              </p>
            </section>

            {/* Tarjeta tipo preview de la app */}
            <aside
              style={styles.heroCard}
              aria-label="Vista previa de una factura en FactCloud"
            >
              <div style={styles.cardHeader}>
                <div>
                  <strong style={{ fontSize: "0.85rem" }}>Factura #FC-01234</strong>
                  <div style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                    Cliente: Panadería La 24
                  </div>
                </div>
                <span style={styles.pill}>Enviada por email</span>
              </div>

              <table style={styles.miniTable}>
                <thead>
                  <tr>
                    <th style={styles.th}>Concepto</th>
                    <th style={styles.th}>Cantidad</th>
                    <th style={styles.th}>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={styles.td}>Productos de panadería</td>
                    <td style={styles.td}>35</td>
                    <td style={{ ...styles.td, ...styles.amount }}>$420.000</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>IVA (19%)</td>
                    <td style={styles.td}>-</td>
                    <td style={styles.td}>$79.800</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>
                      <strong>Total factura</strong>
                    </td>
                    <td style={styles.td}>-</td>
                    <td style={{ ...styles.td, ...styles.amount }}>$499.800</td>
                  </tr>
                </tbody>
              </table>

              <p
                style={{
                  marginTop: 10,
                  fontSize: "0.76rem",
                  color: "#9ca3af",
                }}
              >
                FactCloud genera el PDF y el XML, los almacena en la nube y los
                envía al cliente en segundos.
              </p>
            </aside>
          </main>

          {/* FEATURES */}
          <section id="features" style={styles.section}>
            <h2 style={styles.sectionTitle}>Todo lo que necesitas para facturar</h2>
            <div style={styles.featuresGrid}>
              <article style={styles.feature}>
                <h3>Registro rápido de facturas</h3>
                <p>
                  Crea facturas en segundos con tus productos, clientes y formas
                  de pago ya configurados. Pensado para puntos de venta pequeños.
                </p>
              </article>
              <article style={styles.feature}>
                <h3>Envío automático por correo</h3>
                <p>
                  Cada factura se envía al correo del cliente con su PDF y XML
                  adjuntos, usando un servicio de correo transaccional confiable.
                </p>
              </article>
              <article style={styles.feature}>
                <h3>Historial y control</h3>
                <p>
                  Consulta qué facturas se enviaron, cuándo y a qué cliente, todo
                  desde un solo panel en la nube.
                </p>
              </article>
              <article style={styles.feature}>
                <h3>Diseñado para Colombia</h3>
                <p>
                  Estructura pensada para integrarse con los requisitos de
                  facturación electrónica y CUFE exigidos en el país.
                </p>
              </article>
            </div>
          </section>

          {/* CÓMO FUNCIONA */}
          <section id="como-funciona" style={styles.section}>
            <h2 style={styles.sectionTitle}>Cómo funciona FactCloud</h2>
            <p
              style={{
                fontSize: "0.9rem",
                maxWidth: 640,
                opacity: 0.9,
              }}
            >
              1) Registras tus clientes y productos. 2) Generas la factura desde
              el panel web. 3) FactCloud guarda el soporte en la nube y lo envía
              por correo al cliente. 4) Puedes descargar los documentos o
              consultarlos cuando los necesites.
            </p>
          </section>

          {/* FOOTER */}
          <footer id="contacto" style={styles.footer}>
            <span>
              © {new Date().getFullYear()} FactCloud S.A.S – Todos los derechos
              reservados.
            </span>
            <span>Contacto: factcloud.soporte@example.com</span>
          </footer>
        </div>
      </body>
    </html>
  );
}

const styles = {
  page: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "24px 16px 40px",
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    background:
      "radial-gradient(circle at top, #101735, #050713)",
    color: "#f5f5f5",
    lineHeight: 1.5,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "32px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: 700,
    fontSize: "1.2rem",
  },
  logoIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #00a2ff, #00ffb0)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    color: "#020817",
  },
  nav: {
    display: "flex",
    gap: "18px",
    fontSize: "0.9rem",
    opacity: 0.9,
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
    gap: "32px",
    alignItems: "center",
    marginBottom: "40px",
  },
  heroTitle: {
    fontSize: "clamp(2.1rem, 3vw + 1rem, 3rem)",
    fontWeight: 700,
    marginBottom: "10px",
  },
  heroHighlight: {
    background: "linear-gradient(135deg, #00a2ff, #00ffb0)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  },
  heroText: {
    fontSize: "0.98rem",
    maxWidth: "32rem",
    opacity: 0.9,
    marginBottom: "18px",
  },
  heroBadges: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
    fontSize: "0.8rem",
  },
  badge: {
    padding: "4px 10px",
    borderRadius: "999px",
    background: "rgba(0, 162, 255, 0.12)",
    border: "1px solid rgba(0, 162, 255, 0.4)",
  },
  heroActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "10px",
  },
  btnPrimary: {
    background: "#0057ff",
    borderRadius: "999px",
    padding: "10px 20px",
    border: "none",
    color: "white",
    fontSize: "0.94rem",
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 8px 20px rgba(0, 87, 255, 0.4)",
  },
  btnOutline: {
    borderRadius: "999px",
    padding: "9px 18px",
    border: "1px solid rgba(148, 163, 184, 0.7)",
    background: "transparent",
    color: "#e5e7eb",
    fontSize: "0.9rem",
    cursor: "pointer",
  },
  heroNote: {
    fontSize: "0.8rem",
    opacity: 0.8,
  },
  heroCard: {
    background: "linear-gradient(145deg, #0b1220, #020617)",
    borderRadius: "16px",
    padding: "18px",
    border: "1px solid rgba(148, 163, 184, 0.25)",
    boxShadow: "0 20px 40px rgba(15, 23, 42, 0.7)",
    fontSize: "0.78rem",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    alignItems: "center",
  },
  pill: {
    padding: "4px 8px",
    borderRadius: "999px",
    background: "rgba(22, 163, 74, 0.18)",
    color: "#bbf7d0",
    fontSize: "0.7rem",
  },
  miniTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "8px",
  },
  th: {
    padding: "6px 4px",
    textAlign: "left",
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "#9ca3af",
    borderBottom: "1px solid rgba(55, 65, 81, 0.7)",
  },
  td: {
    padding: "6px 4px",
    textAlign: "left",
    borderBottom: "1px solid rgba(31, 41, 55, 0.8)",
    fontSize: "0.76rem",
  },
  amount: {
    color: "#4ade80",
    fontWeight: 600,
  },
  section: {
    marginTop: "34px",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    marginBottom: "12px",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },
  feature: {
    background: "rgba(15, 23, 42, 0.9)",
    borderRadius: "12px",
    padding: "14px 14px 16px",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    fontSize: "0.86rem",
  },
  footer: {
    borderTop: "1px solid rgba(30, 64, 175, 0.6)",
    marginTop: "32px",
    paddingTop: "14px",
    fontSize: "0.75rem",
    color: "#9ca3af",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "10px",
  },
};
