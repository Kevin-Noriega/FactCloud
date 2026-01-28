import { useEffect, useState } from "react";
import { API_URL } from "../api/config";
import { useUsuarios } from "../hooks/useUsuarios";
import ModalPerfilDesactivar from "../components/ModalPerfilDesactivar";
import { 
  ToggleOn, 
  ToggleOff, 
  ExclamationTriangleFill,
  XCircle,
  PersonCircle,
  EnvelopeFill,
  TelephoneFill,
  CalendarEventFill,
  BuildingFill,
  GeoAltFill,
  CreditCard2BackFill,
  PencilSquare,
  CheckCircleFill,
  ClockHistory
} from "react-bootstrap-icons";
import "../styles/Perfil.css";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const { data: datosBackend, isLoading, error, refetch } = useUsuarios();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    empresa: "",
    telefono: "",
    logoNegocio: "",
    nitNegocio: "",
    dvNitNegocio: "",
    direccionNegocio: "",
    tipoRegimen: "",
    ciudadNegocio: "",
    departamentoNegocio: "",
    correoNegocio: "",
    telefonoNegocio: "",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  useEffect(() => {
    if (datosBackend) {
      const usuarioNormalizado = {
        id: datosBackend.id,
        nombre: `${datosBackend.nombre || ""} ${datosBackend.apellido || ""}`.trim(),
        nombreSolo: datosBackend.nombre || "",
        apellido: datosBackend.apellido || "",
        email: datosBackend.correo || "",
        empresa: datosBackend.nombreNegocio || "",
        telefono: datosBackend.telefono || "",
        tipoIdentificacion: datosBackend.tipoIdentificacion || "",
        logoNegocio: datosBackend.logoNegocio || "",
        nitNegocio: datosBackend.nitNegocio || "",
        dvNitNegocio: datosBackend.dvNitNegocio || "",
        direccionNegocio: datosBackend.direccionNegocio || "",
        tipoRegimen: datosBackend.regimenFiscal || "",
        regimenTributario: datosBackend.regimenTributario || "",
        departamentoNegocio: datosBackend.departamentoNegocio || "",
        ciudadNegocio: datosBackend.ciudadNegocio || "",
        correoNegocio: datosBackend.correoNegocio || "",
        telefonoNegocio: datosBackend.telefonoNegocio || "",
        numeroIdentificacion: datosBackend.numeroIdentificacion || "",
        estado: datosBackend.estado,
        fechaDesactivacion: datosBackend.fechaDesactivacion,
        fechaRegistro: datosBackend.fechaRegistro,
      };

      setUsuario(usuarioNormalizado);
      setIsOnline(usuarioNormalizado.estado);
      
      setFormData({
        nombre: usuarioNormalizado.nombre,
        email: usuarioNormalizado.email,
        empresa: usuarioNormalizado.empresa,
        telefono: usuarioNormalizado.telefono,
        logoNegocio: usuarioNormalizado.logoNegocio,
        nitNegocio: usuarioNormalizado.nitNegocio,
        dvNitNegocio: usuarioNormalizado.dvNitNegocio,
        direccionNegocio: usuarioNormalizado.direccionNegocio,
        tipoRegimen: usuarioNormalizado.tipoRegimen,
        ciudadNegocio: usuarioNormalizado.ciudadNegocio,
        departamentoNegocio: usuarioNormalizado.departamentoNegocio,
        correoNegocio: usuarioNormalizado.correoNegocio,
        telefonoNegocio: usuarioNormalizado.telefonoNegocio,
      });
    }
  }, [datosBackend]);

  const handleToggleClick = () => {
    if (isOnline) {
      setShowConfirmModal(true);
    } else {
      confirmarCambioEstado(true);
    }
  };

  const confirmarCambioEstado = async (activar = false) => {
    const nuevoEstado = activar ? true : false;
    const estadoAnterior = isOnline;
    
    setIsOnline(nuevoEstado);
    setShowConfirmModal(false);

    try {
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
      if (!usuarioGuardado) {
        throw new Error("No se encontró usuario autenticado");
      }

      const respuesta = await fetch(
        `${API_URL}/Usuarios/${usuarioGuardado.id}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            estado: nuevoEstado,
            ...(nuevoEstado === false && { 
              fechaDesactivacion: new Date().toISOString() 
            }),
            ...(nuevoEstado === true && { 
              fechaDesactivacion: null 
            })
          }),
        }
      );

      if (!respuesta.ok) {
        const errorText = await respuesta.text();
        throw new Error(errorText || "Error al actualizar el estado");
      }

      setMensajeExito(
        nuevoEstado 
          ? "Cuenta reactivada exitosamente" 
          : "Cuenta desactivada. Se eliminará en 30 días si no la reactivas."
      );
      
      setUsuario((prev) => ({ 
        ...prev, 
        estado: nuevoEstado,
        fechaDesactivacion: nuevoEstado ? null : new Date().toISOString()
      }));

      refetch();
      setTimeout(() => setMensajeExito(""), 5000);
      
    } catch (error) {
      console.error("Error:", error);
      setIsOnline(estadoAnterior);
      alert("Error al cambiar el estado: " + error.message);
    }
  };

  const calcularDiasRestantes = () => {
    if (!usuario?.fechaDesactivacion) return null;
    
    const fechaDesactivacion = new Date(usuario.fechaDesactivacion);
    const fechaEliminacion = new Date(fechaDesactivacion);
    fechaEliminacion.setDate(fechaEliminacion.getDate() + 30);
    
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
            dvNitNegocio: formData.dvNitNegocio ? parseInt(formData.dvNitNegocio) : null,
            direccionNegocio: formData.direccionNegocio,
            regimenFiscal: formData.tipoRegimen,
            departamentoNegocio: formData.departamentoNegocio,
            ciudadNegocio: formData.ciudadNegocio,
            correoNegocio: formData.correoNegocio,
            telefonoNegocio: formData.telefonoNegocio,
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
      await refetch();

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
      telefonoNegocio: usuario.telefonoNegocio || "",
    });
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
          <li className="breadcrumb-item"><a href="/dashboard">Inicio </a></li>
          <li className="breadcrumb-item active" aria-current="page">Mi Perfil</li>
        </ol>
      </nav>

      {mensajeExito && (
        <div className={`alert-perfil ${!isOnline ? 'alert-warning-perfil' : 'alert-success-perfil'}`}>
          <CheckCircleFill size={20} className="me-2" />
          <span>{mensajeExito}</span>
          <button className="alert-close-btn-perfil" onClick={() => setMensajeExito("")}>
            <XCircle size={18} />
          </button>
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
              Tu cuenta será eliminada permanentemente en <strong>{diasRestantes} {diasRestantes === 1 ? 'día' : 'días'}</strong>.
              <br />
              Puedes reactivarla en cualquier momento antes de que expire el plazo.
            </p>
            <button className="btn-reactivate-perfil" onClick={() => confirmarCambioEstado(true)}>
              Reactivar Ahora
            </button>
          </div>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="perfil-card">
            <div className={`perfil-card-header ${!isOnline ? 'inactive' : ''}`}>
              <div className="d-flex align-items-center justify-content-between w-100">
                <div className="d-flex align-items-center gap-4">
                  <div className="logo-wrapper">
                    <LogoEmpresa
                      url={usuario?.logoNegocio}
                      nombreEmpresa={usuario?.empresa}
                      size="120px"
                    />
                    <div className={`status-indicator-dot ${isOnline ? 'online' : 'offline'}`}></div>
                  </div>
                  <div>
                    <h2 className="empresa-title">{usuario?.empresa || "Sin empresa"}</h2>
                    <p className="usuario-subtitle">{usuario?.nombre}</p>
                    <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                      <span className={`status-pill ${isOnline ? 'online' : 'offline'}`}>
                        <span className="status-dot"></span>
                        {isOnline ? "Activo" : "Inactivo"}
                      </span>
                      {usuario?.tipoRegimen && (
                        <span className="regimen-pill">
                          {usuario.tipoRegimen}
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
                      <h3 className="section-title">
                        Información Personal
                      </h3>
                      <button className="btn-icon-edit" onClick={() => setEditando(true)}>
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
                          <p className="info-value">{usuario?.nombre || "N/A"}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-icon">
                          <EnvelopeFill size={20} />
                        </div>
                        <div>
                          <span className="info-label">Correo Electrónico</span>
                          <p className="info-value">{usuario?.email || "N/A"}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-icon">
                          <TelephoneFill size={20} />
                        </div>
                        <div>
                          <span className="info-label">Teléfono</span>
                          <p className="info-value">{usuario?.telefono || "N/A"}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-icon">
                          <CalendarEventFill size={20} />
                        </div>
                        <div>
                          <span className="info-label">Fecha de Registro</span>
                          <p className="info-value">
                            {usuario?.fechaRegistro
                              ? new Date(usuario.fechaRegistro).toLocaleDateString("es-CO", {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
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
                      <h3 className="section-title">
                        Información Empresarial
                      </h3>
                    </div>
                    <div className="info-grid">
                      <div className="info-item">
                        <div className="info-icon">
                          <BuildingFill size={20} />
                        </div>
                        <div>
                          <span className="info-label">Razón Social</span>
                          <p className="info-value">{usuario?.empresa || "N/A"}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-icon">
                          <CreditCard2BackFill size={20} />
                        </div>
                        <div>
                          <span className="info-label">NIT</span>
                          <p className="info-value">
                            {usuario?.nitNegocio
                              ? `${usuario.nitNegocio}${
                                  usuario.dvNitNegocio ? `-${usuario.dvNitNegocio}` : ""
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
                          <p className="info-value">{usuario?.direccionNegocio || "N/A"}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-icon">
                          <GeoAltFill size={20} />
                        </div>
                        <div>
                          <span className="info-label">Ciudad</span>
                          <p className="info-value">
                            {usuario?.ciudadNegocio
                              ? `${usuario.ciudadNegocio}${
                                  usuario.departamentoNegocio
                                    ? `, ${usuario.departamentoNegocio}`
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
                          <p className="info-value">{usuario?.telefonoNegocio || "N/A"}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-icon">
                          <EnvelopeFill size={20} />
                        </div>
                        <div>
                          <span className="info-label">Correo Empresa</span>
                          <p className="info-value">{usuario?.correoNegocio || "N/A"}</p>
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
                        <label className="form-label-perfil">Nombre Completo *</label>
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
                        <label className="form-label-perfil">Correo Electrónico *</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control-perfil"
                          value={formData.email}
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
                      <div className="col-md-6">
                        <label className="form-label-perfil">Nombre de la Empresa</label>
                        <input
                          type="text"
                          name="empresa"
                          className="form-control-perfil"
                          value={formData.empresa}
                          onChange={handleChange}
                          placeholder="Mi Empresa S.A.S"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4 className="form-section-title">Información Empresarial</h4>
                    <div className="row g-3">
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
                        <label className="form-label-perfil">Tipo de Régimen</label>
                        <select
                          name="tipoRegimen"
                          className="form-select-perfil"
                          value={formData.tipoRegimen}
                          onChange={handleChange}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="Simplificado">Simplificado</option>
                          <option value="Común">Común</option>
                          <option value="Gran Contribuyente">Gran Contribuyente</option>
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
                        <label className="form-label-perfil">Departamento</label>
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
                        <label className="form-label-perfil">Teléfono Empresa</label>
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
                        <label className="form-label-perfil">Correo Empresa</label>
                        <input
                          type="email"
                          name="correoNegocio"
                          className="form-control-perfil"
                          value={formData.correoNegocio}
                          onChange={handleChange}
                          placeholder="contacto@empresa.com"
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label-perfil">Logo de la Empresa (URL)</label>
                        <input
                          type="url"
                          name="logoNegocio"
                          className="form-control-perfil"
                          value={formData.logoNegocio}
                          onChange={handleChange}
                          placeholder="https://ejemplo.com/logo.png"
                        />
                        {formData.logoNegocio && (
                          <div className="logo-preview mt-3">
                            <p className="text-muted small mb-2">Vista previa:</p>
                            <LogoEmpresa
                              url={formData.logoNegocio}
                              nombreEmpresa={formData.empresa}
                              size="80px"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn-secondary-perfil" onClick={cancelarEdicion}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn-primary-perfil">
                      <CheckCircleFill className="me-2" size={18} />
                      Guardar Cambios
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
                  <div className={`status-icon-large ${isOnline ? 'online' : 'offline'}`}>
                    {isOnline ? <CheckCircleFill size={28} /> : <ExclamationTriangleFill size={28} />}
                  </div>
                  <div>
                    <h4 className="status-text">{isOnline ? "Cuenta Activa" : "Cuenta Inactiva"}</h4>
                    <p className="status-description">
                      {isOnline 
                        ? "Tu cuenta está activa y funcionando correctamente" 
                        : `Tu cuenta será eliminada en ${diasRestantes} ${diasRestantes === 1 ? 'día' : 'días'}`
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleToggleClick}
                  className={`toggle-switch-perfil ${isOnline ? 'active' : ''}`}
                  title={isOnline ? "Desactivar cuenta" : "Activar cuenta"}
                >
                  {isOnline ? (
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
              <a href="#cambiar-contrasena" className="action-link">
                <span>Cambiar Contraseña</span>
                <span>→</span>
              </a>
              <a href="#historial" className="action-link">
                <span>Historial de Sesiones</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <ModalPerfilDesactivar
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => confirmarCambioEstado(false)}
      />
    </div>
  );
}

export default Perfil;
