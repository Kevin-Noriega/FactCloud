import React, { useEffect, useState } from "react";
import { API_URL } from "../api/config";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editando, setEditando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    empresa: "",
    telefono: "",
    logoNegocio: "",
    nitNegocio: "",
    dvNitNegocio: "",
    direccionNegocio: "",
    ciudadNegocio: "",
    departamentoNegocio: "",
    correoNegocio: "",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); // o sessionStorage
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  useEffect(() => {
    fetchPerfil();
  },[]);

  async function fetchPerfil() {
    try {
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
      if (!usuarioGuardado) {
        throw new Error("No se encontró usuario autenticado");
      }

      const res = await fetch(`${API_URL}/Usuarios/${usuarioGuardado.id}`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const datos = await res.json();

      const usuarioNormalizado = {
        ...datos,
        nombre: `${datos.nombre || ""} ${datos.apellido || ""}`.trim(),
        email: datos.correo || "",
        empresa: datos.nombreNegocio || "",
        telefono: datos.telefono || "",
        tipoIdentificacion: datos.tipoIdentificacion ,
        logoNegocio: datos.logoNegocio || "",
        nitNegocio: datos.nitNegocio || "",
        dvNitNegocio: datos.dvNitNegocio || "",
        direccionNegocio: datos.direccionNegocio || "",
        tipoRegimen: datos.tipoRegimen || "",
        departamentoNegocio: datos.departamentoNegocio || "",
        ciudadNegocio: datos.ciudadNegocio || "",
        correoNegocio: datos.correoNegocio || "",
        estado: datos.estado,
      };

      setUsuario(usuarioNormalizado);
      setFormData({
        nombre: usuarioNormalizado.nombre,
        email: usuarioNormalizado.email,
        empresa: usuarioNormalizado.empresa,
        telefono: usuarioNormalizado.telefono,
        logoNegocio: usuarioNormalizado.logoNegocio,
        nitNegocio: usuarioNormalizado.nitNegocio,
        dvNitNegocio: usuarioNormalizado.dvNitNegocio,
        direccionNegocio: usuarioNormalizado.direccionNegocio,
        ciudadNegocio: usuarioNormalizado.ciudadNegocio,
        departamentoNegocio: usuarioNormalizado.departamentoNegocio,
        correoNegocio: usuarioNormalizado.correoNegocio,
      });

      setError(null);
    } catch (error) {
      setError(error.message || "Error al cargar perfil");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
      if (!usuarioGuardado) {
        alert("No se encontró usuario autenticado");
        return;
      }

      const [nombre, ...apellidoParts] = formData.nombre.split(" ");
      const apellido = apellidoParts.join(" ");

      const respuesta = await fetch(
        `${API_URL}/Usuarios/${usuarioGuardado.id}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            nombre: nombre,
            apellido: apellido,
            correo: formData.email,
            nombreNegocio: formData.empresa,
            telefono: formData.telefono,
            logoNegocio: formData.logoNegocio,
            nitNegocio: formData.nitNegocio,
            dvNitNegocio: formData.dvNitNegocio,
            direccionNegocio: formData.direccionNegocio,
            tipoRegimen: formData.tipoRegimen,
            departamentoNegocio: usuario.departamentoNegocio,
            ciudadNegocio: usuario.ciudadNegocio,
            correoNegocio: usuario.correoNegocio,
            estado: usuario.estado,
          }),
        }
      );

      if (!respuesta.ok) {
        const texto = await respuesta.text();
        throw new Error(texto);
      }

      setMensajeExito("Perfil actualizado correctamente");
      setEditando(false);
      await fetchPerfil();

      setTimeout(() => setMensajeExito(""), 3000);
    } catch (error) {
      alert("Error al actualizar perfil: " + error.message);
    }
  };

  const cancelarEdicion = () => {
    setFormData({
      nombre: usuario.nombre || "",
      email: usuario.email || "",
      empresa: usuario.empresa || "",
      telefono: usuario.telefono || "",
      logoNegocio: usuario.logoNegocio || "",
      nitNegocio: usuario.nitNegocio || "",
      dvNitNegocio: usuario.dvNitNegocio || "",
      direccionNegocio: usuario.direccionNegocio || "",
      tipoRegimen: usuario.tipoRegimen || "",
      ciudadNegocio: usuario.ciudadNegocio || "",
      departamentoNegocio: usuario.departamentoNegocio || "",
      correoNegocio: usuario.correoNegocio || "",
    });
    setEditando(false);
  };

  const LogoEmpresa = ({ url, nombreEmpresa, size = "100px" }) => {
    const [error, setError] = useState(false);

    useEffect(() => {
      if (url && url.trim() !== "") {
        const img = new Image();
        img.onload = () => setError(false);
        img.onerror = () => setError(true);
        img.src = url;
      } else {
        setError(true);
      }
    }, [url]);

    if (!url || error) {
      const iniciales = nombreEmpresa
        ? nombreEmpresa
            .split(" ")
            .map((word) => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
        : "FC";

      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #00a2ff, #025b8f)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: `calc(${size} / 2.5)`,
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          {iniciales}
        </div>
      );
    }

    return (
      <img
        src={url}
        alt={`Logo ${nombreEmpresa}`}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "3px solid #fff",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
        onError={() => setError(true)}
      />
    );
  };

  if (loading)
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Cargando perfil...</p>
      </div>
    );

  if (error)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h5>Error al cargar perfil</h5>
          <p>{error}</p>
          <button className="btn btn-primary mt-2" onClick={fetchPerfil}>
            Reintentar
          </button>
        </div>
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-4">Mi Perfil</h2>

      {mensajeExito && (
        <div
          className="alert alert-success d-flex justify-content-between align-items-center"
          role="alert"
        >
          <span>{mensajeExito}</span>
          <button
            className="btn-close"
            onClick={() => setMensajeExito("")}
          ></button>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-lg">
            {/* Header */}
            <div
              className="card-header text-white"
              style={{
                background: "linear-gradient(135deg, #00a2ff, #025b8f)",
                padding: "2rem",
              }}
            >
              <div className="d-flex align-items-center">
                <LogoEmpresa
                  url={usuario?.logoNegocio}
                  nombreEmpresa={usuario?.empresa}
                  size="100px"
                />
                <div className="ms-4">
                  <h3 className="mb-2">{usuario?.empresa || "Sin empresa"}</h3>
                  <p className="mb-2 opacity-75">{usuario?.nombre}</p>
                  <span
                    className={`badge ${
                      usuario?.estado ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {usuario?.estado ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="card-body p-4">
              {!editando ? (
                <div>
                  <h5 className="border-bottom pb-2 mb-3">
                    Información Personal
                  </h5>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="text-muted small">
                        Nombre Completo:
                      </label>
                      <p className="fw-bold">{usuario?.nombre || "N/A"}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small">
                        Correo Electrónico:
                      </label>
                      <p className="fw-bold">{usuario?.email || "N/A"}</p>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="text-muted small">Teléfono:</label>
                      <p className="fw-bold">{usuario?.telefono || "N/A"}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small">
                        Fecha de Registro:
                      </label>
                      <p className="fw-bold">
                        {usuario?.fechaRegistro
                          ? new Date(usuario.fechaRegistro).toLocaleDateString(
                              "es-CO"
                            )
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <h5 className="border-bottom pb-2 mb-3 mt-4">
                    Información de la Empresa
                  </h5>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="text-muted small">Empresa:</label>
                      <p className="fw-bold">{usuario?.empresa || "N/A"}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small">NIT:</label>
                      <p className="fw-bold">
                        {usuario?.nitNegocio
                          ? `${usuario.nitNegocio}${
                              usuario.dvNitNegocio
                                ? `-${usuario.dvNitNegocio}`
                                : ""
                            }`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="text-muted small">Dirección:</label>
                      <p className="fw-bold">
                        {usuario?.direccionNegocio || "N/A"}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small">
                        Telefono:
                      </label>
                      <p className="fw-bold">{usuario?.telefonoNegocio}</p>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="text-muted small">Ciudad:</label>
                      <p className="fw-bold">
                        {usuario?.ciudadNegocio
                          ? `${usuario.ciudadNegocio}${
                              usuario.departamentoNegocio
                                ? `, ${usuario.departamentoNegocio}`
                                : ""
                            }`
                          : "N/A"}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small">
                        Correo Electrónico:
                      </label>
                      <p className="fw-bold">
                        {usuario?.correoNegocio || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button
                      className="btn btn-primary"
                      onClick={() => setEditando(true)}
                    >
                      Editar Perfil
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h6 className="border-bottom pb-2 mb-3">
                    Editar Información
                  </h6>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Nombre Completo: *</label>
                      <input
                        type="text"
                        name="nombre"
                        className="form-control"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Correo Electrónico: *
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Teléfono:</label>
                      <input
                        type="text"
                        name="telefono"
                        className="form-control"
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="3001234567"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Empresa:</label>
                      <input
                        type="text"
                        name="empresa"
                        className="form-control"
                        value={formData.empresa}
                        onChange={handleChange}
                        placeholder="Mi Empresa S.A.S"
                      />
                    </div>
                  </div>

                  <h6 className="border-bottom pb-2 mb-3 mt-4">
                    Información de la Empresa
                  </h6>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">NIT:</label>
                      <input
                        type="text"
                        name="nitNegocio"
                        className="form-control"
                        value={formData.nitNegocio}
                        onChange={handleChange}
                        placeholder="900123456"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Tipo de Régimen:</label>
                      <select
                        name="tipoRegimen"
                        className="form-select"
                        value={formData.tipoRegimen}
                        onChange={handleChange}
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Simplificado">Simplificado</option>
                        <option value="Común">Común</option>
                        <option value="Gran Contribuyente">
                          Gran Contribuyente
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-12">
                      <label className="form-label">Dirección:</label>
                      <input
                        type="text"
                        name="direccionNegocio"
                        className="form-control"
                        value={formData.direccionNegocio}
                        onChange={handleChange}
                        placeholder="Calle 123 #45-67"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-12">
                      <label className="form-label">
                        Logo de la Empresa (URL):
                      </label>
                      <input
                        type="url"
                        name="logoNegocio"
                        className="form-control"
                        value={formData.logoNegocio}
                        onChange={handleChange}
                        placeholder="https://ejemplo.com/logo.png"
                      />
                      <small className="text-muted">
                        Ingresa la URL completa de tu logo
                      </small>

                      {formData.logoNegocio && (
                        <div className="mt-3">
                          <p className="small text-muted mb-2">Vista previa:</p>
                          <LogoEmpresa
                            url={formData.logoNegocio}
                            nombreEmpresa={formData.empresa}
                            size="80px"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={cancelarEdicion}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
