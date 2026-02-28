import React, { useState } from "react";
import { useNotas } from "../../../hooks/useNotas";

function NotaCredito() {
  const { notasCredito, loading, error } = useNotas();

  const [setMensajeExito] = useState("");
  const [buscador, setBuscador] = useState("");
  const [filtro, setFiltro] = useState("recientes");

  // Filtrar notas
  const filtrados = notasCredito
    .filter((nota) => {
      const query = buscador.trim().toLowerCase();
      return !query || nota.numeroNota?.toLowerCase().includes(query);
    })
    .sort((a, b) => {
      switch (filtro) {
        case "recientes":
          return new Date(b.fechaRegistro) - new Date(a.fechaRegistro);
        case "antiguos":
          return new Date(a.fechaRegistro) - new Date(b.fechaRegistro);
        default:
          return 0;
      }
    });

  const descargarXML = (nota) => {
    if (!nota.xmlBase64) {
      setMensajeExito("No hay XML generado para esta nota");
      setTimeout(() => setMensajeExito(""), 3000);
      return;
    }

    const xmlContent = atob(nota.xmlBase64);
    const blob = new Blob([xmlContent], { type: "text/xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `NotaCredito-${nota.numeroNota}.xml`;
    a.click();
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-error mt-5">
        <div className="alert alert-danger">
          <h5>Error al cargar datos</h5>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-2">
      <div className="opcions-header">
        <div className="filters">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por número de nota"
            value={buscador}
            onChange={(e) => setBuscador(e.target.value)}
          />
          <select
            className="form-select"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="recientes">Más recientes</option>
            <option value="antiguos">Más antiguos</option>
          </select>
        </div>
      </div>

      {/* TABLA DE NOTAS */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-header">
                <tr>
                  <th>Número</th>
                  <th>Factura</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Motivo</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-muted">
                      No hay notas crédito registradas
                    </td>
                  </tr>
                ) : (
                  filtrados.map((nota) => (
                    <tr key={nota.id}>
                      <td>
                        <strong>{nota.numeroNota || nota.id}</strong>
                      </td>
                      <td>{nota.numeroFactura}</td>
                      <td>{nota.cliente?.nombre || "N/A"}</td>
                      <td>
                        {new Date(nota.fechaElaboracion).toLocaleDateString(
                          "es-CO",
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            nota.tipo === "anulacion"
                              ? "bg-danger"
                              : nota.tipo === "devolucion"
                                ? "bg-warning text-dark"
                                : "bg-info"
                          }`}
                        >
                          {nota.tipo === "anulacion"
                            ? "Anulación"
                            : nota.tipo === "devolucion"
                              ? "Devolución"
                              : "Descuento"}
                        </span>
                      </td>
                      <td>{nota.motivoDIAN}</td>
                      <td className="text-end fw-bold text-success">
                        ${nota.totalNeto?.toLocaleString("es-CO") || "0"}
                      </td>
                      <td>
                        {nota.estado === "Enviada" ? (
                          <span className="badge bg-success">Enviada</span>
                        ) : (
                          <span className="badge bg-warning text-dark">
                            Pendiente
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-1"
                          onClick={() => console.log("Ver PDF")}
                        >
                          PDF
                        </button>
                        <button
                          className="btn btn-sm btn-danger me-1"
                          onClick={() => descargarXML(nota)}
                        >
                          XML
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default NotaCredito;
