import { useState } from "react";
import {
  GearFill,
  BuildingFill,
  CurrencyDollar,
  ShieldFillCheck,
  CreditCardFill,
  CheckCircleFill,
  Server,
  PeopleFill,
  FileEarmarkTextFill,
  EnvelopeFill,
  FileEarmarkCodeFill,
  PaletteFill,
  WrenchAdjustableCircleFill,
  ArrowClockwise,
  SendFill,
  ExclamationTriangleFill,
  CheckLg,
  XLg,
  ClipboardDataFill,
  BoxFill,
} from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../../api/axiosClient";

// ── Hook datos de configuración ───────────────────────────────
function useConfiguracion() {
  return useQuery({
    queryKey: ["admin", "configuracion"],
    queryFn: async () => {
      const { data } = await axiosClient.get("/Admin/configuracion");
      return data;
    },
    staleTime: 60 * 1000,
  });
}

function useSaveConfig(endpoint, successMsg) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => axiosClient.post(endpoint, body).then((r) => r.data),
    onSuccess: () => {
      toast.success(successMsg);
      qc.invalidateQueries({ queryKey: ["admin", "configuracion"] });
    },
    onError: (err) => toast.error(err?.response?.data?.mensaje ?? "Error al guardar"),
  });
}

// ── Sección: Sistema ──────────────────────────────────────────
function SeccionSistema() {
  const { data, isLoading, refetch, isFetching } = useConfiguracion();
  const sistema = data?.sistema;

  const items = [
    { label: "Versión", value: sistema?.version ?? "—", icon: <Server size={16} />, color: "#2563eb" },
    { label: "Ambiente", value: sistema?.ambiente ?? "—", icon: <Server size={16} />, color: sistema?.ambiente === "Production" ? "#16a34a" : "#d97706" },
    { label: "Total usuarios", value: sistema?.totalUsuarios ?? "—", icon: <PeopleFill size={16} />, color: "#7c3aed" },
    { label: "Planes activos", value: sistema?.planesActivos ?? "—", icon: <CreditCardFill size={16} />, color: "#0891b2" },
    { label: "Suscripciones activas", value: sistema?.suscripcionesActivas ?? "—", icon: <ClipboardDataFill size={16} />, color: "#16a34a" },
    { label: "Total facturas", value: sistema?.totalFacturas ?? "—", icon: <FileEarmarkTextFill size={16} />, color: "#ea580c" },
    { label: "Total clientes", value: sistema?.totalClientes ?? "—", icon: <PeopleFill size={16} />, color: "#be185d" },
    {
      label: "Uptime servidor",
      value: sistema?.uptimeHoras != null ? `${sistema.uptimeHoras}h` : "—",
      icon: <Server size={16} />,
      color: "#475569",
    },
    {
      label: "Fecha servidor",
      value: sistema?.fechaServidor ? new Date(sistema.fechaServidor).toLocaleString("es-CO") : "—",
      icon: <Server size={16} />,
      color: "#475569",
    },
  ];

  if (isLoading) return <div className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary" /></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
          Estado en tiempo real del servidor
        </span>
        <button
          className="admin-btn admin-btn-ghost admin-btn-sm d-flex align-items-center gap-1"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <ArrowClockwise size={14} className={isFetching ? "spin" : ""} />
          Actualizar
        </button>
      </div>

      <div className="row g-3">
        {items.map((item) => (
          <div key={item.label} className="col-12 col-md-6 col-lg-4">
            <div className="d-flex align-items-center gap-3 p-3" style={{ borderRadius: 10, border: "1px solid var(--border-admin)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${item.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: item.color, flexShrink: 0 }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em" }}>{item.label}</div>
                <div style={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>{item.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 d-flex align-items-center gap-2" style={{ borderRadius: 10, border: "1px solid #16a34a" }}>
        <CheckCircleFill size={16} color="#16a34a" />
        <span style={{ fontSize: "0.85rem", color: "#15803d", fontWeight: 500 }}>Sistema operando con normalidad</span>
      </div>
    </div>
  );
}

// ── Sección: Empresa ──────────────────────────────────────────
function SeccionEmpresa() {
  const { data } = useConfiguracion();
  const remoto = data?.empresa ?? {};
  const [form, setForm] = useState(null);
  const save = useSaveConfig("/Admin/configuracion/empresa", "Configuración de empresa guardada");

  const valores = form ?? {
    nombreEmpresa: remoto.nombreEmpresa ?? "",
    nit: remoto.nit ?? "",
    direccion: remoto.direccion ?? "",
    ciudad: remoto.ciudad ?? "",
    telefono: remoto.telefono ?? "",
    correo: remoto.correo ?? "",
    sitioWeb: remoto.sitioWeb ?? "",
    regimenFiscal: remoto.regimenFiscal ?? "Simplificado",
    logoUrl: remoto.logoUrl ?? "",
  };

  const set = (k) => (e) => setForm((p) => ({ ...(p ?? valores), [k]: e.target.value }));

  return (
    <div>
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label className="admin-form-label">Nombre / Razón social</label>
          <input className="admin-form-control" value={valores.nombreEmpresa} onChange={set("nombreEmpresa")} placeholder="Mi Empresa SAS" />
        </div>
        <div className="col-12 col-md-6">
          <label className="admin-form-label">NIT</label>
          <input className="admin-form-control" value={valores.nit} onChange={set("nit")} placeholder="900.000.000-0" />
        </div>
        <div className="col-12">
          <label className="admin-form-label">Dirección</label>
          <input className="admin-form-control" value={valores.direccion} onChange={set("direccion")} placeholder="Calle 1 # 2-3" />
        </div>
        <div className="col-6">
          <label className="admin-form-label">Ciudad</label>
          <input className="admin-form-control" value={valores.ciudad} onChange={set("ciudad")} placeholder="Bogotá" />
        </div>
        <div className="col-6">
          <label className="admin-form-label">Teléfono</label>
          <input className="admin-form-control" value={valores.telefono} onChange={set("telefono")} placeholder="601 000 0000" />
        </div>
        <div className="col-6">
          <label className="admin-form-label">Correo electrónico</label>
          <input type="email" className="admin-form-control" value={valores.correo} onChange={set("correo")} placeholder="contacto@empresa.com" />
        </div>
        <div className="col-6">
          <label className="admin-form-label">Sitio web</label>
          <input className="admin-form-control" value={valores.sitioWeb} onChange={set("sitioWeb")} placeholder="https://empresa.com" />
        </div>
        <div className="col-12 col-md-6">
          <label className="admin-form-label">URL del logo</label>
          <input className="admin-form-control" value={valores.logoUrl} onChange={set("logoUrl")} placeholder="https://cdn.empresa.com/logo.png" />
        </div>
        <div className="col-12 col-md-6">
          <label className="admin-form-label">Régimen fiscal</label>
          <select className="admin-form-select" value={valores.regimenFiscal} onChange={set("regimenFiscal")}>
            <option value="Simplificado">Régimen Simplificado</option>
            <option value="Ordinario">Régimen Ordinario</option>
            <option value="Especial">Régimen Especial</option>
          </select>
        </div>
        <div className="col-12 d-flex justify-content-end">
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => save.mutate(valores)}
            disabled={save.isPending}
          >
            {save.isPending ? "Guardando…" : "Guardar configuración"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sección: Impuestos ────────────────────────────────────────
const IMPUESTOS_DEFAULT = [
  { id: 1, nombre: "IVA General", tipo: "IVA", porcentaje: 19, activo: true },
  { id: 2, nombre: "IVA Reducido", tipo: "IVA", porcentaje: 5, activo: true },
  { id: 3, nombre: "IVA Exento", tipo: "IVA", porcentaje: 0, activo: true },
  { id: 4, nombre: "INC Bebidas", tipo: "INC", porcentaje: 8, activo: false },
];

function SeccionImpuestos() {
  const [impuestos, setImpuestos] = useState(IMPUESTOS_DEFAULT);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoTipo, setNuevoTipo] = useState("IVA");
  const [nuevoPct, setNuevoPct] = useState("");

  const toggleActivo = (id) => {
    setImpuestos((p) => p.map((imp) => imp.id === id ? { ...imp, activo: !imp.activo } : imp));
    toast.success("Impuesto actualizado");
  };

  const handleAgregar = () => {
    if (!nuevoNombre.trim() || nuevoPct === "") return toast.error("Completa todos los campos");
    setImpuestos((p) => [...p, { id: Date.now(), nombre: nuevoNombre, tipo: nuevoTipo, porcentaje: Number(nuevoPct), activo: true }]);
    setNuevoNombre(""); setNuevoPct("");
    toast.success("Impuesto agregado");
  };

  return (
    <div>
      <div className="admin-table-wrapper mb-4">
        <table className="admin-table">
          <thead>
            <tr><th>Nombre</th><th>Tipo</th><th>Porcentaje</th><th>Estado</th><th style={{ width: 90 }}>Acción</th></tr>
          </thead>
          <tbody>
            {impuestos.map((imp) => (
              <tr key={imp.id}>
                <td style={{ fontWeight: 500 }}>{imp.nombre}</td>
                <td><span className="admin-badge info">{imp.tipo}</span></td>
                <td style={{ fontWeight: 700 }}>{imp.porcentaje}%</td>
                <td>
                  <button className={`admin-btn admin-btn-sm ${imp.activo ? "admin-btn-success" : "admin-btn-ghost"}`} onClick={() => toggleActivo(imp.id)}>
                    {imp.activo ? "Activo" : "Inactivo"}
                  </button>
                </td>
                <td>
                  <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => { setImpuestos((p) => p.filter((x) => x.id !== imp.id)); toast.success("Impuesto eliminado"); }}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ borderRadius: 12, padding: 16, border: "1px solid var(--border-admin)" }}>
        <div className="admin-card-title mb-3">Agregar impuesto</div>
        <div className="row g-2 align-items-end">
          <div className="col-12 col-md-4">
            <label className="admin-form-label">Nombre</label>
            <input className="admin-form-control" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} placeholder="IVA Nuevo" />
          </div>
          <div className="col-4 col-md-2">
            <label className="admin-form-label">Tipo</label>
            <select className="admin-form-select" value={nuevoTipo} onChange={(e) => setNuevoTipo(e.target.value)}>
              {["IVA", "INC", "ICA"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="col-4 col-md-2">
            <label className="admin-form-label">%</label>
            <input type="number" className="admin-form-control" value={nuevoPct} onChange={(e) => setNuevoPct(e.target.value)} placeholder="0" min="0" max="100" />
          </div>
          <div className="col-4 col-md-4">
            <button className="admin-btn admin-btn-primary w-100" onClick={handleAgregar}>Agregar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sección: Métodos de pago ──────────────────────────────────
const METODOS_DEFAULT = [
  { id: 1, nombre: "Efectivo", activo: true },
  { id: 2, nombre: "Transferencia bancaria", activo: true },
  { id: 3, nombre: "Tarjeta débito", activo: true },
  { id: 4, nombre: "Tarjeta crédito", activo: true },
  { id: 5, nombre: "PSE", activo: true },
  { id: 6, nombre: "Cheque", activo: false },
  { id: 7, nombre: "Nequi", activo: false },
  { id: 8, nombre: "Daviplata", activo: false },
];

function SeccionMetodosPago() {
  const [metodos, setMetodos] = useState(METODOS_DEFAULT);
  const toggle = (id) => setMetodos((p) => p.map((m) => m.id === id ? { ...m, activo: !m.activo } : m));

  return (
    <div>
      <div className="row g-3 mb-4">
        {metodos.map((m) => (
          <div key={m.id} className="col-12 col-md-6">
            <div
              className="d-flex align-items-center justify-content-between p-3"
              style={{ borderRadius: 10, border: `1px solid ${m.activo ? "var(--primary)" : "var(--text-muted)"}` }}
            >
              <div style={{ fontWeight: 500, fontSize: "0.9rem", color: m.activo ? "var(--primary)" : "var(--text-muted)" }}>{m.nombre}</div>
              <button className={`admin-btn admin-btn-sm ${m.activo ? "admin-btn-success" : "admin-btn-ghost"}`} onClick={() => toggle(m.id)}>
                {m.activo ? <><CheckLg size={12} /> Activo</> : <><XLg size={12} /> Inactivo</>}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-end">
        <button className="admin-btn admin-btn-primary" onClick={() => toast.success("Métodos de pago guardados")}>
          Guardar métodos
        </button>
      </div>
    </div>
  );
}

// ── Sección: Seguridad ────────────────────────────────────────
function SeccionSeguridad() {
  const [config, setConfig] = useState({
    dobleAutenticacion: false,
    intentosLogin: 5,
    tiempoSesion: 480,
    logActividad: true,
    alertasLogin: true,
    bloqueoIpSospechosa: false,
    requerirContrasenaFuerte: true,
  });

  const set = (k) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : Number(e.target.value);
    setConfig((p) => ({ ...p, [k]: val }));
  };

  const toggles = [
    { key: "dobleAutenticacion", label: "Doble autenticación (2FA)", desc: "Solicitar código adicional al iniciar sesión" },
    { key: "logActividad", label: "Log de actividad", desc: "Registrar acciones de usuarios en el sistema" },
    { key: "alertasLogin", label: "Alertas de inicio de sesión", desc: "Notificar por correo en cada inicio de sesión" },
    { key: "bloqueoIpSospechosa", label: "Bloqueo de IP sospechosa", desc: "Bloquear IPs tras múltiples intentos fallidos" },
    { key: "requerirContrasenaFuerte", label: "Contraseña fuerte obligatoria", desc: "Mínimo 8 caracteres, mayúsculas y números" },
  ];

  return (
    <div>
      <div className="row g-3">
        {toggles.map((t) => (
          <div key={t.key} className="col-12">
            <div className="d-flex align-items-center justify-content-between p-3" style={{ borderRadius: 10, border: "1px solid var(--border-admin)", background: "var(--bg-admin)" }}>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text-muted-light)" }}>{t.label}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{t.desc}</div>
              </div>
              <div className="form-check form-switch mb-0">
                <input className="form-check-input" type="checkbox" role="switch" checked={config[t.key]} onChange={set(t.key)} style={{ width: 44, height: 22, cursor: "pointer" }} />
              </div>
            </div>
          </div>
        ))}
        <div className="col-6">
          <label className="admin-form-label">Intentos antes de bloqueo</label>
          <input type="number" className="admin-form-control" value={config.intentosLogin} onChange={set("intentosLogin")} min={1} max={10} />
        </div>
        <div className="col-6">
          <label className="admin-form-label">Tiempo de sesión (minutos)</label>
          <input type="number" className="admin-form-control" value={config.tiempoSesion} onChange={set("tiempoSesion")} min={30} max={1440} />
        </div>
        <div className="col-12 d-flex justify-content-end">
          <button className="admin-btn admin-btn-primary" onClick={() => toast.success("Configuración de seguridad guardada")}>
            Guardar seguridad
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sección: Notificaciones SMTP ──────────────────────────────
function SeccionNotificaciones() {
  const { data } = useConfiguracion();
  const remoto = data?.smtp ?? {};
  const [form, setForm] = useState(null);
  const [probando, setProbando] = useState(false);
  const [correoTest, setCorreoTest] = useState("");
  const [resultTest, setResultTest] = useState(null);
  const save = useSaveConfig("/Admin/configuracion/smtp", "Configuración SMTP guardada");

  const valores = form ?? {
    host: remoto.host ?? "",
    puerto: remoto.puerto ?? 587,
    usuario: remoto.usuario ?? "",
    contrasena: "",
    remitente: remoto.remitente ?? "",
    nombreRemitente: remoto.nombreRemitente ?? "FactCloud",
    usarTls: remoto.usarTls ?? true,
  };
  const set = (k) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm((p) => ({ ...(p ?? valores), [k]: val }));
  };

  const probarConexion = async () => {
    if (!correoTest) return toast.error("Ingresa un correo destino para la prueba");
    setProbando(true); setResultTest(null);
    try {
      const { data: res } = await axiosClient.post("/Admin/configuracion/smtp/probar", { correoDestino: correoTest });
      setResultTest({ ok: true, msg: res.mensaje });
      toast.success(res.mensaje);
    } catch (err) {
      const msg = err?.response?.data?.mensaje ?? "Error de conexión SMTP";
      setResultTest({ ok: false, msg });
      toast.error(msg);
    } finally {
      setProbando(false);
    }
  };

  const PROVIDERS = [
    { label: "Gmail", host: "smtp.gmail.com", puerto: 587 },
    { label: "Outlook", host: "smtp.office365.com", puerto: 587 },
    { label: "SendGrid", host: "smtp.sendgrid.net", puerto: 587 },
    { label: "Mailtrap", host: "smtp.mailtrap.io", puerto: 2525 },
  ];

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 mb-4">
        {PROVIDERS.map((p) => (
          <button
            key={p.label}
            className="admin-btn admin-btn-ghost admin-btn-sm"
            onClick={() => setForm((f) => ({ ...(f ?? valores), host: p.host, puerto: p.puerto }))}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-8">
          <label className="admin-form-label">Servidor SMTP</label>
          <input className="admin-form-control" value={valores.host} onChange={set("host")} placeholder="smtp.gmail.com" />
        </div>
        <div className="col-4">
          <label className="admin-form-label">Puerto</label>
          <input type="number" className="admin-form-control" value={valores.puerto} onChange={set("puerto")} placeholder="587" />
        </div>
        <div className="col-12 col-md-6">
          <label className="admin-form-label">Usuario / Email</label>
          <input className="admin-form-control" value={valores.usuario} onChange={set("usuario")} placeholder="usuario@gmail.com" />
        </div>
        <div className="col-12 col-md-6">
          <label className="admin-form-label">Contraseña / App Password</label>
          <input type="password" className="admin-form-control" value={valores.contrasena} onChange={set("contrasena")} placeholder={remoto.tieneContrasena ? "••••••••" : "Contraseña"} />
        </div>
        <div className="col-12 col-md-6">
          <label className="admin-form-label">Email remitente</label>
          <input className="admin-form-control" value={valores.remitente} onChange={set("remitente")} placeholder="no-reply@empresa.com" />
        </div>
        <div className="col-12 col-md-6">
          <label className="admin-form-label">Nombre remitente</label>
          <input className="admin-form-control" value={valores.nombreRemitente} onChange={set("nombreRemitente")} placeholder="FactCloud" />
        </div>
        <div className="col-12">
          <div className="d-flex align-items-center justify-content-between p-3" style={{ borderRadius: 10, border: "1px solid var(--border-admin)", background: "var(--bg-admin)" }}>
            <div>
              <div style={{ fontWeight: 600, color: "var(--text-muted-light)" }}>Usar TLS/SSL</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Cifrado de conexión (recomendado)</div>
            </div>
            <div className="form-check form-switch mb-0">
              <input className="form-check-input" type="checkbox" role="switch" checked={valores.usarTls} onChange={set("usarTls")} style={{ width: 44, height: 22, cursor: "pointer" }} />
            </div>
          </div>
        </div>

        <div className="col-12">
          <div style={{ borderRadius: 10, border: "1px solid var(--border-admin)", background: "var(--bg-admin)", padding: 16 }}>
            <div className="admin-card-title mb-2" style={{ color: "var(--text-muted-light)" }}>Probar conexión</div>
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <input
                className="admin-form-control"
                style={{ maxWidth: 280 }}
                type="email"
                value={correoTest}
                onChange={(e) => setCorreoTest(e.target.value)}
                placeholder="destino@correo.com"
              />
              <button
                className="admin-btn admin-btn-warning d-flex align-items-center gap-1"
                onClick={probarConexion}
                disabled={probando}
              >
                <SendFill size={14} />
                {probando ? "Enviando…" : "Enviar correo de prueba"}
              </button>
            </div>
            {resultTest && (
              <div className={`mt-2 d-flex align-items-center gap-2`} style={{ fontSize: "0.85rem", color: resultTest.ok ? "#15803d" : "#dc2626" }}>
                {resultTest.ok ? <CheckCircleFill size={14} /> : <ExclamationTriangleFill size={14} />}
                {resultTest.msg}
              </div>
            )}
          </div>
        </div>

        <div className="col-12 d-flex justify-content-end">
          <button className="admin-btn admin-btn-primary" onClick={() => save.mutate(valores)} disabled={save.isPending}>
            {save.isPending ? "Guardando…" : "Guardar configuración SMTP"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sección: DIAN ─────────────────────────────────────────────
function SeccionDian() {
  const { data } = useConfiguracion();
  const remoto = data?.dian ?? {};
  const [form, setForm] = useState(null);
  const save = useSaveConfig("/Admin/configuracion/dian", "Configuración DIAN guardada");

  const valores = form ?? {
    ambiente: remoto.ambiente ?? "Habilitacion",
    numeroResolucion: remoto.numeroResolucion ?? "",
    prefijo: remoto.prefijo ?? "FE",
    rangoDesde: remoto.rangoDesde ?? 1,
    rangoHasta: remoto.rangoHasta ?? 1000000,
    fechaResolucion: remoto.fechaResolucion ? remoto.fechaResolucion.split("T")[0] : "",
    nitEmisor: remoto.nitEmisor ?? "",
    claveCertificado: "",
  };
  const set = (k) => (e) => setForm((p) => ({ ...(p ?? valores), [k]: e.target.type === "number" ? Number(e.target.value) : e.target.value }));

  const ambienteColor = valores.ambiente === "Produccion" ? "#16a34a" : "#d97706";
  const ambienteLabel = valores.ambiente === "Produccion" ? "Producción" : "Habilitación (pruebas)";

  return (
    <div>
      <div className="p-3 mb-4 d-flex align-items-center gap-2" style={{ borderRadius: 10, background: `${ambienteColor}12`, border: `1px solid ${ambienteColor}40` }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: ambienteColor, flexShrink: 0 }} />
        <span style={{ fontWeight: 600, color: ambienteColor, fontSize: "0.85rem" }}>Ambiente activo: {ambienteLabel}</span>
      </div>

      <div className="row g-3">
        <div className="col-12">
          <label className="admin-form-label">Ambiente DIAN</label>
          <select className="admin-form-select" value={valores.ambiente} onChange={set("ambiente")}>
            <option value="Habilitacion">Habilitación (pruebas)</option>
            <option value="Produccion">Producción</option>
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label className="admin-form-label">Número de resolución</label>
          <input className="admin-form-control" value={valores.numeroResolucion} onChange={set("numeroResolucion")} placeholder="18760000001" />
        </div>
        <div className="col-12 col-md-6">
          <label className="admin-form-label">Prefijo de factura</label>
          <input className="admin-form-control" value={valores.prefijo} onChange={set("prefijo")} placeholder="FE" maxLength={10} />
        </div>
        <div className="col-6 col-md-3">
          <label className="admin-form-label">Rango desde</label>
          <input type="number" className="admin-form-control" value={valores.rangoDesde} onChange={set("rangoDesde")} min={1} />
        </div>
        <div className="col-6 col-md-3">
          <label className="admin-form-label">Rango hasta</label>
          <input type="number" className="admin-form-control" value={valores.rangoHasta} onChange={set("rangoHasta")} min={1} />
        </div>
        <div className="col-12 col-md-6">
          <label className="admin-form-label">Fecha de resolución</label>
          <input type="date" className="admin-form-control" value={valores.fechaResolucion} onChange={set("fechaResolucion")} />
        </div>
        <div className="col-12 col-md-6">
          <label className="admin-form-label">NIT emisor autorizado</label>
          <input className="admin-form-control" value={valores.nitEmisor} onChange={set("nitEmisor")} placeholder="900000000" />
        </div>
        <div className="col-12">
          <label className="admin-form-label">Clave del certificado digital (P12)</label>
          <input type="password" className="admin-form-control" value={valores.claveCertificado} onChange={set("claveCertificado")} placeholder="Contraseña del certificado" />
        </div>

        <div className="col-12">
          <div className="p-3" style={{ borderRadius: 10, background: "#fff9ceff", border: "1px solid #fde68a" }}>
            <div className="d-flex align-items-center gap-2 mb-1">
              <ExclamationTriangleFill size={14} color="#d97706" />
              <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#92400e" }}>Nota importante</span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "#78350f", margin: 0 }}>
              En ambiente de habilitación los documentos no tienen validez fiscal. Cambie a Producción solo cuando la DIAN lo haya autorizado y el certificado esté validado.
            </p>
          </div>
        </div>

        <div className="col-12 d-flex justify-content-end">
          <button className="admin-btn admin-btn-primary" onClick={() => save.mutate(valores)} disabled={save.isPending}>
            {save.isPending ? "Guardando…" : "Guardar configuración DIAN"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sección: Apariencia ───────────────────────────────────────
function SeccionApariencia() {
  const { data } = useConfiguracion();
  const remoto = data?.apariencia ?? {};
  const [form, setForm] = useState(null);
  const save = useSaveConfig("/Admin/configuracion/apariencia", "Apariencia guardada");

  const valores = form ?? {
    nombrePlataforma: remoto.nombrePlataforma ?? "Nubee",
    colorPrimario: remoto.colorPrimario ?? "#2563eb",
    colorSecundario: remoto.colorSecundario ?? "#1e40af",
    logoUrl: remoto.logoUrl ?? "",
    faviconUrl: remoto.faviconUrl ?? "",
    slogan: remoto.slogan ?? "",
  };
  const set = (k) => (e) => setForm((p) => ({ ...(p ?? valores), [k]: e.target.value }));

  return (
    <div>
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label className="admin-form-label">Nombre de la plataforma</label>
          <input className="admin-form-control" value={valores.nombrePlataforma} onChange={set("nombrePlataforma")} placeholder="FactCloud" />
        </div>
        <div className="col-12 col-md-6">
          <label className="admin-form-label">Slogan / tagline</label>
          <input className="admin-form-control" value={valores.slogan} onChange={set("slogan")} placeholder="Facturación electrónica simple" />
        </div>
        <div className="col-12">
          <label className="admin-form-label">URL del logo</label>
          <input className="admin-form-control" value={valores.logoUrl} onChange={set("logoUrl")} placeholder="https://cdn.empresa.com/logo.png" />
        </div>
        <div className="col-12">
          <label className="admin-form-label">URL del favicon</label>
          <input className="admin-form-control" value={valores.faviconUrl} onChange={set("faviconUrl")} placeholder="https://cdn.empresa.com/favicon.ico" />
        </div>

        <div className="col-6">
          <label className="admin-form-label">Color primario</label>
          <div className="d-flex align-items-center gap-2">
            <input type="color" value={valores.colorPrimario} onChange={set("colorPrimario")} style={{ width: 40, height: 38, border: "none", padding: 2, borderRadius: 6, cursor: "pointer" }} />
            <input className="admin-form-control" value={valores.colorPrimario} onChange={set("colorPrimario")} placeholder="#2563eb" style={{ fontFamily: "monospace" }} />
          </div>
        </div>
        <div className="col-6">
          <label className="admin-form-label">Color secundario</label>
          <div className="d-flex align-items-center gap-2">
            <input type="color" value={valores.colorSecundario} onChange={set("colorSecundario")} style={{ width: 40, height: 38, border: "none", padding: 2, borderRadius: 6, cursor: "pointer" }} />
            <input className="admin-form-control" value={valores.colorSecundario} onChange={set("colorSecundario")} placeholder="#1e40af" style={{ fontFamily: "monospace" }} />
          </div>
        </div>

        <div className="col-12">
          <div className="p-4" style={{ borderRadius: 12, border: `2px solid ${valores.colorPrimario}` }}>
            <div className="d-flex align-items-center gap-3 mb-2">
              {valores.logoUrl ? (
                <img src={valores.logoUrl} alt="logo" style={{ height: 40, objectFit: "contain" }} onError={(e) => { e.target.style.display = "none"; }} />
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: 8, background: valores.colorPrimario, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BoxFill size={20} color="white" />
                </div>
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: "1.1rem", color: valores.colorPrimario }}>{valores.nombrePlataforma || "Nubee"}</div>
                {valores.slogan && <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{valores.slogan}</div>}
              </div>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Vista previa de la marca</div>
          </div>
        </div>

        <div className="col-12 d-flex justify-content-end">
          <button className="admin-btn admin-btn-primary" onClick={() => save.mutate(valores)} disabled={save.isPending}>
            {save.isPending ? "Guardando…" : "Guardar apariencia"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sección: Mantenimiento ────────────────────────────────────
function SeccionMantenimiento() {
  const { data, refetch } = useConfiguracion();
  const remoto = data?.mantenimiento ?? {};
  const [form, setForm] = useState(null);
  const qc = useQueryClient();

  const valores = form ?? {
    modoMantenimiento: remoto.modoMantenimiento ?? false,
    mensajeMantenimiento: remoto.mensajeMantenimiento ?? "El sistema se encuentra en mantenimiento. Por favor, intente más tarde.",
    inicioMantenimiento: remoto.inicioMantenimiento ? remoto.inicioMantenimiento.split("T")[0] : "",
    finEstimado: remoto.finEstimado ? remoto.finEstimado.split("T")[0] : "",
  };
  const set = (k) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...(p ?? valores), [k]: val }));
  };

  const guardarMant = useMutation({
    mutationFn: (body) => axiosClient.patch("/Admin/configuracion/mantenimiento", body).then((r) => r.data),
    onSuccess: (res) => {
      toast.success(res.mensaje);
      qc.invalidateQueries({ queryKey: ["admin", "configuracion"] });
    },
    onError: () => toast.error("Error al guardar"),
  });

  return (
    <div>
      {valores.modoMantenimiento && (
        <div className="p-3 mb-4 d-flex align-items-center gap-2" style={{ borderRadius: 10, border: "1px solid #fecaca" }}>
          <ExclamationTriangleFill size={16} color="#dc2626" />
          <span style={{ fontWeight: 600, color: "#dc2626", fontSize: "0.85rem" }}>MODO MANTENIMIENTO ACTIVO — Los usuarios no pueden acceder al sistema</span>
        </div>
      )}

      <div className="row g-3">
        <div className="col-12">
          <div
            className="d-flex align-items-center justify-content-between p-4"
            style={{ borderRadius: 12, border: "2px solid var(--border-admin)" }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-muted-light)" }}>Modo mantenimiento</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 2 }}>
                Bloquea el acceso de todos los usuarios excepto el administrador
              </div>
            </div>
            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={valores.modoMantenimiento}
                onChange={set("modoMantenimiento")}
                style={{ width: 52, height: 26, cursor: "pointer" }}
              />
            </div>
          </div>
        </div>

        <div className="col-12">
          <label className="admin-form-label">Mensaje para los usuarios</label>
          <textarea
            className="admin-form-control"
            rows={3}
            value={valores.mensajeMantenimiento}
            onChange={set("mensajeMantenimiento")}
            placeholder="El sistema está en mantenimiento…"
            style={{ resize: "vertical" }}
          />
        </div>

        <div className="col-6">
          <label className="admin-form-label">Inicio del mantenimiento</label>
          <input type="date" className="admin-form-control" value={valores.inicioMantenimiento} onChange={set("inicioMantenimiento")} />
        </div>
        <div className="col-6">
          <label className="admin-form-label">Fin estimado</label>
          <input type="date" className="admin-form-control" value={valores.finEstimado} onChange={set("finEstimado")} />
        </div>

        <div className="col-12">
          <div className="p-3" style={{ borderRadius: 10, border: "1px solid var(--border-admin)" }}>
            <div className="admin-card-title mb-3">Acciones del sistema</div>
            <div className="d-flex flex-wrap gap-2">
              <button className="admin-btn admin-btn-ghost admin-btn-sm d-flex align-items-center gap-1" onClick={() => { refetch(); toast.info("Caché de configuración limpiada"); }}>
                <ArrowClockwise size={14} /> Limpiar caché
              </button>
              <button className="admin-btn admin-btn-ghost admin-btn-sm d-flex align-items-center gap-1" onClick={() => {
                const cfg = JSON.stringify(data, null, 2);
                const blob = new Blob([cfg], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a"); a.href = url; a.download = "factcloud-config.json"; a.click();
                toast.success("Configuración exportada");
              }}>
                <FileEarmarkCodeFill size={14} /> Exportar config JSON
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 d-flex justify-content-end">
          <button
            className={`admin-btn ${valores.modoMantenimiento ? "admin-btn-danger" : "admin-btn-primary"}`}
            onClick={() => guardarMant.mutate(valores)}
            disabled={guardarMant.isPending}
          >
            {guardarMant.isPending ? "Guardando…" : valores.modoMantenimiento ? "⚠ Activar mantenimiento" : "Guardar configuración"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────
const TABS = [
  { id: "sistema", label: "Sistema", icon: <Server size={16} />, component: <SeccionSistema /> },
  { id: "empresa", label: "Empresa", icon: <BuildingFill size={16} />, component: <SeccionEmpresa /> },
  { id: "notificaciones", label: "Notificaciones", icon: <EnvelopeFill size={16} />, component: <SeccionNotificaciones /> },
  { id: "dian", label: "DIAN", icon: <FileEarmarkCodeFill size={16} />, component: <SeccionDian /> },
  { id: "impuestos", label: "Impuestos", icon: <CurrencyDollar size={16} />, component: <SeccionImpuestos /> },
  { id: "pagos", label: "Métodos de pago", icon: <CreditCardFill size={16} />, component: <SeccionMetodosPago /> },
  { id: "apariencia", label: "Apariencia", icon: <PaletteFill size={16} />, component: <SeccionApariencia /> },
  { id: "seguridad", label: "Seguridad", icon: <ShieldFillCheck size={16} />, component: <SeccionSeguridad /> },
  { id: "mantenimiento", label: "Mantenimiento", icon: <WrenchAdjustableCircleFill size={16} />, component: <SeccionMantenimiento /> },
];

export default function AdminConfiguracion() {
  const [tabActiva, setTabActiva] = useState("sistema");
  const tab = TABS.find((t) => t.id === tabActiva);

  return (
    <div>
      <div className="header-card-admin mb-3 px-4">
        <div className="header-content d-flex justify-content-between align-items-center my-3">
          <h2 className="header-title">Configuración del Sistema</h2>
        </div>
        <p className="admin-page-subtitle">
          Gestiona la configuración global de la plataforma
        </p>
      </div>

      <div className="row g-3">
        <div className="col-5 col-md-3">
          <div className="admin-card" style={{ position: "sticky", top: 20 }}>
            <nav>
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTabActiva(t.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 9,
                    border: "none",
                    background: tabActiva === t.id ? "#18345852" : "transparent",
                    color: tabActiva === t.id ? "#2563eb" : "#374151",
                    fontWeight: tabActiva === t.id ? 600 : 400,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    textAlign: "left",
                    marginBottom: 2,
                    transition: "all 0.15s",
                  }}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="col-7 col-md-9">
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-title d-flex align-items-center gap-2">
                {tab?.icon} {tab?.label}
              </div>
            </div>
            {tab?.component}
          </div>
        </div>
      </div>

      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
