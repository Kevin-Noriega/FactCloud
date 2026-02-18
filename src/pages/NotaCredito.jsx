import React, { useState } from "react";
import "../styles/sharedPage.css";
import {useNotas} from "../hooks/useNotas";
import { ArrowCounterclockwise } from "react-bootstrap-icons";
function NotaCredito() {
  const {
    notasCredito,
    facturas,
    productos,
    loading,
    error,
    crearNotaCredito,
    actualizarNotaCredito,
  } = useNotas();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [notaEditando, setNotaEditando] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");
  const [buscador, setBuscador] = useState("");
  const [filtro, setFiltro] = useState("recientes");

  // Estados del formulario
  const [notaCredito, setNotaCredito] = useState({
    facturaId: "",
    tipo: "devolucion",
    motivoDIAN: "NC-1",
    fechaElaboracion: new Date().toISOString().split("T")[0],
    cufe: "",
    observaciones: "",
    retelCA: 0,
  });

  const [productosSeleccionados, setProductosSeleccionados] = useState([
    {
      productoId: "",
      cantidad: 1,
      precioUnitario: 0,
      porcentajeDescuento: 0,
      tarifaIVA: 19,
      tarifaINC: 0,
      descripcion: "",
      unidadMedida: "Unidad",
    },
  ]);

  const [formasPago, setFormasPago] = useState([{ metodo: "10", valor: 0 }]);

  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

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

  // Resetear formulario
  const resetearFormulario = () => {
    setNotaCredito({
      facturaId: "",
      tipo: "devolucion",
      motivoDIAN: "NC-1",
      fechaElaboracion: new Date().toISOString().split("T")[0],
      cufe: "",
      observaciones: "",
      retelCA: 0,
    });
    setProductosSeleccionados([
      {
        productoId: "",
        cantidad: 1,
        precioUnitario: 0,
        porcentajeDescuento: 0,
        tarifaIVA: 19,
        tarifaINC: 0,
        descripcion: "",
        unidadMedida: "Unidad",
      },
    ]);
    setFormasPago([{ metodo: "10", valor: 0 }]);
    setFacturaSeleccionada(null);
    setNotaEditando(null);
  };

  const toggleFormulario = () => {
    if (mostrarFormulario) {
      resetearFormulario();
    }
    setMostrarFormulario(!mostrarFormulario);
  };

  const calcularLinea = (item) => {
    const cantidad = parseFloat(item.cantidad) || 0;
    const precio = parseFloat(item.precioUnitario) || 0;
    const descuento = parseFloat(item.porcentajeDescuento) || 0;
    const tarifaIVA = parseFloat(item.tarifaIVA) || 0;
    const tarifaINC = parseFloat(item.tarifaINC) || 0;

    const subtotalLinea = cantidad * precio;
    const valorDescuento = subtotalLinea * (descuento / 100);
    const baseImponible = subtotalLinea - valorDescuento;
    const valorIVA = baseImponible * (tarifaIVA / 100);
    const valorINC = baseImponible * (tarifaINC / 100);
    const totalLinea = baseImponible + valorIVA + valorINC;

    return {
      subtotalLinea,
      valorDescuento,
      baseImponible,
      valorIVA,
      valorINC,
      totalLinea,
    };
  };

  const calcularTotales = () => {
    let totalBruto = 0;
    let totalDescuentos = 0;
    let subtotal = 0;
    let totalIVA = 0;
    let totalINC = 0;

    productosSeleccionados.forEach((item) => {
      const linea = calcularLinea(item);
      totalBruto += linea.subtotalLinea;
      totalDescuentos += linea.valorDescuento;
      subtotal += linea.baseImponible;
      totalIVA += linea.valorIVA;
      totalINC += linea.valorINC;
    });

    const retelCA = subtotal * (parseFloat(notaCredito.retelCA) / 100);
    const totalNeto = subtotal + totalIVA + totalINC - retelCA;

    return {
      totalBruto,
      totalDescuentos,
      subtotal,
      totalIVA,
      totalINC,
      retelCA,
      totalNeto,
    };
  };

  const calcularTotalFormasPago = () => {
    return formasPago.reduce(
      (total, forma) => total + parseFloat(forma.valor || 0),
      0,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!notaCredito.facturaId) {
      alert("Debes seleccionar una factura");
      return;
    }

    if (productosSeleccionados.length === 0) {
      alert("Debes agregar al menos un producto");
      return;
    }

    const productosSinID = productosSeleccionados.filter((p) => !p.productoId);
    if (productosSinID.length > 0) {
      alert("Todos los productos deben estar seleccionados");
      return;
    }

    const totales = calcularTotales();
    const totalFormasPago = calcularTotalFormasPago();

    if (Math.abs(totales.totalNeto - totalFormasPago) > 0.01) {
      const diferencia = totales.totalNeto - totalFormasPago;
      alert(
        `El total de formas de pago debe coincidir con el total neto.\n` +
          `Total Neto: $${totales.totalNeto.toFixed(2)}\n` +
          `Total Formas de Pago: $${totalFormasPago.toFixed(2)}\n` +
          `Diferencia: $${Math.abs(diferencia).toFixed(2)}`,
      );
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("usuario") || "{}");
      const usuarioId = user.id;
      if (!usuarioId) {
        alert("No se pudo obtener el ID del usuario.");
        return;
      }

      const payload = {
        usuarioId: usuarioId,
        facturaId: parseInt(notaCredito.facturaId),
        numeroNota: notaEditando?.numeroNota || `NC-${Date.now()}`,
        tipo: notaCredito.tipo,
        motivoDIAN: notaCredito.motivoDIAN,
        fechaElaboracion: notaCredito.fechaElaboracion,
        cufe: notaCredito.cufe || "",
        totalBruto: totales.totalBruto,
        totalDescuentos: totales.totalDescuentos,
        subtotal: totales.subtotal,
        totalIVA: totales.totalIVA,
        totalINC: totales.totalINC,
        retelCA: totales.retelCA,
        totalNeto: totales.totalNeto,
        observaciones: notaCredito.observaciones || "",
        estado: "Pendiente",
        detalleNotaCredito: productosSeleccionados.map((item) => {
          const linea = calcularLinea(item);
          return {
            productoId: parseInt(item.productoId),
            descripcion: item.descripcion || "",
            cantidad: parseFloat(item.cantidad),
            unidadMedida: item.unidadMedida || "Unidad",
            precioUnitario: parseFloat(item.precioUnitario),
            porcentajeDescuento: parseFloat(item.porcentajeDescuento) || 0,
            valorDescuento: linea.valorDescuento,
            subtotalLinea: linea.subtotalLinea,
            tarifaIVA: parseFloat(item.tarifaIVA),
            valorIVA: linea.valorIVA,
            tarifaINC: parseFloat(item.tarifaINC) || 0,
            valorINC: linea.valorINC,
            totalLinea: linea.totalLinea,
          };
        }),
        formasPago: formasPago.map((f) => ({
          metodo: f.metodo,
          valor: parseFloat(f.valor),
        })),
      };

      if (notaEditando) {
        await actualizarNotaCredito(notaEditando.id, payload);
        setMensajeExito("Nota crédito actualizada exitosamente");
      } else {
        await crearNotaCredito(payload);
        setMensajeExito("Nota crédito creada exitosamente");
      }

      setTimeout(() => setMensajeExito(""), 3000);
      resetearFormulario();
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar la nota crédito: " + error.message);
    }
  };

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
          <div className="spinner-border text-success" role="status"></div>
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
    <div className="container-fluid mt-4 px-4">
      <div className="header-card">
        <div className="header-content">
          <div className="header-text">
            <h2 className="header-title mb-4">Gestión Nota Crédito</h2>
            <p className="header-subtitle">
              Gestiona y controla tus notas crédito.
            </p>
          </div>
          <div className="header-icon">
            <ArrowCounterclockwise size={80} />
          </div>
        </div>
      </div>

      {mensajeExito && (
        <div className="alert alert-success alert-dismissible fade show">
          <span>{mensajeExito}</span>
          <button className="btn-close" onClick={() => setMensajeExito("")} />
        </div>
      )}

      <div className="nota-info mb-4">
        <p>
          <strong>Información importante:</strong> Las notas crédito son
          documentos que reducen el valor de una factura. Este proceso es
          irreversible una vez validado con la DIAN.
        </p>
      </div>

      <div className="opcions-header">
        <button
          className={`btn-crear ${mostrarFormulario ? "active" : ""}`}
          onClick={toggleFormulario}
          type="button"
        >
          {mostrarFormulario ? (
            <>
              <ChevronUp size={20} className="me-2" />
              Ocultar Formulario
            </>
          ) : (
            <>
              <ChevronDown size={20} className="me-2" />
              Nueva Nota Crédito
            </>
          )}
        </button>
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

      {/* FORMULARIO COLAPSABLE */}
      <div
        className={`formulario-nota-collapse ${mostrarFormulario ? "show" : ""}`}
      >
        <FormNotaCredito
          notaCredito={notaCredito}
          setNotaCredito={setNotaCredito}
          productosSeleccionados={productosSeleccionados}
          setProductosSeleccionados={setProductosSeleccionados}
          formasPago={formasPago}
          setFormasPago={setFormasPago}
          facturaSeleccionada={facturaSeleccionada}
          setFacturaSeleccionada={setFacturaSeleccionada}
          facturas={facturas}
          productos={productos}
          notaEditando={notaEditando}
          onSubmit={handleSubmit}
          onCancel={toggleFormulario}
        />
      </div>

      {/* TABLA DE NOTAS */}
      <div className="card mt-3">
        <div className="card-body">
          {filtrados.length === 0 ? (
            <div className="alert alert-info">
              No hay notas crédito registradas.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered">
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
                  {filtrados.map((nota) => (
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotaCredito;
