import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const CONTACTO_VACIO = {
  nombre: "",
  apellido: "",
  correo: "",
  cargo: "",
  indicativo: "",
  telefono: "",
};

const ESTADO_INICIAL = {
  tipoPersona: "Natural",
  tipoIdentificacion: "",
  numeroIdentificacion: "",
  digitoVerificacion: "",
  codigoSucursal: "0",
  nombre: "",
  apellido: "",
  nombreComercial: "", // ✅ string vacío
  departamento: "",
  departamentoCodigo: "",
  ciudad: "",
  ciudadCodigo: "",
  direccion: "",
  codigoPostal: "",
  regimenTributario: "",
  correo: "", // ✅ string vacío
  nombreContactoFacturacion: "",
  apellidoContactoFacturacion: "",
  indicativoFacturacion: "",
  telefonoFacturacion: "",
  granContribuyente: false,
  autoretenedorRenta: false,
  retenedorIVA: false,
  regimenSimple: false,
  noAplica: false,
  telefonos: [{ indicativo: "", numero: "", extension: "" }],
  contactos: [{ ...CONTACTO_VACIO }],
};

export const useCliente = ({ clienteEditando, open, onSuccess, onClose }) => {
  const [cliente, setCliente] = useState(ESTADO_INICIAL);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (clienteEditando) {
      setCliente({
        nombre: clienteEditando.nombre || "",
        apellido: clienteEditando.apellido || "",
        tipoIdentificacion: clienteEditando.tipoIdentificacion || "CC",
        numeroIdentificacion: clienteEditando.numeroIdentificacion || "",
        digitoVerificacion: clienteEditando.digitoVerificacion || "",
        tipoPersona: clienteEditando.tipoPersona || "persona",
        regimenTributario: clienteEditando.regimenTributario || "",
        nombreComercial: clienteEditando.nombreComercial || "",
        correo: clienteEditando.correo || "",
        telefono: clienteEditando.telefono || "",
        departamento: clienteEditando.departamento || "",
        ciudad: clienteEditando.ciudad || "",
        direccion: clienteEditando.direccion || "",
        codigoPostal: clienteEditando.codigoPostal || "",
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

  const handleDepartamentoChange = (opt) => {
    setCliente((prev) => ({
      ...prev,
      departamento: opt?.label || "",
      departamentoCodigo: opt?.value || "",
      ciudad: "",
      ciudadCodigo: "",
    }));
  };

  const handleCiudadChange = (opt) => {
    setCliente((prev) => ({
      ...prev,
      ciudad: opt?.label || "",
      ciudadCodigo: opt?.value || "",
    }));
  };

  const agregarContacto = () =>
    setCliente((prev) => ({
      ...prev,
      contactos: [...(prev.contactos || []), { ...CONTACTO_VACIO }],
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

  // ── Submit ─────────────────────────────────────────────────────
  const handleSubmit = async (extraData = {}) => {
    // ... setGuardando(true)

    const payload = {
      tipoPersona: cliente.tipoPersona || "Natural",
      tipoIdentificacion: cliente.tipoIdentificacion || "CC",
      numeroIdentificacion: cliente.numeroIdentificacion || "",
      dv: cliente.digitoVerificacion || "", // Cambia a "" en vez de null
      codigoSucursal: cliente.codigoSucursal || "0",
      nombre: cliente.nombre || "",
      apellido: cliente.apellido || "",
      nombreComercial: cliente.nombreComercial || "",
      departamento: cliente.departamento || "",
      departamentoCodigo: cliente.departamentoCodigo || "",
      ciudad: cliente.ciudad || "",
      ciudadCodigo: cliente.ciudadCodigo || "",
      direccion: cliente.direccion || "",
      codigoPostal: cliente.codigoPostal || "",
      correo: cliente.correo || "",
      regimenTributario: cliente.regimenTributario || "",
      nombreContactoFacturacion: cliente.nombreContactoFacturacion || "",
      apellidoContactoFacturacion: cliente.apellidoContactoFacturacion || "",
      indicativoFacturacion: cliente.indicativoFacturacion || "",
      telefonoFacturacion: cliente.telefonoFacturacion || "",
      granContribuyente: cliente.granContribuyente || false, // Añade checkboxes
      autoretenedorRenta: cliente.autoretenedorRenta || false,
      retenedorIVA: cliente.retenedorIVA || false,
      regimenSimple: cliente.regimenSimple || false,
      noAplica: cliente.noAplica || false,
      // Añade faltantes del backend si existen en estado
      telefonos: cliente.telefonos || [],
      contactos: cliente.contactos || [],
      esCliente: true,
      esProveedor: false,
      esEmpleado: false,
      responsabilidades: ["R-99-PN"], // Por defecto como indica el form
    };
    try {
      if (clienteEditando) {
        const { data } = await axiosClient.put(
          `/Clientes/${clienteEditando.id}`,
          payload,
        );
        onSuccess(data, "Cliente modificado con éxito.");
      } else {
        const { data } = await axiosClient.post("/Clientes", payload);
        onSuccess(data, "Cliente creado con éxito.");
      }
      limpiarFormulario();
      onClose();
    } catch (error) {
      if (error.response?.status === 409 || error.response?.status === 500) {
        alert("Ya existe un cliente con esa identificación.");
      }
      if (error.response?.status === 409) {
        alert("Ya existe un cliente con esa identificación.");
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
        alert(
          "Error al guardar: " +
            (error.response?.data?.mensaje || error.message),
        );
        console.error(error);
      }
    } finally {
      setGuardando(false);
    }

    // ... resto del try/catch
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
    agregarContacto,
    handleContactoChange,
    eliminarContacto,
  };
};
