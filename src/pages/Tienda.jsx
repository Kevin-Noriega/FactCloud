import React, { useState} from "react";
import { 
  TrophyFill,
  Lightning,
  ShieldCheck,
  CloudCheck,
  ArrowUpCircle,
  CheckCircleFill,
  StarFill,
  GraphUpArrow,
  People,
  BoxSeam,
  Headset,
  GearFill
} from "react-bootstrap-icons";
import "../styles/Tienda.css";

const planActual = {
  nombre: "Emprendedor",
  facturas: 50,
  usuarios: 1,
  productos: 100,
  precio: 29000,
  caracteristicas: ["Facturación DIAN", "Reportes básicos", "Soporte email"],
};

const planesUpgrade = [
  {
    id: 2,
    nombre: "Profesional",
    tagline: "Lleva tu negocio al siguiente nivel",
    precio: 59000,
    precioAnual: 590000,
    diferenciaPrecio: 30000,
    color: "#8b5cf6",
    gradiente: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    facturas: 500,
    usuarios: 5,
    productos: "Ilimitados",
    recomendado: true,
    novedades: [
      "10x más facturas (50 → 500)",
      "4 usuarios adicionales",
      "Productos ilimitados",
      "API REST completa",
      "Soporte prioritario 24/7",
      "Multi-sucursal",
    ],
  },
  {
    id: 3,
    nombre: "Empresarial",
    tagline: "Solución corporativa sin límites",
    precio: 99000,
    precioAnual: 990000,
    diferenciaPrecio: 70000,
    color: "#ec4899",
    gradiente: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    facturas: "Ilimitadas",
    usuarios: "Ilimitados",
    productos: "Ilimitados",
    recomendado: false,
    novedades: [
      "Facturas sin límites",
      "Usuarios ilimitados",
      "Business Intelligence",
      "API empresarial + webhooks",
      "Soporte dedicado premium",
      "White label",
    ],
  },
];

const addons = [
  {
    id: 1,
    nombre: "Usuarios Extra",
    descripcion: "Agrega más usuarios a tu plan actual",
    precio: 5000,
    unidad: "por usuario/mes",
    icono: <People size={36} />,
    color: "#06b6d4",
    cantidad: 1,
  },
  {
    id: 2,
    nombre: "Facturas Adicionales",
    descripcion: "Paquete de 50 facturas extra",
    precio: 10000,
    unidad: "por paquete",
    icono: <BoxSeam size={36} />,
    color: "#10b981",
    cantidad: 1,
  },
  {
    id: 3,
    nombre: "Soporte Prioritario",
    descripcion: "Atención prioritaria 24/7",
    precio: 15000,
    unidad: "por mes",
    icono: <Headset size={36} />,
    color: "#f59e0b",
    cantidad: 1,
  },
  {
    id: 4,
    nombre: "Personalización Avanzada",
    descripcion: "Customiza la apariencia de tus facturas",
    precio: 20000,
    unidad: "por mes",
    icono: <GearFill size={36} />,
    color: "#8b5cf6",
    cantidad: 1,
  },
];

function Tienda() {
  const [periodoAnual, setPeriodoAnual] = useState(false);
  const [addonsSeleccionados, setAddonsSeleccionados] = useState([]);

  const toggleAddon = (addonId) => {
    if (addonsSeleccionados.includes(addonId)) {
      setAddonsSeleccionados(addonsSeleccionados.filter(id => id !== addonId));
    } else {
      setAddonsSeleccionados([...addonsSeleccionados, addonId]);
    }
  };

  const calcularTotalAddons = () => {
    return addons
      .filter(addon => addonsSeleccionados.includes(addon.id))
      .reduce((total, addon) => total + addon.precio, 0);
  };

  return (
    <div className="tienda-upgrade-container">
      {/* Plan Actual Banner */}
      <section className="plan-actual-banner">
        <div className="container">
          <div className="banner-content">
            <div className="plan-actual-info">
              <div className="plan-badge">
                <CheckCircleFill size={18} className="me-2" />
                Plan Actual
              </div>
              <h2 className="plan-actual-nombre">{planActual.nombre}</h2>
              <div className="plan-actual-stats">
                <div className="stat">
                  <span className="stat-number">{planActual.facturas}</span>
                  <span className="stat-label">Facturas/mes</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{planActual.usuarios}</span>
                  <span className="stat-label">Usuario</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{planActual.productos}</span>
                  <span className="stat-label">Productos</span>
                </div>
              </div>
            </div>
            <div className="plan-actual-precio">
              <div className="precio-actual">
                <span className="simbolo">$</span>
                <span className="cantidad">{planActual.precio.toLocaleString("es-CO")}</span>
                <span className="periodo">/mes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="upgrade-header">
        <div className="container">
          <div className="tienda-header-content">
            <StarFill className="tienda-header-icon" size={48} />
            <h1 className="upgrade-title">
              Potencia tu <span className="gradient-text">FactCloud</span>
            </h1>
            <p className="upgrade-subtitle">
              Actualiza tu plan o agrega funcionalidades específicas según las necesidades de tu negocio
            </p>
          </div>
        </div>
      </section>

      <section className="upgrade-plans-section">
        <div className="container">
          <div className="section-header">
            <ArrowUpCircle size={32} className="me-3" />
            <h2 className="section-title">Actualiza tu Plan</h2>
          </div>
          <p className="section-description">
            Obtén más recursos y funcionalidades premium con nuestros planes superiores
          </p>

          {/* Toggle Anual */}
          <div className="toggle-periodo-upgrade">
            <button 
              className={`toggle-btn ${!periodoAnual ? "active" : ""}`}
              onClick={() => setPeriodoAnual(false)}
            >
              Mensual
            </button>
            <button 
              className={`toggle-btn ${periodoAnual ? "active" : ""}`}
              onClick={() => setPeriodoAnual(true)}
            >
              Anual
              <span className="toggle-badge">-20%</span>
            </button>
          </div>

          <div className="upgrade-plans-grid">
            {planesUpgrade.map((plan) => (
              <div 
                key={plan.id}
                className={`upgrade-plan-card ${plan.recomendado ? "recomendado" : ""}`}
              >
                {plan.recomendado && (
                  <div className="plan-ribbon">
                    <TrophyFill size={16} className="me-1" />
                    Recomendado
                  </div>
                )}

                <div className="upgrade-card-header">
                  <h3 className="upgrade-plan-nombre">{plan.nombre}</h3>
                  <p className="upgrade-plan-tagline">{plan.tagline}</p>
                </div>

                <div className="upgrade-pricing">
                  <div className="precio-nuevo">
                    <span className="simbolo">$</span>
                    <span className="cantidad">
                      {(periodoAnual 
                        ? Math.floor(plan.precioAnual / 12) 
                        : plan.precio
                      ).toLocaleString("es-CO")}
                    </span>
                    <span className="periodo">/mes</span>
                  </div>
                  <div className="diferencia-precio">
                    Solo +${plan.diferenciaPrecio.toLocaleString("es-CO")}/mes adicionales
                  </div>
                  {periodoAnual && (
                    <div className="ahorro-anual">
                      <CheckCircleFill size={14} className="me-1" />
                      Ahorra {((plan.precio * 12 - plan.precioAnual) / 1000).toFixed(0)}k al año
                    </div>
                  )}
                </div>

                <div className="comparacion-rapida">
                  <div className="comp-item">
                    <span className="comp-label">Facturas:</span>
                    <span className="comp-valor">{plan.facturas}/mes</span>
                  </div>
                  <div className="comp-item">
                    <span className="comp-label">Usuarios:</span>
                    <span className="comp-valor">{plan.usuarios}</span>
                  </div>
                  <div className="comp-item">
                    <span className="comp-label">Productos:</span>
                    <span className="comp-valor">{plan.productos}</span>
                  </div>
                </div>

                <div className="novedades-section">
                  <h4 className="novedades-titulo">
                    <Lightning size={20} className="me-2" />
                    Nuevas funcionalidades
                  </h4>
                  <ul className="novedades-list">
                    {plan.novedades.map((novedad, idx) => (
                      <li key={idx}>
                        <CheckCircleFill size={16} className="check-icon" />
                        <span>{novedad}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  className="btn-upgrade"
                  style={{ 
                    background: plan.recomendado ? plan.gradiente : "transparent",
                    borderColor: plan.color,
                    color: plan.recomendado ? "white" : plan.color
                  }}
                >
                  {plan.recomendado ? "Actualizar Ahora" : "Cambiar a " + plan.nombre}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="addons-section">
        <div className="container">
          <div className="section-header">
            <BoxSeam size={32} className="me-3" />
            <h2 className="section-title">Complementos y Extras</h2>
          </div>
          <p className="section-description">
            Personaliza tu plan actual con funcionalidades adicionales sin cambiar de plan
          </p>

          <div className="addons-grid">
            {addons.map((addon) => (
              <div 
                key={addon.id}
                className={`addon-card ${addonsSeleccionados.includes(addon.id) ? "selected" : ""}`}
                onClick={() => toggleAddon(addon.id)}
              >
                <div className="addon-check">
                  {addonsSeleccionados.includes(addon.id) && (
                    <CheckCircleFill size={24} />
                  )}
                </div>

                <div className="addon-icon" style={{ color: addon.color }}>
                  {addon.icono}
                </div>

                <h3 className="addon-nombre">{addon.nombre}</h3>
                <p className="addon-descripcion">{addon.descripcion}</p>

                <div className="addon-precio">
                  <span className="addon-cantidad">
                    ${addon.precio.toLocaleString("es-CO")}
                  </span>
                  <span className="addon-unidad">{addon.unidad}</span>
                </div>
              </div>
            ))}
          </div>

          {addonsSeleccionados.length > 0 && (
            <div className="addons-resumen">
              <div className="resumen-content">
                <div className="resumen-info">
                  <span className="resumen-label">
                    {addonsSeleccionados.length} complemento(s) seleccionado(s)
                  </span>
                  <span className="resumen-total">
                    Total adicional: ${calcularTotalAddons().toLocaleString("es-CO")}/mes
                  </span>
                </div>
                <button className="btn-agregar-addons">
                  Agregar a mi Plan
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Beneficios */}
      <section className="beneficios-upgrade-section">
        <div className="container">
          <h2 className="section-title-center">
            ¿Por qué actualizar tu <span className="gradient-text">FactCloud</span>?
          </h2>

          <div className="beneficios-upgrade-grid">
            <div className="beneficio-upgrade-card">
              <div className="beneficio-icon">
                <GraphUpArrow size={40} />
              </div>
              <h3>Escala sin límites</h3>
              <p>Crece tu negocio sin preocuparte por quedarte sin recursos</p>
            </div>

            <div className="beneficio-upgrade-card">
              <div className="beneficio-icon">
                <Lightning size={40} />
              </div>
              <h3>Más velocidad</h3>
              <p>Procesamiento prioritario y rendimiento optimizado</p>
            </div>

            <div className="beneficio-upgrade-card">
              <div className="beneficio-icon">
                <ShieldCheck size={40} />
              </div>
              <h3>Soporte premium</h3>
              <p>Atención dedicada cuando más lo necesitas</p>
            </div>

            <div className="beneficio-upgrade-card">
              <div className="beneficio-icon">
                <CloudCheck size={40} />
              </div>
              <h3>Actualizaciones instantáneas</h3>
              <p>Tu cambio de plan es inmediato, sin interrupciones</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-upgrade-section">
        <div className="cta-upgrade-content">
          <h2 className="cta-title">¿Necesitas ayuda para decidir?</h2>
          <p className="cta-text">
            Nuestro equipo está disponible para asesorarte y ayudarte a encontrar 
            la mejor opción para tu negocio
          </p>
          <div className="cta-buttons">
            <button className="btn-cta-contacto">
              <Headset size={20} className="me-2" />
              Hablar con un Asesor
            </button>
            <button className="btn-cta-comparar">
              Comparar Planes
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Tienda;