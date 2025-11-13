import React, { useEffect, useState } from "react";
import { API_URL } from "../api/config";
import ciudades from "./Ciudades.json";

const tiposDocumentoDIAN = [
  {  label: "Cédula de Ciudadanía" },
  { label: "NIT" },
  { label: "Cédula de Extranjería" },
  { label: "CE" },
  { label: "Pasaporte" },
];

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");
  const [clienteEliminado, setClienteEliminado] = useState(null);
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [clienteVer, setClienteVer] = useState(null);

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
    responsabilidadFiscal: "",
    retenedorIVA: false,
    retenedorICA: false,
    retenedorRenta: false,
    autoretenedorRenta: false,
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  async function fetchClientes() {
    try {
      const res = await fetch(`${API_URL}/Clientes`);
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

  const handleDepartamentoChange = (e) => {
    setCliente((prev) => ({
      ...prev,
      departamento: e.target.value,
      ciudad: "",
    }));
  };

  const limpiarFormulario = () => {
    setCliente({
      nombre: "",
      apellido: "",
      tipoIdentificacion: "13",
      numeroIdentificacion: "",
      digitoVerificacion: "",
      tipoPersona: "Natural",
      regimenTributario: "Simplificado",
      correo: "",
      telefono: "",
      departamento: "",
      ciudad: "",
      direccion: "",
      codigoPostal: "",
      responsabilidadFiscal: "",
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
        ...cliente,
        usuarioId: usuarioGuardado.id,
        digitoVerificacion: cliente.digitoVerificacion
          ? parseInt(cliente.digitoVerificacion)
          : null,
      };
      const url = clienteEditando
        ? `${API_URL}/Clientes/${clienteEditando}`
        : `${API_URL}/Clientes`;
      const method = clienteEditando ? "PUT" : "POST";
      const respuesta = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!respuesta.ok) {
        const texto = await respuesta.text();
        throw new Error(texto);
      }
      alert(
        clienteEditando
          ? "Cliente actualizado correctamente"
          : "Cliente agregado correctamente"
      );
      limpiarFormulario();
      fetchClientes();
    } catch (error) {
      alert("Error al guardar cliente: " + error.message);
    }
  };

  const editarCliente = (cli) => {
    setCliente({
      nombre: cli.nombre,
      apellido: cli.apellido,
      tipoIdentificacion: cli.tipoIdentificacion,
      numeroIdentificacion: cli.numeroIdentificacion,
      digitoVerificacion: cli.digitoVerificacion || "",
      tipoPersona: cli.tipoPersona,
      regimenTributario: cli.regimenTributario,
      correo: cli.correo,
      telefono: cli.telefono || "",
      departamento: cli.departamento,
      ciudad: cli.ciudad,
      direccion: cli.direccion,
      codigoPostal: cli.codigoPostal || "",
      responsabilidadFiscal: cli.responsabilidadFiscal || "",
      retenedorIVA: cli.retenedorIVA,
      retenedorICA: cli.retenedorICA,
      retenedorRenta: cli.retenedorRenta,
      autoretenedorRenta: cli.autoretenedorRenta,
    });
    setClienteEditando(cli.id);
    setMostrarFormulario(true);
  };

  const eliminarCliente = async (id) => {
    try {
      const cli = clientes.find((c) => c.id === id);
      const respuesta = await fetch(`${API_URL}/Clientes/${id}`, {
        method: "DELETE",
      });
      if (!respuesta.ok) throw new Error("Error al eliminar cliente");
      setMensajeExito("Cliente eliminado con éxito.");
      setClienteEliminado(cli);
      setMostrarInfo(false);
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
            {clienteEliminado && (
              <button
                className="btn btn-light btn-sm me-2"
                onClick={() => setMostrarInfo((x) => !x)}
              >
                {mostrarInfo ? "Ocultar info" : "Ver cliente"}
              </button>
            )}
            <button
              className="btn btn-close"
              onClick={() => {
                setMensajeExito("");
                setClienteEliminado(null);
                setMostrarInfo(false);
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
                    {clienteVer.tipoIdentificacion} -{" "}
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
      {mostrarInfo && clienteEliminado && (
        <pre className="bg-light p-3 rounded border text-dark">
          {JSON.stringify(clienteEliminado, null, 2)}
        </pre>
      )}
      <button
        className="btn btn-primary mb-4"
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
      >
        {mostrarFormulario ? "Ocultar Formulario" : "Nuevo Cliente"}
      </button>
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
      )}{" "}
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
      {mensajeExito && (
        <div
          className="alert alert-danger d-flex justify-content-between align-items-center"
          role="alert"
        >
          <span>{mensajeExito}</span>
          <div>
            {clienteEliminado && (
              <button
                className="btn btn-light btn-sm me-2"
                onClick={() => setMostrarInfo((x) => !x)}
              >
                {mostrarInfo ? "Ocultar info" : "Ver cliente"}
              </button>
            )}
            <button
              className="btn btn-close"
              onClick={() => {
                setMensajeExito("");
                setClienteEliminado(null);
                setMostrarInfo(false);
              }}
            ></button>
          </div>
        </div>
      )}
      {mostrarInfo && clienteEliminado && (
        <pre className="bg-light p-3 rounded border text-dark">
          {JSON.stringify(clienteEliminado, null, 2)}
        </pre>
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
                  <label className="form-label">Tipo de Persona</label>
                  <select
                    name="tipoPersona"
                    className="form-select"
                    value={cliente.tipoPersona}
                    onChange={handleChange}
                    required
                  >
                    <option value="Natural">Persona Natural</option>
                    <option value="Juridica">Persona Jurídica</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Tipo de Identificación</label>
                  <select
                    name="tipoIdentificacion"
                    className="form-select"
                    value={cliente.tipoIdentificacion}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar</option>
                    {tiposDocumentoDIAN.map((op) => (
                      <option key={op.codigo} value={op.codigo}>
                        {op.codigo} - {op.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Régimen Tributario</label>
                  <select
                    name="regimenTributario"
                    className="form-select"
                    value={cliente.regimenTributario}
                    onChange={handleChange}
                    required
                  >
                    <option value="Simplificado">Régimen Simplificado</option>
                    <option value="Comun">Régimen Común</option>
                    <option value="Gran Contribuyente">
                      Gran Contribuyente
                    </option>
                  </select>
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
                  <label className="form-label">Responsabilidad Fiscal</label>
                  <select
                    name="responsabilidadFiscal"
                    className="form-select"
                    value={cliente.responsabilidadFiscal}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar</option>
                    <option value="O-13">O-13 Gran Contribuyente</option>
                    <option value="O-15">O-15 Autoretenedor</option>
                    <option value="O-23">O-23 Agente de retención IVA</option>
                    <option value="R-99-PN">
                      R-99-PN No responsable de IVA
                    </option>
                  </select>
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
                  <select
                    name="departamento"
                    className="form-select"
                    value={cliente.departamento}
                    onChange={handleDepartamentoChange}
                    required
                  >
                    <option value="">Seleccionar departamento</option>
                    {Object.keys(ciudades).map((dep) => (
                      <option key={dep} value={dep}>
                        {dep}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Ciudad o Municipio</label>
                  <select
                    name="ciudad"
                    className="form-select"
                    value={cliente.ciudad}
                    onChange={handleChange}
                    required
                    disabled={!cliente.departamento}
                  >
                    <option value="">Seleccionar ciudad</option>
                    {(ciudades[cliente.departamento] || []).map((ciudad) => (
                      <option key={ciudad} value={ciudad}>
                        {ciudad}
                      </option>
                    ))}
                  </select>
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
          {clientes.length === 0 ? (
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
                  {clientes.map((cli) => (
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
