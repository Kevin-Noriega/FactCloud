import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PersonCircle, PencilSquare } from "react-bootstrap-icons";
import axiosClient from "../api/axiosClient";
import "../styles/PerfilCliente.css";

const RESPONSABILIDADES = [
  { name: "granContribuyente", codigo: "O-13", label: "Gran contribuyente" },
  { name: "autoretenedorRenta", codigo: "O-15", label: "Autorretenedor" },
  { name: "retenedorIVA", codigo: "O-23", label: "Agente de retención IVA" },
  {
    name: "regimenSimple",
    codigo: "O-47",
    label: "Régimen simple de tributación",
  },
  { name: "noAplica", codigo: "R-99-PN", label: "No aplica - Otros" },
];

function campo(label, valor) {
  return (
    <div className="pc-field">
      <span className="pc-field-label">{label}</span>
      <span className="pc-field-value">
        {valor || <span className="pc-empty">No aplica</span>}
      </span>
    </div>
  );
}

export default function PerfilCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosClient
      .get(`/clientes/${id}`)
      .then(({ data }) => setCliente(data))
      .catch(() => setError("No se pudo cargar el cliente."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="pc-loading">
        <div className="spinner-border text-primary" />
      </div>
    );
  if (error) return <div className="pc-error">{error}</div>;
  if (!cliente) return null;

  const esEmpresa =
    cliente.tipoPersona === "Juridica" || cliente.tipoPersona === "empresa";
  const nombreDisplay = esEmpresa
    ? cliente.razonSocial || cliente.nombre
    : `${cliente.nombre || ""} ${cliente.apellido || ""}`.trim();
  const responsabilidades = RESPONSABILIDADES.filter((r) => cliente[r.name]);

  const telefonos =
    Array.isArray(cliente.telefonos) && cliente.telefonos.length > 0
      ? cliente.telefonos
      : [
          {
            indicativo: cliente.indicativo || "",
            numero: cliente.telefono || "",
            extension: "",
          },
        ];

  return (
    <div className="pc-page">
      {/* ── Título ── */}
      <div className="pc-page-title">
        <h5>{nombreDisplay}</h5>
      </div>

      {/* ── Tabs ── */}
      <div className="pc-tabs">
        <button className="pc-tab pc-tab-active">Perfil</button>
      </div>

      {/* ── Sub-header ── */}
      <div className="pc-subheader">
        <span className="pc-subheader-title">
          Perfil del cliente, proveedor u otro
        </span>
        <button
          className="pc-btn-edit"
          onClick={() =>
            navigate(`/clientes/${id}/editar`, {
              state: { clienteEditando: cliente },
            })
          }
        >
          <PencilSquare size={14} className="me-1" />
          Editar cliente
        </button>
      </div>

      {/* ── Hero del cliente ── */}
      <div className="pc-hero">
        <div className="pc-hero-center">
          <div className="pc-avatar">
            <PersonCircle size={56} color="#adb5bd" />
          </div>
          <div className="pc-hero-info">
            <strong>{nombreDisplay}</strong>
            <span>{cliente.numeroIdentificacion}</span>
            <span>
              Estado:{" "}
              <em
                className={
                  cliente.estado ? "pc-estado-activo" : "pc-estado-inactivo"
                }
              >
                {cliente.estado ? "Activo" : "Inactivo"}
              </em>
            </span>
          </div>
        </div>
        <div className="pc-hero-right">
          <span>{cliente.ciudad || "—"}</span>
          <span>{cliente.regimenTributario || "No aplica"}</span>
          {telefonos.map((t, i) => (
            <span key={i}>
              {[t.indicativo, t.numero].filter(Boolean).join(" ")}{" "}
              {t.extension ? `· Ext. ${t.extension}` : ""} ·{" "}
              {cliente.correo || "—"}
            </span>
          ))}
        </div>
        <div className="pc-hero-meta">
          <div>
            <span className="pc-meta-label">Creado</span>
            <span className="pc-meta-value">
              {cliente.creadoPor || "—"}{" "}
              {cliente.fechaCreacion
                ? new Date(cliente.fechaCreacion).toLocaleDateString("es-CO") +
                  " " +
                  new Date(cliente.fechaCreacion).toLocaleTimeString("es-CO", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }) +
                  " hrs"
                : ""}
            </span>
          </div>
          <div>
            <span className="pc-meta-label pc-link">Modificado</span>
          </div>
        </div>
      </div>

      <div className="pc-divider" />

      {/* ── Tipo de tercero ── */}
      <div className="pc-card">
        <div className="pc-card-header-simple">Tipo de tercero</div>
        <div className="pc-tipo-grid">
          <div
            className={`pc-tipo-item ${cliente.esCliente ? "pc-tipo-active" : ""}`}
          >
            <span
              className={cliente.esCliente ? "pc-link" : "pc-tipo-disabled"}
            >
              Clientes
            </span>
            <p>
              Personas o empresas a las cuales necesitas generarles una factura
              de venta
            </p>
          </div>
          <div
            className={`pc-tipo-item ${cliente.esProveedor ? "pc-tipo-active" : ""}`}
          >
            <span
              className={cliente.esProveedor ? "pc-link" : "pc-tipo-disabled"}
            >
              Proveedores
            </span>
            <p>
              Todas las personas o empresas a las cuales les compras bienes o
              servicios
            </p>
          </div>
          <div
            className={`pc-tipo-item ${cliente.esOtro ? "pc-tipo-active" : ""}`}
          >
            <span className={cliente.esOtro ? "pc-link" : "pc-tipo-disabled"}>
              Otros
            </span>
            <p>Por ejemplo: Fondos de salud y pensión, bancos, etc.</p>
          </div>
        </div>
      </div>

      {/* ── Datos básicos + Facturación ── */}
      <div className="pc-cards-row">
        {/* Card Datos básicos */}
        <div className="pc-card pc-card-half">
          <div className="pc-card-header-simple">Datos básicos</div>
          <div className="pc-data-grid">
            <div className="pc-data-col">
              {campo("Tipo", esEmpresa ? "Empresa" : "Persona natural")}
              {campo("Tipo de identificación", cliente.tipoIdentificacion)}
              {campo("# Identificación", cliente.numeroIdentificacion)}
              {campo("Dv", cliente.digitoVerificacion ?? "0")}
              {campo("Código de la sucursal", cliente.codigoSucursal ?? "0")}
              <div className="pc-field">
                <span className="pc-field-label">Indicativo</span>
                <span className="pc-field-label" style={{ marginLeft: 60 }}>
                  {" "}
                  # de Teléfono
                </span>
                <span className="pc-field-label" style={{ marginLeft: 80 }}>
                  Extensión
                </span>
              </div>
              {telefonos.map((t, i) => (
                <div className="pc-tel-row" key={i}>
                  <span className="pc-field-value">{t.indicativo || "—"}</span>
                  <span className="pc-field-value">{t.numero || "—"}</span>
                  <span className="pc-field-value">{t.extension || "—"}</span>
                </div>
              ))}
            </div>
            <div className="pc-data-col">
              {esEmpresa ? (
                campo("Razón social", cliente.razonSocial || cliente.nombre)
              ) : (
                <>
                  {campo("Nombres", cliente.nombre)}
                  {campo("Apellidos", cliente.apellido)}
                </>
              )}
              {campo("Nombre comercial", cliente.nombreComercial)}
              {campo("Ciudad", cliente.ciudad)}
              {campo("Dirección", cliente.direccion)}
            </div>
          </div>
        </div>

        {/* Card Datos para facturación */}
        <div className="pc-card pc-card-half">
          <div className="pc-card-header-simple">
            Datos para facturación y envío
          </div>
          <div className="pc-data-grid">
            <div className="pc-data-col">
              {campo("Nombres del contacto", cliente.nombreContactoFacturacion)}
              {campo(
                "Apellidos del contacto",
                cliente.apellidoContactoFacturacion,
              )}
              {campo("Correo electrónico", cliente.correo)}
              {campo("Tipo de régimen IVA", cliente.regimenTributario)}
              <div className="pc-field">
                <span className="pc-field-label">Indicativo</span>
                <span className="pc-field-label" style={{ marginLeft: 70 }}>
                  {" "}
                  # de Teléfono
                </span>
              </div>
              <div className="pc-tel-row">
                <span className="pc-field-value">
                  {cliente.indicativoFacturacion || "—"}
                </span>
                <span className="pc-field-value">
                  {cliente.telefonoFacturacion || "—"}
                </span>
              </div>
              {campo("Código postal", cliente.codigoPostal)}
            </div>
            <div className="pc-data-col">
              <span className="pc-link pc-label-rf">
                Responsabilidad fiscal
              </span>
              {responsabilidades.length > 0 ? (
                responsabilidades.map((r) => (
                  <div className="pc-field" key={r.name}>
                    <span className="pc-field-value">
                      {r.codigo} - {r.label}
                    </span>
                  </div>
                ))
              ) : (
                <span className="pc-empty">No asignada</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
