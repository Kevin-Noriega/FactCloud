import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const CONTACTO_VACIO = {
  nombre: "", apellido: "", correo: "", cargo: "", indicativo: "", telefono: "",
};

const ESTADO_INICIAL = {
  nombre:               "",
  apellido:             "",
  tipoIdentificacion:   "CC",  
  numeroIdentificacion: "",
  digitoVerificacion:   "",
  tipoPersona:          "persona",
  correo:               "",
  telefono:             "",
    departamento:         "", 
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
        tipoIdentificacion:   clienteEditando.tipoIdentificacion   || "",
        numeroIdentificacion: clienteEditando.numeroIdentificacion || "",
        digitoVerificacion:   clienteEditando.digitoVerificacion   || "",
        tipoPersona:          clienteEditando.tipoPersona          || "",
        regimenTributario:    clienteEditando.regimenTributario    || "",
        regimenFiscal:        clienteEditando.regimenFiscal        || "",
        nombreComercial:      clienteEditando.nombreComercial      || "",
        actividadEconomicaCIIU: clienteEditando.actividadEconomicaCIIU || "",
        correo:               clienteEditando.correo               || "",
        telefono:             clienteEditando.telefono             || "",
        departamento:         clienteEditando.departamento         || "",
        departamentoCodigo:   clienteEditando.departamentoCodigo   || "",
        ciudad:               clienteEditando.ciudad               || "",
        ciudadCodigo:         clienteEditando.ciudadCodigo         || "",
        direccion:            clienteEditando.direccion            || "",
        codigoPostal:         clienteEditando.codigoPostal         || "",
        retenedorIVA:         clienteEditando.retenedorIVA         || false,
        retenedorRenta:       clienteEditando.retenedorRenta       || false,
        autoretenedorRenta:   clienteEditando.autoretenedorRenta   || false,
        retenedorICA:         clienteEditando.retenedorICA         || false,
        // ✅ carga contactos existentes o arranca con uno vacío
        contactos: clienteEditando.contactos?.length
          ? clienteEditando.contactos
          : [{ ...CONTACTO_VACIO }],
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
      departamento:       opt?.label || "",
      departamentoCodigo: opt?.value || "",
      ciudad:             "",
      ciudadCodigo:       "",
    }));

  const handleCiudadChange = (opt) =>
    setCliente((prev) => ({
      ...prev,
      ciudad:      opt?.label || "",
      ciudadCodigo: opt?.value || "",
    }));

  // ✅ Funciones de contactos DENTRO del hook
  const agregarContacto = () =>
    setCliente((prev) => ({
      ...prev,
      contactos: [...prev.contactos, { ...CONTACTO_VACIO }],
    }));

  const handleContactoChange = (index, campo, valor) =>
    setCliente((prev) => {
      const nuevos = [...prev.contactos];
      nuevos[index] = { ...nuevos[index], [campo]: valor };
      return { ...prev, contactos: nuevos };
    });

  const eliminarContacto = (index) =>
    setCliente((prev) => ({
      ...prev,
      contactos: prev.contactos.filter((_, i) => i !== index),
    }));

  const limpiarFormulario = () => setCliente(ESTADO_INICIAL);

  const handleClose = () => {
    limpiarFormulario();
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);

    // Payload mapeado exactamente al CrearClienteDto
   const payload = {
  tipoPersona:                 cliente.tipoPersona          || "persona",  // ✅ era "tipo"
  tipoIdentificacion:          cliente.tipoIdentificacion   || "CC",
  numeroIdentificacion:        cliente.numeroIdentificacion,
  dv:                          cliente.digitoVerificacion   || null,
  codigoSucursal:              extraData.codigoSucursal     || "0",
  nombre:                      cliente.nombre,
  apellido:                    cliente.apellido             || "",
  nombreComercial:             cliente.nombreComercial      || "",
  departamento:                cliente.departamento         || "",          // ✅ faltaba
  ciudad:                      cliente.ciudad               || "",
  direccion:                   cliente.direccion            || "",
  codigoPostal:                extraData.codigoPostal       || cliente.codigoPostal || "",
  correo:                      cliente.correo               || "",          // ✅ faltaba
  // Facturación
  nombreContactoFacturacion:   extraData.nombreContactoFact   || "",
  apellidoContactoFacturacion: extraData.apellidoContactoFact || "",
  correoFacturacion:           extraData.correoFact           || cliente.correo || "",
  regimenTributario:          extraData.tipoRegimenIva       || "",        // ✅ era tipoRegimenIva
  indicativoFacturacion:       extraData.indicativoFact       || "",
  telefonoFacturacion:         extraData.telefonoFact         || cliente.telefono || "",
  // Tipo de tercero
  esCliente:                   extraData.esCliente   ?? true,
  esProveedor:                 extraData.esProveedor ?? false,
  esEmpleado:                  extraData.esEmpleado  ?? false,
  // Colecciones
  responsabilidades:           extraData.responsabilidades || ["R-99-PN"],
  telefonos:                   extraData.telefonos         || [],
  contactos:                   extraData.contactos         || [],
};

    try {
      if (clienteEditando) {
        await axiosClient.put(`/Clientes/${clienteEditando.id}`, payload);
        onSuccess("Cliente actualizado con éxito.");
      } else {
        await axiosClient.post("/Clientes", payload);
        onSuccess("Cliente creado con éxito.");
      }
      limpiarFormulario();
      onClose();
    } catch (error) {
      if (error.response?.status === 400) {
        const errores = error.response?.data?.errors;
        if (errores) {
          const lista = Object.entries(errores)
            .map(([k, v]) => `• ${k}: ${v.join(", ")}`)
            .join("\n");
          alert("Datos inválidos:\n" + lista);
        } else {
          alert("Error 400: " + JSON.stringify(error.response?.data));
        }
      } else if (error.response?.status === 409) {
        alert("Ya existe un cliente con esa identificación.");
      } else {
        alert("Error al guardar: " + (error.message || "Error desconocido"));
        console.error(error);
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
    // ✅ exponer funciones de contactos
    agregarContacto,
    handleContactoChange,
    eliminarContacto,
  };
};
