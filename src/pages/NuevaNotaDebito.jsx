import React, { useState, useEffect } from "react";
import { CheckCircleFill } from "react-bootstrap-icons";
import axiosClient from "../api/axiosClient";
import FormNotaDebito from "../components/nota-debito/FormNotaDebito";
import "../styles/pages/DocBase.css";

export default function NuevaNotaDebito() {
  const [notasDebito,  setNotasDebito]  = useState([]);
  const [facturas,     setFacturas]     = useState([]);
  const [productos,    setProductos]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");
  const [buscador,     setBuscador]     = useState("");
  const [filtro,       setFiltro]       = useState("recientes");
  const [mostrarForm,  setMostrarForm]  = useState(false);
  const [notaEditando, setNotaEditando] = useState(null);

  const [notaDebito, setNotaDebito] = useState({
    facturaId: "", tipo: "", motivoDIAN: "ND-1",
    fechaElaboracion: new Date().toISOString().split("T")[0],
    observaciones: "", enviar: false,
  });
  const [productosSeleccionados, setProductosSeleccionados] = useState([{
    productoId: "", descripcion: "", cantidad: 1, precioUnitario: 0,
    porcentajeDescuento: 0, tarifaIVA: 19, tarifaINC: 0,
    impuestoCargo: "", impuestoRetencion: "", unidadMedida: "Unidad",
  }]);
  const [formasPago,          setFormasPago]          = useState([{ metodo: "", valor: 0 }]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

  const fetchDatos = async () => {
    try {
      const [nd, fac, pro] = await Promise.all([
        axiosClient.get("/NotasDebito"),
        axiosClient.get("/Facturas"),
        axiosClient.get("/Productos"),
      ]);
      setNotasDebito(nd.data); setFacturas(fac.data); setProductos(pro.data); setError(null);
    } catch (err) { setError(err.response?.data?.message || err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDatos(); }, []);

  const resetear = () => {
    setNotaDebito({ facturaId: "", tipo: "", motivoDIAN: "ND-1",
      fechaElaboracion: new Date().toISOString().split("T")[0], observaciones: "", enviar: false });
    setProductosSeleccionados([{ productoId: "", descripcion: "", cantidad: 1, precioUnitario: 0,
      porcentajeDescuento: 0, tarifaIVA: 19, tarifaINC: 0, impuestoCargo: "", impuestoRetencion: "", unidadMedida: "Unidad" }]);
    setFormasPago([{ metodo: "", valor: 0 }]);
    setFacturaSeleccionada(null); setNotaEditando(null);
  };

  const toggleForm = () => { if (mostrarForm) resetear(); setMostrarForm(p => !p); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notaDebito.facturaId) { alert("Debes seleccionar una factura"); return; }
    try {
      const user = JSON.parse(localStorage.getItem("usuario") || "{}");
      const payload = { usuarioId: user.id, ...notaDebito,
        numeroNota: notaEditando?.numeroNota || `ND-${Date.now()}`,
        estado: "Pendiente",
        detalleNotaDebito: productosSeleccionados.map(it => ({ ...it, productoId: parseInt(it.productoId) })),
        formasPago: formasPago.map(f => ({ metodo: f.metodo, valor: parseFloat(f.valor) })),
      };
      if (notaEditando) { await axiosClient.put(`/NotasDebito/${notaEditando.id}`, payload); setMensajeExito("Nota débito actualizada"); }
      else              { await axiosClient.post("/NotasDebito", payload);                   setMensajeExito("Nota débito creada"); }
      setTimeout(() => setMensajeExito(""), 3000);
      fetchDatos(); resetear(); setMostrarForm(false);
    } catch (err) { alert("Error: " + err.message); }
  };

  const descargarXML = (nota) => {
    if (!nota.xmlBase64) return;
    const blob = new Blob([atob(nota.xmlBase64)], { type: "text/xml" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `ND-${nota.numeroNota}.xml` });
    a.click();
  };

  const filtrados = notasDebito
    .filter(n => !buscador.trim() || n.numeroNota?.toLowerCase().includes(buscador.toLowerCase()))
    .sort((a, b) => filtro === "recientes"
      ? new Date(b.fechaRegistro) - new Date(a.fechaRegistro)
      : new Date(a.fechaRegistro) - new Date(b.fechaRegistro));

  if (loading) return (
    <div className="loading-container mt-5">
      <div className="spinner-border text-primary" /><p className="mt-3">Cargando...</p>
    </div>
  );
  if (error) return (
    <div className="container-error mt-5">
      <div className="alert alert-danger">
        <h5>Error al cargar datos</h5><p>{error}</p>
        <button className="btn btn-primary mt-2" onClick={fetchDatos}>Reintentar</button>
      </div>
    </div>
  );

  return (
    <div className="ds-container">

      {mensajeExito && (
        <div className="alert alert-success alert-dismissible fade show mb-3">
          <CheckCircleFill size={16} className="me-2" /> {mensajeExito}
          <button className="btn-close" onClick={() => setMensajeExito("")} />
        </div>
      )}

      <div className="nota-info mb-3">
        <p><strong>Información importante:</strong> Las notas débito incrementan el valor de una factura. No se pueden aplicar cuando la factura cuenta con aceptación DIAN.</p>
      </div>

      {/* ── Barra de acciones ── */}
      <div className="ds-tabla-topbar mb-2" style={{ background: "none", border: "none", padding: "0 0 12px 0" }}>
        <button className="btn btn-primary btn-sm" onClick={toggleForm}>
          {mostrarForm ? "Ocultar formulario" : "Nueva Nota Débito"}
        </button>
        <div className="d-flex gap-2">
          <input type="text" className="form-control form-control-sm"
            style={{ width: 220 }} placeholder="Buscar por número de nota"
            value={buscador} onChange={e => setBuscador(e.target.value)} />
          <select className="form-select form-select-sm" style={{ width: 160 }}
            value={filtro} onChange={e => setFiltro(e.target.value)}>
            <option value="recientes">Más recientes</option>
            <option value="antiguos">Más antiguos</option>
          </select>
        </div>
      </div>

      {/* ── Formulario colapsable ── */}
      {mostrarForm && (
        <div className="ds-filtros-panel mb-3" style={{ padding: 0 }}>
          <FormNotaDebito
            notaDebito={notaDebito}              setNotaDebito={setNotaDebito}
            productosSeleccionados={productosSeleccionados} setProductosSeleccionados={setProductosSeleccionados}
            formasPago={formasPago}              setFormasPago={setFormasPago}
            facturaSeleccionada={facturaSeleccionada} setFacturaSeleccionada={setFacturaSeleccionada}
            facturas={facturas}                  productos={productos}
            notaEditando={notaEditando}
            onSubmit={handleSubmit}
            onCancel={toggleForm}
          />
        </div>
      )}

      {/* ── Tabla ── */}
      <div className="ds-tabla-wrapper">
        <div className="table-responsive">
          <table className="ds-tabla table table-bordered">
            <thead>
              <tr>
                <th>Número</th>
                <th>Factura</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Motivo</th>
                <th className="text-end">Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr><td colSpan="8" className="ds-empty">No hay notas débito registradas</td></tr>
              ) : (
                filtrados.map(nota => (
                  <tr key={nota.id}>
                    <td><strong>{nota.numeroNota || nota.id}</strong></td>
                    <td><small>{nota.numeroFactura}</small></td>
                    <td>{nota.cliente?.nombre || "—"}</td>
                    <td><small>{new Date(nota.fechaElaboracion).toLocaleDateString("es-CO")}</small></td>
                    <td><small>{nota.motivoDIAN}</small></td>
                    <td className="text-end"><strong>${nota.totalNeto?.toLocaleString("es-CO") || "0"}</strong></td>
                    <td>
                      <span className={`ds-badge-dian ${nota.estado === "Enviada" ? "ds-badge-aceptado" : "ds-badge-pendiente"}`}>
                        {nota.estado || "Pendiente"}
                      </span>
                    </td>
                    <td>
                      <div className="ds-acciones">
                        <button className="ds-btn-accion ds-btn-pdf" onClick={() => console.log("PDF")}>PDF</button>
                        <button className="ds-btn-accion ds-btn-xml" onClick={() => descargarXML(nota)}>XML</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
