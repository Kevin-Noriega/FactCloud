import React, { useEffect, useState } from "react";
import { API_URL } from "../api/config";
import tipoIdentificacion from "../utils/TiposDocumentos.json";
import Select from "react-select";
import actividadesCIIU from "../utils/ActividadesEconomicasCIIU.json";
import regimenTributarioDIAN from "../utils/RegimenTributario.json";
import regimenFiscalDIAN from "../utils/RegimenFiscal.json";
import {
  obtenerSiglas,
  departamentosOptions,
  ciudadesOptionsPorDepartamento,
} from "../utils/Helpers";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");
    const [buscador, setBuscador] = useState("");
  const [, setClienteEliminado] = useState(null);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [clienteVer, setClienteVer] = useState(null);
    const [filtro, setFiltro] = useState("recientes");

const filtrados = clientes
    .filter((cli) => {
      const query = buscador.trim().toLowerCase();
      return (
        !query ||
        cli.nombre?.toLowerCase().includes(query) ||
        cli.numeroIdentificacion?.toLowerCase().includes(query)
      );
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
  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    tipoIdentificacion: "",
    numeroIdentificacion: "",
    digitoVerificacion: "",
    tipoPersona: "",
    regimenTributario: "",
    correo: "",
    telefono: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    codigoPostal: "",
    regimenFiscal: "",
    retenedorIVA: false,
    retenedorICA: false,
    retenedorRenta: false,
    autoretenedorRenta: false,
    estado: true,
    ciudadCodigo: "",
    departamentoCodigo: "",
    pais: "CO",
    nombreComercial: "",
    actividadEconomicaCIIU: "",
  });
  useEffect(() => {
    fetchClientes();
  }, []);

  async function fetchClientes() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/Clientes`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const datos = await res.json();
      setClientes(datos);
      setError(null);
    } catch (error) {
      setError(error.message || "Error desconocido al cargar clientes");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCliente((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const limpiarFormulario = () => {
    setCliente({
      nombre: "",
      apellido: "",
      tipoIdentificacion: "",
      numeroIdentificacion: "",
      digitoVerificacion: "",
      tipoPersona: "",
      regimenTributario: "",
      regimenFiscal: "",
      correo: "",
      telefono: "",
      departamento: "",
      ciudad: "",
      ciudadCodigo: "",
      departamentoCodigo: "",
      direccion: "",
      codigoPostal: "",

      retenedorIVA: false,
      retenedorICA: false,
      retenedorRenta: false,
      autoretenedorRenta: false,
    });
    setClienteEditando(null);
    setMostrarFormulario(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
      if (!usuarioGuardado) {
        alert("No se encontró un usuario autenticado.");
        return;
      }

      const payload = {
        ...(clienteEditando && { id: clienteEditando }), // <— SOLO en modo edición
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        tipoIdentificacion: cliente.tipoIdentificacion,
        numeroIdentificacion: cliente.numeroIdentificacion,
        digitoVerificacion: cliente.digitoVerificacion || null,
        tipoPersona: cliente.tipoPersona,
        regimenTributario: cliente.regimenTributario,
        regimenFiscal: cliente.regimenFiscal,
        correo: cliente.correo,
        telefono: cliente.telefono || "",
        departamento: cliente.departamento,
        ciudad: cliente.ciudad,
        direccion: cliente.direccion,
        codigoPostal: cliente.codigoPostal || "",
        retenedorIVA: !!cliente.retenedorIVA,
        retenedorICA: !!cliente.retenedorICA,
        retenedorRenta: !!cliente.retenedorRenta,
        autoretenedorRenta: !!cliente.autoretenedorRenta,
        estado: cliente.estado ?? true,
        ciudadCodigo: cliente.ciudadCodigo || "",
        departamentoCodigo: cliente.departamentoCodigo || "",
        pais: cliente.pais || "CO",
        nombreComercial: cliente.nombreComercial || "",
        actividadEconomicaCIIU: cliente.actividadEconomicaCIIU || "",
        usuarioId: usuarioGuardado.id,
      };

      const token = localStorage.getItem("token");

      const url = clienteEditando
        ? `${API_URL}/Clientes/${clienteEditando}`
        : `${API_URL}/Clientes`;
      const method = clienteEditando ? "PUT" : "POST";

      const respuesta = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!respuesta.ok) {
        const texto = await respuesta.text();
        throw new Error(texto);
      }
      setMensajeExito(
        clienteEditando
          ? "Cliente modificado con éxito."
          : "Cliente agregado con éxito."
      );

      setTimeout(() => setMensajeExito(""), 3000);
      limpiarFormulario();
      fetchClientes();
    } catch (error) {
      alert("Error al guardar cliente: " + error.message);
    }
  };

  const editarCliente = (cli) => {
    const { id, ...resto } = cli;

    setCliente({
      ...resto,
    });

    setClienteEditando(id);
    setMostrarFormulario(true);
  };

  const eliminarCliente = async (id) => {
    try {
      const cli = clientes.find((c) => c.id === id);
      const token = localStorage.getItem("token");
      const respuesta = await fetch(`${API_URL}/Clientes/desactivar/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!respuesta.ok) throw new Error("Error al eliminar cliente");

      setMensajeExito("Cliente eliminado con éxito.");
      setTimeout(() => setMensajeExito(""), 3000);

      setClienteEliminado(cli);

      fetchClientes();
    } catch {
      setMensajeExito("");
      alert("Error al eliminar cliente");
    }
    setClienteAEliminar(null);
  };

  if (loading)
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Cargando clientes...</p>
      </div>
    );

  if (error)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h5>Error al cargar clientes</h5>
          <p>{error}</p>
          <button className="btn btn-primary mt-2" onClick={fetchClientes}>
            Reintentar
          </button>
        </div>
      </div>
    );

  return (
    <div className="container-fluid mt-4 px-4">
      <h2 className="text-primary mb-4">Gestión de Clientes</h2>
      {mensajeExito && (
        <div
          className="alert alert-danger d-flex justify-content-between align-items-center"
          role="alert"
        >
          <span>{mensajeExito}</span>
          <div>
            
            <button
              className="btn btn-close"
              onClick={() => {
                setMensajeExito("");
                setClienteEliminado(null);
              }}
            ></button>
          </div>
        </div>
      )}
      {clienteVer && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              minWidth: 340,
              maxWidth: 480,
              boxShadow: "0 2px 32px #0007",
              padding: 30,
              position: "relative",
            }}
          >
            <button
              className="btn-close position-absolute top-0 end-0 mt-2 me-2"
              onClick={() => setClienteVer(null)}
            />
            <h5 className="mb-3">Información del Cliente</h5>
            <table className="table mb-0">
              <tbody>
                <tr>
                  <th>Nombre</th>
                  <td>
                    {clienteVer.nombre} {clienteVer.apellido}
                  </td>
                </tr>
                <tr>
                  <th>Identificación</th>
                  <td>
                    {obtenerSiglas(clienteVer.tipoIdentificacion)} -{" "}
                    {clienteVer.numeroIdentificacion}
                  </td>
                </tr>
                <tr>
                  <th>Correo</th>
                  <td>{clienteVer.correo}</td>
                </tr>
                <tr>
                  <th>Teléfono</th>
                  <td>{clienteVer.telefono}</td>
                </tr>
                <tr>
                  <th>Departamento</th>
                  <td>{clienteVer.departamento}</td>
                </tr>
                <tr>
                  <th>Ciudad</th>
                  <td>{clienteVer.ciudad}</td>
                </tr>
                <tr>
                  <th>Dirección</th>
                  <td>{clienteVer.direccion}</td>
                </tr>
                <tr>
                  <th>Código Postal</th>
                  <td>{clienteVer.codigoPostal}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="d-flex justify-content-between align-items-center mb-3">
      <button
        className="btn btn-primary "
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
      >
        {mostrarFormulario ? "Ocultar Formulario" : "Nuevo Cliente"}
      </button>
      <div className="d-flex" style={{ gap: "20px", width: "40%" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o ID"
            value={buscador}
            onChange={(e) => setBuscador(e.target.value)}
            style={{ flexGrow: 1 }}
          />
           <select
            className="form-select"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{ width: "148px" }}
          >
            <option value="recientes">Más recientes</option>
            <option value="antiguos">Más antiguos</option>
          </select>
          </div>
          </div>
      {clienteAEliminar && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1055,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 32,
              minWidth: 320,
              boxShadow: "0 2px 20px #3336",
            }}
          >
            <h5 className="mb-3">¿Está seguro de eliminar este cliente?</h5>
            <div className="d-flex gap-2 justify-content-end">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setClienteAEliminar(null)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                onClick={() => eliminarCliente(clienteAEliminar)}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {mostrarFormulario && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <h6 className="border-bottom pb-2 mb-3">
                Información de Identificación
              </h6>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Tipo de contribuyente</label>
                  <select
                    name="tipoPersona"
                    className="form-select"
                    value={cliente.tipoPersona}
                    onChange={handleChange}
                    required
                  >
                     <option value="">Seleccionar</option>
                    <option value="Juridica">1 - Persona Jurídica y asimilidas</option>
                    <option value="Natural">2 - Persona Natural y asimiladas</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Tipo de Identificación</label>
                  <Select
                    name="tipoIdentificacion"
                    options={tipoIdentificacion.map((ti) => ({
                      value: ti.nombre,
                      label: `${ti.codigo} - ${ti.nombre}`,
                    }))}
                    value={
                      cliente.tipoIdentificacion
                        ? tipoIdentificacion
                            .map((ti) => ({
                              value: ti.nombre,
                              label: `${ti.codigo} - ${ti.nombre}`,
                            }))
                            .find(
                              (opt) => opt.value === cliente.tipoIdentificacion
                            )
                        : null
                    }
                    onChange={(opt) =>
                      setCliente((prev) => ({
                        ...prev,
                        tipoIdentificacion: opt ? opt.value : "",
                        tipoIdentificacionNombre: opt ? opt.nombre : "",
                      }))
                    }
                    isClearable
                    placeholder="Seleccionar tipo de identificacion"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Responsabilidad tributaria</label>

                  <Select
                    name="regimenTributario"
                    options={regimenTributarioDIAN.map((rt) => ({
                      value: rt.descripcion,
                      label: `${rt.codigo} - ${rt.descripcion}`,
                    }))}
                    value={
                      cliente.regimenTributario
                        ? regimenTributarioDIAN
                            .map((rt) => ({
                              value: rt.descripcion,
                              label: `${rt.codigo} - ${rt.descripcion}`,
                            }))
                            .find(
                              (opt) => opt.value === cliente.regimenTributario
                            )
                        : null
                    }
                    onChange={(opt) =>
                      setCliente((prev) => ({
                        ...prev,
                        regimenTributario: opt ? opt.value : "",
                      }))
                    }
                    isClearable
                    placeholder="Seleccionar Regimen tributario"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Número de Identificación</label>
                  <input
                    type="text"
                    name="numeroIdentificacion"
                    className="form-control"
                    value={cliente.numeroIdentificacion}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Dígito Verificación</label>
                  <input
                    type="number"
                    name="digitoVerificacion"
                    className="form-control"
                    value={cliente.digitoVerificacion}
                    onChange={handleChange}
                    min="0"
                    max="9"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Tipo de responsabilidad</label>
                  <Select
                    name="regimenFiscal"
                    options={regimenFiscalDIAN.map((rf) => ({
                      value: rf.descripcion,
                      label: `${rf.codigo} - ${rf.descripcion}`,
                    }))}
                    value={
                      cliente.regimenFiscal
                        ? regimenFiscalDIAN
                            .map((rf) => ({
                              value: rf.descripcion,
                              label: `${rf.codigo} - ${rf.descripcion}`,
                            }))
                            .find((opt) => opt.value === cliente.regimenFiscal)
                        : null
                    }
                    onChange={(opt) =>
                      setCliente((prev) => ({
                        ...prev,
                        regimenFiscal: opt ? opt.value : "",
                      }))
                    }
                    isClearable
                    placeholder="Seleccionar Regimen fiscal"
                  />
                </div>
              </div>
              <h6 className="border-bottom pb-2 mb-3 mt-4">
                Datos comerciales
              </h6>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre Comercial</label>
                  <input
                    type="text"
                    name="nombreComercial"
                    className="form-control"
                    value={cliente.nombreComercial}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Actividad Económica CIIU</label>
                  <Select
                    name="actividadEconomicaCIIU"
                    options={actividadesCIIU.map((act) => ({
                      value: act.codigo,
                      label: `${act.codigo} - ${act.descripcion}`,
                    }))}
                    value={
                      cliente.actividadEconomicaCIIU
                        ? actividadesCIIU
                            .map((act) => ({
                              value: act.codigo,
                              label: `${act.codigo} - ${act.descripcion}`,
                            }))
                            .find(
                              (opt) =>
                                opt.value === cliente.actividadEconomicaCIIU
                            )
                        : null
                    }
                    onChange={(opt) =>
                      setCliente((prev) => ({
                        ...prev,
                        actividadEconomicaCIIU: opt ? opt.value : "",
                      }))
                    }
                    isClearable
                    placeholder="Seleccionar actividad CIIU"
                  />
                </div>
              </div>

              <h6 className="border-bottom pb-2 mb-3 mt-4">
                Información Personal
              </h6>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre o Razón Social</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={cliente.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    className="form-control"
                    value={cliente.apellido}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <h6 className="border-bottom pb-2 mb-3 mt-4">
                Información de Contacto
              </h6>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    name="correo"
                    className="form-control"
                    value={cliente.correo}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    className="form-control"
                    value={cliente.telefono}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <h6 className="border-bottom pb-2 mb-3 mt-4">
                Información de Ubicación
              </h6>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Departamento</label>
                  <Select
                    name="departamento"
                    options={departamentosOptions}
                    value={
                      cliente.departamentoCodigo
                        ? departamentosOptions.find(
                            (opt) =>
                              String(opt.departamentoCodigo) ===
                              String(cliente.departamentoCodigo)
                          ) || null
                        : null
                    }
                    onChange={(opt) =>
                      setCliente((prev) => ({
                        ...prev,
                        departamento: opt ? opt.value : "",
                        departamentoCodigo: opt ? opt.departamentoCodigo : "",
                        ciudad: "",
                        ciudadCodigo: "",
                      }))
                    }
                    placeholder="Seleccionar departamento"
                    isClearable
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Ciudad o Municipio</label>
                  <Select
                    name="ciudad"
                    options={ciudadesOptionsPorDepartamento(
                      cliente.departamento
                    )}
                    value={
                      cliente.ciudadCodigo
                        ? ciudadesOptionsPorDepartamento(
                            cliente.departamento
                          ).find(
                            (opt) =>
                              String(opt.ciudadCodigo) ===
                              String(cliente.ciudadCodigo)
                          ) || null
                        : null
                    }
                    onChange={(opt) =>
                      setCliente((prev) => ({
                        ...prev,
                        ciudad: opt ? opt.value : "",
                        ciudadCodigo: opt ? opt.ciudadCodigo : "",
                      }))
                    }
                    placeholder="Seleccionar ciudad"
                    isClearable
                    isDisabled={!cliente.departamento}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-10">
                  <label className="form-label">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    className="form-control"
                    value={cliente.direccion}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Código Postal</label>
                  <input
                    type="text"
                    name="codigoPostal"
                    className="form-control"
                    value={cliente.codigoPostal}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <h6 className="border-bottom pb-2 mb-3 mt-4">Retenciones</h6>
              <div className="row mb-3">
                <div className="col-md-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="retenedorIVA"
                      className="form-check-input"
                      checked={cliente.retenedorIVA}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Retenedor de IVA</label>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="retenedorRenta"
                      className="form-check-input"
                      checked={cliente.retenedorRenta}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">
                      Retenedor de Renta
                    </label>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="autoretenedorRenta"
                      className="form-check-input"
                      checked={cliente.autoretenedorRenta}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Autoretenedor</label>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="retenedorICA"
                      className="form-check-input"
                      checked={cliente.retenedorICA}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Retenedor de ICA</label>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={limpiarFormulario}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {clienteEditando ? "Actualizar Cliente" : "Guardar Cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="card">
        <div className="card-body">
          {filtrados.length === 0 ? (
            <div className="alert alert-info">No hay clientes registrados.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Identificación</th>
                    <th>Tipo</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((cli) => (
                    <tr key={cli.id}>
                      <td>{cli.id}</td>
                      <td>
                        {cli.nombre} {cli.apellido}
                      </td>
                      <td>{cli.numeroIdentificacion}</td>
                      <td>{cli.tipoPersona}</td>
                      <td>{cli.correo}</td>
                      <td>{cli.telefono || "N/A"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-secondary color-gray me-2"
                          onClick={() => setClienteVer(cli)}
                        >
                          ver
                        </button>
                        <button
                          className="btn btn-sm btn-info me-2 text-white"
                          onClick={() => editarCliente(cli)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => setClienteAEliminar(cli.id)}
                        >
                          Eliminar
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

export default Clientes;
