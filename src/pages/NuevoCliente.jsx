import React, { useState, useEffect } from "react";
import { PlusCircle, Trash, ChevronDown, ChevronUp, QuestionCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useCliente } from "../hooks/useCliente";
import "../styles/NuevoCliente.css";

function Tooltip({ texto }) {
  const [show, setShow] = useState(false);
  return (
    <span className="tooltip-wrap ms-1" style={{ position: "relative" }}>
      <QuestionCircle size={14} className="text-primary" style={{ cursor: "pointer" }}
        onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} />
      {show && <div className="tooltip-box">{texto}</div>}
    </span>
  );
}

function LineInput({ label, required, color = "muted", tooltip, ...props }) {
  const labelColor = color === "red" ? "#e53e3e" : color === "green" ? "#38a169" : "#718096";
  return (
    <div className="line-field">
      {label && (
        <label className="line-label" style={{ color: labelColor }}>
          {required && <span className="text-danger me-1">*</span>}
          {label}
          {tooltip && <Tooltip texto={tooltip} />}
        </label>
      )}
      <input className="line-input" {...props} />
    </div>
  );
}

function LineSelect({ label, required, color = "muted", tooltip, children, ...props }) {
  const labelColor = color === "red" ? "#e53e3e" : color === "green" ? "#38a169" : "#718096";
  return (
    <div className="line-field">
      {label && (
        <label className="line-label" style={{ color: labelColor }}>
          {required && <span className="text-danger me-1">*</span>}
          {label}
          {tooltip && <Tooltip texto={tooltip} />}
        </label>
      )}
      <div className="line-select-wrap">
        <select className="line-input line-select" {...props}>{children}</select>
        <ChevronDown size={14} className="select-arrow" />
      </div>
    </div>
  );
}

const RESPS = [
  { codigo: "O-13",    label: "Gran contribuyente"           },
  { codigo: "O-15",    label: "Autorretenedor"               },
  { codigo: "O-23",    label: "Agente de retención IVA"      },
  { codigo: "O-47",    label: "Régimen simple de tributación"},
  { codigo: "R-99-PN", label: "No aplica - Otros"            },
];

// ✅ Props para uso desde modal (NuevoDocumentoSoporte)
export default function NuevoCliente({ tipoInicial, nombreInicial, onSuccessExterno }) {
  const navigate = useNavigate();

  const [tipoTercero, setTipoTercero] = useState(tipoInicial ?? { clientes: true });

  // ✅ Título dinámico según contexto
  const tituloFormulario =
    tipoInicial?.proveedores ? "Crear proveedor" :
    tipoInicial?.empleados   ? "Crear empleado"  :
    "Crear cliente";

  const { cliente, guardando, handleChange, handleSubmit } = useCliente({
    clienteEditando: null,
    open: true,
    onSuccess: (nuevoRegistro, msg) => {
      if (onSuccessExterno) {
        onSuccessExterno(nuevoRegistro);   // ✅ devuelve al modal padre
      } else {
        alert(msg);
        navigate(-1);
      }
    },
    onClose: () => {
      if (!onSuccessExterno) navigate(-1);
    },
  });

  // ✅ Precarga nombre si viene del Select
  useEffect(() => {
    if (nombreInicial?.trim()) {
      handleChange({ target: { name: "nombre", value: nombreInicial } });
    }
  }, []);

  const [telefonos, setTelefonos] = useState([{ indicativo: "605", telefono: "", extension: "" }]);
  const [contactos, setContactos] = useState([{
    nombre: "", apellido: "", correo: "", cargo: "", indicativo: "", telefono: "",
  }]);
  const [contactosOpen,    setContactosOpen]    = useState(false);
  const [responsabilidades, setResp]            = useState(["R-99-PN"]);
  const [touched,          setTouched]          = useState({});
  const [contactoFact,     setContactoFact]     = useState({
    nombreContactoFact: "", apellidoContactoFact: "",
    correoFact: "", tipoRegimenIva: "",
    indicativoFact: "", telefonoFact: "", codigoPostal: "",
  });

  useEffect(() => {
    setContactoFact((p) => ({
      ...p,
      nombreContactoFact:   cliente.nombre   || "",
      apellidoContactoFact: cliente.apellido || "",
    }));
  }, [cliente.nombre, cliente.apellido]);

  useEffect(() => {
    setContactoFact((p) => ({ ...p, correoFact: cliente.correo || "" }));
  }, [cliente.correo]);

  useEffect(() => {
    setContactoFact((p) => ({ ...p, telefonoFact: cliente.telefono || "" }));
  }, [cliente.telefono]);

  const setCF       = (k, v) => setContactoFact((p) => ({ ...p, [k]: v }));
  const marcar      = (k)    => setTouched((p) => ({ ...p, [k]: true }));
  const inv         = (k)    => touched[k] && !cliente[k];
  const toggleResp  = (cod)  => setResp((p) =>
    p.includes(cod) ? p.filter((r) => r !== cod) : [...p, cod]
  );
  const updTel = (i, k, v) => { const a = [...telefonos]; a[i][k] = v; setTelefonos(a); };
  const updContact = (i, k, v) => { const a = [...contactos]; a[i][k] = v; setContactos(a); };

  // ✅ Cancelar respeta si es modal o página
  const handleCancelar = () => {
    if (onSuccessExterno) onSuccessExterno(null);
    else navigate(-1);
  };

  const handleGuardar = () => {
    if (!cliente.numeroIdentificacion?.trim() || !cliente.nombre?.trim()) {
      setTouched({ numeroIdentificacion: true, nombre: true });
      return;
    }
    handleSubmit({
      codigoSucursal:       "0",
      nombreContactoFact:   contactoFact.nombreContactoFact,
      apellidoContactoFact: contactoFact.apellidoContactoFact,
      correoFact:           contactoFact.correoFact,
      RegimenTributario:    contactoFact.tipoRegimenIva,   // ✅ fix typo (era RegienTributario)
      indicativoFact:       contactoFact.indicativoFact,
      telefonoFact:         contactoFact.telefonoFact,
      codigoPostal:         contactoFact.codigoPostal,
      responsabilidades,
      esCliente:   !!tipoTercero.clientes,
      esProveedor: !!tipoTercero.proveedores,
      esEmpleado:  !!tipoTercero.empleados,
      telefonos: telefonos
        .filter((t) => t.telefono.trim() !== "")
        .map((t) => ({ indicativo: t.indicativo, numero: t.telefono, extension: t.extension })),
      contactos: contactos
        .filter((c) => c.nombre.trim() !== "")
        .map((c) => ({ nombre: c.nombre, apellido: c.apellido, correo: c.correo,
                       cargo: c.cargo, indicativo: c.indicativo, telefono: c.telefono })),
    });
  };

  return (
    <div className="crear-cliente-wrap">
      {/* HEADER */}
      <div className="cc-header">
        <h2 className="cc-title">{tituloFormulario}</h2>
        <div className="cc-header-actions">
          <button className="btn-cancelar" onClick={handleCancelar} disabled={guardando}>
            Cancelar
          </button>
          <button className="btn-guardar" onClick={handleGuardar} disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {/* TIPO DE TERCERO */}
      <div className="cc-card mb-4">
        <h6 className="cc-card-title">Tipo de tercero</h6>
        <div className="d-flex flex-wrap gap-4">
          {["clientes", "proveedores", "empleados"].map((t) => (
            <div key={t}>
              <label className="d-flex align-items-center gap-2 cursor-pointer">
                <input type="checkbox" className="cc-checkbox"
                  checked={!!tipoTercero[t]}
                  onChange={() => setTipoTercero((p) => ({ ...p, [t]: !p[t] }))} />
                <span className="text-primary fw-semibold text-capitalize">{t}</span>
              </label>
              {t === "clientes" && (
                <p className="cc-tercero-desc">
                  Personas o empresas a las cuales necesitas generarles una factura de venta
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* DOS COLUMNAS */}
      <div className="cc-two-col mb-4">
        {/* DATOS BÁSICOS */}
        <div className="cc-card cc-datos-basicos">
          <h6 className="cc-card-title"><span className="text-danger me-1">*</span> Datos básicos</h6>
          <div className="cc-basicos-grid">
            <div className="cc-col-left">
              <LineSelect label="Tipo" color="green" name="tipoPersona"
                value={cliente.tipoPersona} onChange={handleChange}>
                <option value="persona">Es persona</option>
                <option value="empresa">Es empresa</option>
              </LineSelect>

              <LineSelect label="Tipo de identificación" required color="red"
                name="tipoIdentificacion" value={cliente.tipoIdentificacion} onChange={handleChange}>
                <option value="CC">Cédula de ciudadanía</option>
                <option value="NIT">NIT</option>
                <option value="CE">Cédula de extranjería</option>
                <option value="PP">Pasaporte</option>
                <option value="TI">Tarjeta de identidad</option>
              </LineSelect>

              <div className="cc-id-row">
                <LineInput label="Identificación" required color="red"
                  name="numeroIdentificacion" value={cliente.numeroIdentificacion}
                  onChange={handleChange} onBlur={() => marcar("numeroIdentificacion")}
                  style={{ flex: 1, borderColor: inv("numeroIdentificacion") ? "#e53e3e" : undefined }} />
                <LineInput label="Dv" maxLength={1} name="digitoVerificacion"
                  value={cliente.digitoVerificacion} onChange={handleChange}
                  style={{ width: "56px" }} />
              </div>
              {inv("numeroIdentificacion") && (
                <small style={{ color: "#e53e3e", fontSize: "0.78rem" }}>La identificación es obligatoria</small>
              )}

              <div className="mt-2">
                <button className="btn-link-green" type="button">
                  Autocompletar datos{" "}
                  <Tooltip texto="Busca los datos del tercero usando su identificación en el RUT de la DIAN." />
                </button>
              </div>

              <LineInput label="Código de la sucursal" color="green" value="0" readOnly />

              {/* Teléfonos */}
              <div className="mt-3">
                <label className="line-label" style={{ color: "#38a169" }}>Indicativo</label>
                {telefonos.map((tel, i) => (
                  <div key={i} className="cc-tel-row mb-2">
                    <input className="line-input" style={{ width: "72px" }}
                      value={tel.indicativo} onChange={(e) => updTel(i, "indicativo", e.target.value)} />
                    <div style={{ flex: 1 }}>
                      {i === 0 && <label className="line-label"># de Teléfono</label>}
                      <input className="line-input" value={tel.telefono}
                        onChange={(e) => updTel(i, "telefono", e.target.value)} />
                    </div>
                    <div style={{ width: "90px" }}>
                      {i === 0 && <label className="line-label">Extensión</label>}
                      <input className="line-input" value={tel.extension}
                        onChange={(e) => updTel(i, "extension", e.target.value)} />
                    </div>
                    {telefonos.length > 1 ? (
                      <button className="btn-eliminar"
                        onClick={() => setTelefonos(telefonos.filter((_, idx) => idx !== i))}>
                        <Trash size={14} /> Eliminar
                      </button>
                    ) : (
                      <span className="btn-eliminar opacity-0 pe-none"><Trash size={14} /></span>
                    )}
                  </div>
                ))}
                <button className="btn-link-green mt-1"
                  onClick={() => setTelefonos([...telefonos, { indicativo: "", telefono: "", extension: "" }])}>
                  <PlusCircle size={15} className="me-1" /> Agregar otro Teléfono
                </button>
              </div>
            </div>

            <div className="cc-divider-v" />

            <div className="cc-col-right">
              <LineInput label="Nombres" required name="nombre" value={cliente.nombre}
                onChange={handleChange} onBlur={() => marcar("nombre")}
                style={{ borderColor: inv("nombre") ? "#e53e3e" : undefined }} />
              {inv("nombre") && (
                <small style={{ color: "#e53e3e", fontSize: "0.78rem" }}>El nombre es obligatorio</small>
              )}
              <LineInput label="Apellidos"        name="apellido"       value={cliente.apellido}       onChange={handleChange} />
              <LineInput label="Nombre comercial" name="nombreComercial" value={cliente.nombreComercial} onChange={handleChange} />
              <LineInput label="Departamento" color="green" name="departamento" value={cliente.departamento} onChange={handleChange} />
              <LineInput label="Ciudad"       color="green" name="ciudad"       value={cliente.ciudad}       onChange={handleChange} />
              <LineInput label="Dirección"                  name="direccion"    value={cliente.direccion}    onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* DATOS FACTURACIÓN */}
        <div className="cc-card cc-facturacion">
          <div className="cc-fact-grid">
            <div>
              <h6 className="cc-card-title">
                Datos para facturación y envío
                <Tooltip texto="Se autocompletan con el nombre. Puedes editarlos manualmente." />
              </h6>
              <LineInput label="Nombres del contacto"   value={contactoFact.nombreContactoFact}
                onChange={(e) => setCF("nombreContactoFact", e.target.value)} />
              <LineInput label="Apellidos del contacto" value={contactoFact.apellidoContactoFact}
                onChange={(e) => setCF("apellidoContactoFact", e.target.value)} />
              <LineInput label="Correo electrónico cuando aplique" type="email"
                name="correo" value={cliente.correo} onChange={handleChange} />
              <LineSelect label="Tipo de régimen IVA" value={contactoFact.tipoRegimenIva}
                onChange={(e) => setCF("tipoRegimenIva", e.target.value)}>
                <option value=""></option>
                <option value="responsable">Responsable de IVA</option>
                <option value="no_responsable">No responsable de IVA</option>
              </LineSelect>
              <div className="cc-tel-row mt-2">
                <div style={{ width: "80px" }}>
                  <LineInput label="Indicativo" value={contactoFact.indicativoFact}
                    onChange={(e) => setCF("indicativoFact", e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <LineInput label="# de Teléfono" name="telefono"
                    value={cliente.telefono} onChange={handleChange} />
                </div>
              </div>
              <LineInput label="Código postal" value={contactoFact.codigoPostal}
                onChange={(e) => setCF("codigoPostal", e.target.value)} />
            </div>

            <div className="cc-divider-v" />

            <div>
              <h6 className="cc-subtitle-blue">Responsabilidad fiscal</h6>
              <p className="cc-resp-desc">
                Verifica la responsabilidad en el RUT de tu cliente, mínimo asignar R-99-PN
              </p>
              {RESPS.map((r) => (
                <label key={r.codigo} className="cc-resp-item">
                  <input type="checkbox" className="cc-checkbox"
                    checked={responsabilidades.includes(r.codigo)}
                    onChange={() => toggleResp(r.codigo)} />
                  <span className="cc-resp-cod">{r.codigo}</span>
                  <span className="cc-resp-label">{r.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CONTACTOS */}
      <div className={`cc-contactos-card mb-5 ${contactosOpen ? "open" : ""}`}>
        <button className="cc-contactos-header" onClick={() => setContactosOpen(!contactosOpen)}>
          {contactosOpen
            ? <ChevronUp   size={18} className="me-2 text-primary" />
            : <ChevronDown size={18} className="me-2 text-primary" />}
          <span className="cc-subtitle-blue fw-bold fs-6">Contactos</span>
          <Tooltip texto="Agrega los contactos del cliente para gestionar comunicaciones y envíos." />
        </button>
        {contactosOpen && (
          <div className="cc-contactos-body">
            {contactos.map((c, i) => (
              <div key={i} className="cc-contacto-row mb-3">
                <span className="cc-contacto-num">{i + 1})</span>
                <div className="flex-fill"><LineInput label="* Nombre" required value={c.nombre}
                  onChange={(e) => updContact(i, "nombre", e.target.value)} /></div>
                <div className="flex-fill"><LineInput label="Apellido" value={c.apellido}
                  onChange={(e) => updContact(i, "apellido", e.target.value)} /></div>
                <div className="flex-fill"><LineInput label="Correo electrónico" type="email"
                  value={c.correo} onChange={(e) => updContact(i, "correo", e.target.value)} /></div>
                <div className="flex-fill"><LineInput label="Cargo" value={c.cargo}
                  onChange={(e) => updContact(i, "cargo", e.target.value)} /></div>
                <div style={{ width: "80px" }}><LineInput label="Indicativo" value={c.indicativo}
                  onChange={(e) => updContact(i, "indicativo", e.target.value)} /></div>
                <div className="flex-fill"><LineInput label="# de Teléfono" value={c.telefono}
                  onChange={(e) => updContact(i, "telefono", e.target.value)} /></div>
                {contactos.length > 1 && (
                  <button className="btn-eliminar align-self-end mb-1"
                    onClick={() => setContactos(contactos.filter((_, idx) => idx !== i))}>
                    <Trash size={14} /> Eliminar
                  </button>
                )}
              </div>
            ))}
            <button className="btn-link-green" onClick={() =>
              setContactos([...contactos, { nombre: "", apellido: "", correo: "", cargo: "", indicativo: "", telefono: "" }])}>
              <PlusCircle size={15} className="me-1" /> Agregar otro contacto
            </button>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="cc-footer">
        <button className="btn-cancelar" onClick={handleCancelar} disabled={guardando}>
          Cancelar
        </button>
        <button className="btn-guardar" onClick={handleGuardar} disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
}
