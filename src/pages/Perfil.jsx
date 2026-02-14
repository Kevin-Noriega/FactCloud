import { useEffect, useState } from "react";
import { useUsuarios } from "../hooks/useUsuarios";
import ModalPerfilDesactivar from "../components/dashboard/ModalPerfilDesactivar";
import {
  ToggleOn,
  ToggleOff,
  ExclamationTriangleFill,
  PersonCircle,
  EnvelopeFill,
  TelephoneFill,
  CalendarEventFill,
  BuildingFill,
  GeoAltFill,
  CreditCard2BackFill,
  PencilSquare,
  CheckCircleFill,
  ClockHistory,
} from "react-bootstrap-icons";
import "../styles/Perfil.css";
import ModalCambiarContraseña from "../components/perfil/ModalCambiarContraseña";
import ModalHistorialSesiones from "../components/perfil/ModalHistorialSesiones";

function Perfil() {
  const [editando, setEditando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showCambiarContrasena, setShowCambiarContrasena] = useState(false);
  const [showHistorialSesiones, setShowHistorialSesiones] = useState(false);

  const {
    data: usuario,
    isLoading,
    error,
    refetch,
    actualizarPerfil,
    actualizarPerfilLoading,
    cambiarEstado,
    cambiarEstadoLoading,
  } = useUsuarios();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    nombreNegocio: "",
    nitNegocio: "",
    dvNitNegocio: "",
    direccionNegocio: "",
    regimenFiscal: "",
    ciudadNegocio: "",
    departamentoNegocio: "",
    correoNegocio: "",
    telefonoNegocio: "",
  });

  useEffect(() => {
    if (usuario) {
      setIsOnline(usuario.usuario?.estado ?? usuario.estado ?? true);

      setFormData({
        nombre: usuario.usuario?.nombre || usuario.nombre || "",
        apellido: usuario.usuario?.apellido || usuario.apellido || "",
        correo: usuario.usuario?.correo || usuario.correo || "",
        telefono: usuario.usuario?.telefono || usuario.telefono || "",
        nombreNegocio:
          usuario.negocio?.nombreNegocio || usuario.nombreNegocio || "",
        nitNegocio: usuario.negocio?.nit || usuario.nitNegocio || "",
        dvNitNegocio: usuario.negocio?.dvNit || usuario.dvNitNegocio || "",
        direccionNegocio:
          usuario.negocio?.direccion || usuario.direccionNegocio || "",
        regimenFiscal:
          usuario.negocio?.regimenFiscal || usuario.regimenFiscal || "",
        ciudadNegocio: usuario.negocio?.ciudad || usuario.ciudadNegocio || "",
        departamentoNegocio:
          usuario.negocio?.departamento || usuario.departamentoNegocio || "",
        correoNegocio: usuario.negocio?.correo || usuario.correoNegocio || "",
        telefonoNegocio:
          usuario.negocio?.telefono || usuario.telefonoNegocio || "",
      });
    }
  }, [usuario]);

  const handleToggleClick = () => {
    if (isOnline) {
      setShowConfirmModal(true);
    } else {
      handleCambiarEstado(true);
    }
  };

  const handleCambiarEstado = async (activar = false) => {
    try {
      await cambiarEstado(activar);
      setIsOnline(activar);
      setMensajeExito(
        activar ? "Cuenta activada correctamente" : "Cuenta desactivada",
      );
      setShowConfirmModal(false);
      setTimeout(() => setMensajeExito(""), 3000);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const calcularDiasRestantes = () => {
    if (!usuario?.usuario?.fechaDesactivacion && !usuario?.fechaDesactivacion)
      return null;

    const fechaDesactivacion = new Date(
      usuario.usuario?.fechaDesactivacion || usuario.fechaDesactivacion,
    );
    const fechaEliminacion = new Date(fechaDesactivacion);
    fechaEliminacion.setDate(fechaEliminacion.getDate() + 29);

    const ahora = new Date();
    const diferencia = fechaEliminacion - ahora;
    const diasRestantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24));

    return diasRestantes > 0 ? diasRestantes : 0;
  };

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
      await actualizarPerfil(formData);

      setMensajeExito("Perfil actualizado correctamente");
      setEditando(false);
      setTimeout(() => setMensajeExito(""), 3000);
    } catch (error) {
      console.error("Error actualizar:", error);
      alert("Error al actualizar perfil: " + error.message);
    }
  };

  const cancelarEdicion = () => {
    if (usuario) {
      setFormData({
        nombre: usuario.usuario?.nombre || usuario.nombre || "",
        apellido: usuario.usuario?.apellido || usuario.apellido || "",
        correo: usuario.usuario?.correo || usuario.correo || "",
        telefono: usuario.usuario?.telefono || usuario.telefono || "",
        nombreNegocio: usuario.negocio?.nombreNegocio || "",
        nitNegocio: usuario.negocio?.nit || "",
        dvNitNegocio: usuario.negocio?.dvNit || "",
        direccionNegocio: usuario.negocio?.direccion || "",
        regimenFiscal: usuario.negocio?.regimenFiscal || "",
        ciudadNegocio: usuario.negocio?.ciudad || "",
        departamentoNegocio: usuario.negocio?.departamento || "",
        correoNegocio: usuario.negocio?.correo || "",
        telefonoNegocio: usuario.negocio?.telefono || "",
      });
    }
    setEditando(false);
  };

  const LogoEmpresa = ({ url, nombreEmpresa, size = "120px" }) => {
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
      if (url && url.trim() !== "") {
        const img = new Image();
        img.onload = () => setImgError(false);
        img.onerror = () => setImgError(true);
        img.src = url;
      } else {
        setImgError(true);
      }
    }, [url]);

    if (!url || imgError) {
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
          className="logo-placeholder"
          style={{
            width: size,
            height: size,
            fontSize: `calc(${size} / 2.5)`,
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
        className="logo-image"
        style={{
          width: size,
          height: size,
        }}
        onError={() => setImgError(true)}
      />
    );
  };

  if (isLoading)
    return (
      <div className="loading-container">
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="loading-text">Cargando perfil...</p>
      </div>
    );

  if (error)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger shadow-sm">
          <h5 className="alert-heading">
            <ExclamationTriangleFill className="me-2" />
            Error al cargar perfil
          </h5>
          <p className="mb-3">{error.message}</p>
          <button className="btn btn-primary" onClick={() => refetch()}>
            Reintentar
          </button>
        </div>
      </div>
    );

  if (!usuario) return null;

  const diasRestantes = calcularDiasRestantes();

  return (
    <div className="perfil-container">
      <nav aria-label="breadcrumb" className="breadcrumb-perfil">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/dashboard">Inicio</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Mi Perfil
          </li>
        </ol>
      </nav>

      {mensajeExito && (
        <div
          className={`alert-perfil ${!isOnline ? "alert-warning-perfil" : "alert-success-perfil"}`}
        >
          <CheckCircleFill size={20} className="me-2" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {!isOnline && diasRestantes !== null && (
        <div className="alert-deactivated-perfil">
          <div className="alert-icon-wrapper-perfil">
            <ClockHistory size={32} />
          </div>
          <div className="alert-content-perfil">
            <h4 className="alert-title-perfil">Cuenta Desactivada</h4>
            <p className="alert-message-perfil">
              Tu cuenta será eliminada permanentemente en{" "}
              <strong>
                {diasRestantes} {diasRestantes === 1 ? "día" : "días"}
              </strong>
              .
              <br />
              Puedes reactivarla en cualquier momento antes de que expire el
              plazo.
            </p>
          </div>
          <button
            className="btn-reactivate-perfil"
            onClick={() => handleCambiarEstado(true)}
          >
            Reactivar Ahora
          </button>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="perfil-card">
            <div
              className={`perfil-card-header ${!isOnline ? "inactive" : ""}`}
            >
              <div className="d-flex align-items-center justify-content-between w-100">
                <div className="d-flex align-items-center gap-4">
                  <div className="logo-wrapper">
                    <LogoEmpresa
                      url={
                        usuario?.negocio?.logoNegocio || usuario?.logoNegocio
                      }
                      nombreEmpresa={
                        usuario?.negocio?.nombreNegocio ||
                        usuario?.nombreNegocio ||
                        "Sin empresa"
                      }
                      size="120px"
                    />
                    <div
                      className={`status-indicator-dot ${isOnline ? "online" : "offline"}`}
                    ></div>
                  </div>
                  <div>
                    <h2 className="empresa-title">
                      {usuario?.negocio?.nombreNegocio ||
                        usuario?.nombreNegocio ||
                        "Sin empresa"}
                    </h2>
                    <p className="usuario-subtitle">
                      {usuario?.nombreCompleto || "Usuario"}
                    </p>
                    <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                      <span
                        className={`status-pill ${isOnline ? "online" : "offline"}`}
                      >
                        <span className="status-dot"></span>
                        {isOnline ? "Activo" : "Inactivo"}
                      </span>
                      {usuario?.negocio?.regimenFiscal && (
                        <span className="regimen-pill">
                          {usuario.negocio.regimenFiscal}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="perfil-card-body">
              {!editando ? (
                <>
                  <div className="info-section">
                    <div className="section-header-perfil">
                      <h3 className="section-title">Información Personal</h3>
                      <button
                        className="btn-icon-edit"
                        onClick={() => setEditando(true)}
                      >
                        <PencilSquare size={18} />
                      </button>
                    </div>
                    <div className="info-grid">
                      <div className="info-item">
                        <div className="info-icon">
                          <PersonCircle size={20} />
                        </div>
                        <div>
                          <span className="info-label">Nombre Completo</span>
                          <p className="info-value">
                            {usuario?.nombreCompleto || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-icon">
                          <EnvelopeFill size={20} />
                        </div>
                        <div>
                          <span className="info-label">Correo Electrónico</span>
                          <p className="info-value">
                            {usuario?.usuario?.correo ||
                              usuario?.correo ||
                              "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-icon">
                          <TelephoneFill size={20} />
                        </div>
                        <div>
                          <span className="info-label">Teléfono</span>
                          <p className="info-value">
                            {usuario?.usuario?.telefono ||
                              usuario?.telefono ||
                              "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-icon">
                          <CalendarEventFill size={20} />
                        </div>
                        <div>
                          <span className="info-label">Fecha de Registro</span>
                          <p className="info-value">
                            {usuario?.usuario?.fechaRegistro ||
                            usuario?.fechaRegistro
                              ? new Date(
                                  usuario.usuario?.fechaRegistro ||
                                    usuario.fechaRegistro,
                                ).toLocaleDateString("es-CO", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="section-divider"></div>

                  <div className="info-section">
                    <div className="section-header-perfil">
                      <h3 className="section-title">Información Empresarial</h3>
                    </div>
                    <div className="info-grid">
                      <div className="info-item">
                        <div className="info-icon">
                          <BuildingFill size={20} />
                        </div>
                        <div>
                          <span className="info-label">Razón Social</span>
                          <p className="info-value">
                            {usuario?.negocio?.nombreNegocio || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-icon">
                          <CreditCard2BackFill size={20} />
                        </div>
                        <div>
                          <span className="info-label">NIT</span>
                          <p className="info-value">
                            {usuario?.negocio?.nit
                              ? `${usuario.negocio.nit}${
                                  usuario.negocio.dvNit
                                    ? `-${usuario.negocio.dvNit}`
                                    : ""
                                }`
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-icon">
                          <GeoAltFill size={20} />
                        </div>
                        <div>
                          <span className="info-label">Dirección</span>
                          <p className="info-value">
                            {usuario?.negocio?.direccion || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-icon">
                          <GeoAltFill size={20} />
                        </div>
                        <div>
                          <span className="info-label">Ciudad</span>
                          <p className="info-value">
                            {usuario?.negocio?.ciudad
                              ? `${usuario.negocio.ciudad}${
                                  usuario.negocio.departamento
                                    ? `, ${usuario.negocio.departamento}`
                                    : ""
                                }`
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-icon">
                          <TelephoneFill size={20} />
                        </div>
                        <div>
                          <span className="info-label">Teléfono Empresa</span>
                          <p className="info-value">
                            {usuario?.negocio?.telefono || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-icon">
                          <EnvelopeFill size={20} />
                        </div>
                        <div>
                          <span className="info-label">Correo Empresa</span>
                          <p className="info-value">
                            {usuario?.negocio?.correo || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <form onSubmit={handleSubmit} className="form-edit">
                  <div className="section-header-perfil mb-4">
                    <h3 className="section-title">
                      <PencilSquare className="me-2" />
                      Editar Información
                    </h3>
                  </div>

                  <div className="form-section">
                    <h4 className="form-section-title">Datos Personales</h4>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label-perfil">Nombre *</label>
                        <input
                          type="text"
                          name="nombre"
                          className="form-control-perfil"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label-perfil">Apellido</label>
                        <input
                          type="text"
                          name="apellido"
                          className="form-control-perfil"
                          value={formData.apellido}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label-perfil">
                          Correo Electrónico *
                        </label>
                        <input
                          type="email"
                          name="correo"
                          className="form-control-perfil"
                          value={formData.correo}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label-perfil">Teléfono</label>
                        <input
                          type="text"
                          name="telefono"
                          className="form-control-perfil"
                          value={formData.telefono}
                          onChange={handleChange}
                          placeholder="3001234567"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4 className="form-section-title">
                      Información Empresarial
                    </h4>
                    <div className="row g-3">
                      <div className="col-md-12">
                        <label className="form-label-perfil">
                          Nombre de la Empresa
                        </label>
                        <input
                          type="text"
                          name="nombreNegocio"
                          className="form-control-perfil"
                          value={formData.nombreNegocio}
                          onChange={handleChange}
                          placeholder="Mi Empresa S.A.S"
                        />
                      </div>
                      <div className="col-md-5">
                        <label className="form-label-perfil">NIT</label>
                        <input
                          type="text"
                          name="nitNegocio"
                          className="form-control-perfil"
                          value={formData.nitNegocio}
                          onChange={handleChange}
                          placeholder="900123456"
                        />
                      </div>
                      <div className="col-md-1">
                        <label className="form-label-perfil">DV</label>
                        <input
                          type="text"
                          name="dvNitNegocio"
                          className="form-control-perfil"
                          value={formData.dvNitNegocio}
                          onChange={handleChange}
                          placeholder="1"
                          maxLength="1"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label-perfil">
                          Régimen Fiscal
                        </label>
                        <select
                          name="regimenFiscal"
                          className="form-select-perfil"
                          value={formData.regimenFiscal}
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
                      <div className="col-12">
                        <label className="form-label-perfil">Dirección</label>
                        <input
                          type="text"
                          name="direccionNegocio"
                          className="form-control-perfil"
                          value={formData.direccionNegocio}
                          onChange={handleChange}
                          placeholder="Calle 123 #45-67"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label-perfil">Ciudad</label>
                        <input
                          type="text"
                          name="ciudadNegocio"
                          className="form-control-perfil"
                          value={formData.ciudadNegocio}
                          onChange={handleChange}
                          placeholder="Valledupar"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label-perfil">
                          Departamento
                        </label>
                        <input
                          type="text"
                          name="departamentoNegocio"
                          className="form-control-perfil"
                          value={formData.departamentoNegocio}
                          onChange={handleChange}
                          placeholder="Cesar"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label-perfil">
                          Teléfono Empresa
                        </label>
                        <input
                          type="text"
                          name="telefonoNegocio"
                          className="form-control-perfil"
                          value={formData.telefonoNegocio}
                          onChange={handleChange}
                          placeholder="3001234567"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label-perfil">
                          Correo Empresa
                        </label>
                        <input
                          type="email"
                          name="correoNegocio"
                          className="form-control-perfil"
                          value={formData.correoNegocio}
                          onChange={handleChange}
                          placeholder="contacto@empresa.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-secondary-perfil"
                      onClick={cancelarEdicion}
                      disabled={actualizarPerfilLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn-primary-perfil"
                      disabled={actualizarPerfilLoading}
                    >
                      {actualizarPerfilLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <CheckCircleFill className="me-2" size={18} />
                          Guardar Cambios
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <h3 className="sidebar-card-title">Estado de la Cuenta</h3>
            </div>
            <div className="sidebar-card-body">
              <div className="status-control">
                <div className="status-info">
                  <div
                    className={`status-icon-large ${isOnline ? "online" : "offline"}`}
                  >
                    {isOnline ? (
                      <CheckCircleFill size={28} />
                    ) : (
                      <ExclamationTriangleFill size={28} />
                    )}
                  </div>
                  <div>
                    <h4 className="status-text">
                      {isOnline ? "Cuenta Activa" : "Cuenta Inactiva"}
                    </h4>
                    <p className="status-description">
                      {isOnline
                        ? "Tu cuenta está activa y funcionando correctamente"
                        : `Tu cuenta será eliminada en ${diasRestantes} ${diasRestantes === 1 ? "día" : "días"}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleToggleClick}
                  className={`toggle-switch-perfil ${isOnline ? "active" : ""}`}
                  title={isOnline ? "Desactivar cuenta" : "Activar cuenta"}
                  disabled={cambiarEstadoLoading}
                >
                  {cambiarEstadoLoading ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : isOnline ? (
                    <ToggleOn size={40} />
                  ) : (
                    <ToggleOff size={40} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="sidebar-card mt-3">
            <div className="sidebar-card-header">
              <h3 className="sidebar-card-title">Seguridad</h3>
            </div>
            <div className="sidebar-card-body">
              <button
                onClick={() => setShowCambiarContrasena(true)}
                className="action-link"
              >
                <span>Cambiar Contraseña</span>
              </button>
              <button
                onClick={() => setShowHistorialSesiones(true)}
                className="action-link"
              >
                <span>Historial de Sesiones</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      

      <ModalPerfilDesactivar
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => handleCambiarEstado(false)}
        loading={cambiarEstadoLoading}
      />
      <ModalCambiarContraseña
        isOpen={showCambiarContrasena}
        onClose={() => setShowCambiarContrasena(false)}
      />
      <ModalHistorialSesiones
        isOpen={showHistorialSesiones}
        onClose={() => setShowHistorialSesiones(false)}
      />
    </div>
  );
}

export default Perfil;
