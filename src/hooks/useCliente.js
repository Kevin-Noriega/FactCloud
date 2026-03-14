import { useState, useEffect } from "react";
import api from "../api/axios.js";

const ESTADO_INICIAL = {
  nombre:               "",
  apellido:             "",
  tipoIdentificacion:   "CC",  
  numeroIdentificacion: "",
  digitoVerificacion:   "",
  tipoPersona:          "persona",
  correo:               "",
  telefono:             "",
  ciudad:               "",
  direccion:            "",
  codigoPostal:         "",
  nombreComercial:      "",
};

export const useCliente = ({ clienteEditando, open, onSuccess, onClose }) => {
  const [cliente,   setCliente]   = useState(ESTADO_INICIAL);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (clienteEditando) {
      setCliente({
        nombre:               clienteEditando.nombre               || "",
        apellido:             clienteEditando.apellido             || "",
        tipoIdentificacion:   clienteEditando.tipoIdentificacion   || "CC",
        numeroIdentificacion: clienteEditando.numeroIdentificacion || "",
        digitoVerificacion:   clienteEditando.dv                   || "",
        tipoPersona:          clienteEditando.tipo                 || "persona",
        correo:               clienteEditando.correoFacturacion    || "",
        telefono:             clienteEditando.telefonoFacturacion  || "",
        ciudad:               clienteEditando.ciudad               || "",
        direccion:            clienteEditando.direccion            || "",
        codigoPostal:         clienteEditando.codigoPostal         || "",
        nombreComercial:      clienteEditando.nombreComercial      || "",
      });
    } else {
      setCliente(ESTADO_INICIAL);
    }
  }, [clienteEditando, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCliente((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (campo, valor) =>
    setCliente((prev) => ({ ...prev, [campo]: valor }));

  const handleDepartamentoChange = (opt) =>
    setCliente((prev) => ({
      ...prev,
      departamento: opt?.value || "",
      ciudad:       "",
    }));

  const handleCiudadChange = (opt) =>
    setCliente((prev) => ({ ...prev, ciudad: opt?.value || "" }));

  const limpiarFormulario = () => setCliente(ESTADO_INICIAL);

  const handleClose = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    limpiarFormulario();
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  // ✅ Recibe extraData como objeto plano — sin hack del evento
  const handleSubmit = async (extraData = {}) => {
    setGuardando(true);

    // Payload mapeado exactamente al CrearClienteDto
    const payload = {
      tipo:                        cliente.tipoPersona          || "persona",
      tipoIdentificacion:          cliente.tipoIdentificacion   || "CC",
      numeroIdentificacion:        cliente.numeroIdentificacion,
      dv:                          cliente.digitoVerificacion   || null,
      codigoSucursal:              extraData.codigoSucursal     || "0",
      nombre:                      cliente.nombre,
      apellido:                    cliente.apellido             || "",
      nombreComercial:             cliente.nombreComercial      || "",
      ciudad:                      cliente.ciudad               || "",
      direccion:                   cliente.direccion            || "",
      codigoPostal:                extraData.codigoPostal       || cliente.codigoPostal || "",
      // Facturación
      nombreContactoFacturacion:   extraData.nombreContactoFact   || "",
      apellidoContactoFacturacion: extraData.apellidoContactoFact || "",
      correoFacturacion:           extraData.correoFact           || cliente.correo || "",
      tipoRegimenIva:              extraData.tipoRegimenIva       || "",
      indicativoFacturacion:       extraData.indicativoFact       || "",
      telefonoFacturacion:         extraData.telefonoFact         || cliente.telefono || "",
      // Tipo de tercero
      esCliente:                   extraData.esCliente   ?? true,
      esProveedor:                 extraData.esProveedor ?? false,
      esEmpleado:                  extraData.esEmpleado  ?? false,
      // Responsabilidades y colecciones
      responsabilidades:           extraData.responsabilidades || ["R-99-PN"],
      telefonos:                   extraData.telefonos         || [],
      contactos:                   extraData.contactos         || [],
    };

    try {
      if (clienteEditando) {
        const { data } = await api.put(`/Clientes/${clienteEditando.id}`, payload);
        onSuccess(data, "Cliente modificado con éxito.");
      } else {
        const { data } = await api.post("/Clientes", payload);
        onSuccess(data, "Cliente agregado con éxito.");
      }
      limpiarFormulario();
      onClose();
    } catch (error) {
      if (error.response?.status === 409) {
        alert(error.response.data?.mensaje || "Ya existe un cliente con esa identificación.");
      } else if (error.response?.status === 400) {
        const errores = error.response?.data?.errors;
        if (errores) {
          const lista = Object.entries(errores)
            .map(([k, v]) => `• ${k}: ${v.join(", ")}`)
            .join("\n");
          alert("Datos inválidos:\n" + lista);
        } else {
          alert("Error 400: " + JSON.stringify(error.response?.data));
        }
      } else {
        alert("Error al guardar cliente: " + (error.response?.data?.mensaje || error.message));
      }
    } finally {
      setGuardando(false);
    }
  };

  return {
    cliente,
    guardando,
    handleChange,
    handleSelectChange,
    handleDepartamentoChange,
    handleCiudadChange,
    handleSubmit,
    handleClose,
    handleOverlayClick,
  };
};
