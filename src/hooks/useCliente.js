import { useState, useEffect } from "react";
import { API_URL } from "../api/config";

const ESTADO_INICIAL = {
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
  estado: true,
  pais: "CO",
  nombreComercial: "",
  actividadEconomicaCIIU: "",
};

export const useCliente = ({ clienteEditando, open, onSuccess, onClose }) => {
  const [cliente, setCliente] = useState(ESTADO_INICIAL);
  const [guardando, setGuardando] = useState(false);

  // Carga datos al abrir en modo edición, limpia en modo creación
  useEffect(() => {
    if (clienteEditando) {
      setCliente({
        nombre: clienteEditando.nombre || "",
        apellido: clienteEditando.apellido || "",
        tipoIdentificacion: clienteEditando.tipoIdentificacion || "",
        numeroIdentificacion: clienteEditando.numeroIdentificacion || "",
        digitoVerificacion: clienteEditando.digitoVerificacion || "",
        tipoPersona: clienteEditando.tipoPersona || "",
        regimenTributario: clienteEditando.regimenTributario || "",
        regimenFiscal: clienteEditando.regimenFiscal || "",
        correo: clienteEditando.correo || "",
        telefono: clienteEditando.telefono || "",
        departamento: clienteEditando.departamento || "",
        ciudad: clienteEditando.ciudad || "",
        ciudadCodigo: clienteEditando.ciudadCodigo || "",
        departamentoCodigo: clienteEditando.departamentoCodigo || "",
        direccion: clienteEditando.direccion || "",
        codigoPostal: clienteEditando.codigoPostal || "",
        retenedorIVA: !!clienteEditando.retenedorIVA,
        retenedorICA: !!clienteEditando.retenedorICA,
        retenedorRenta: !!clienteEditando.retenedorRenta,
        autoretenedorRenta: !!clienteEditando.autoretenedorRenta,
        estado: clienteEditando.estado ?? true,
        pais: clienteEditando.pais || "CO",
        nombreComercial: clienteEditando.nombreComercial || "",
        actividadEconomicaCIIU: clienteEditando.actividadEconomicaCIIU || "",
      });
    } else {
      setCliente(ESTADO_INICIAL);
    }
  }, [clienteEditando, open]);

  // Maneja inputs normales y checkboxes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCliente((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Maneja cualquier campo por nombre (para react-select)
  const handleSelectChange = (campo, valor) => {
    setCliente((prev) => ({ ...prev, [campo]: valor }));
  };

  // Maneja cambio de departamento limpiando ciudad
  const handleDepartamentoChange = (opt) => {
    setCliente((prev) => ({
      ...prev,
      departamento: opt ? opt.value : "",
      departamentoCodigo: opt ? opt.departamentoCodigo : "",
      ciudad: "",
      ciudadCodigo: "",
    }));
  };

  // Maneja cambio de ciudad
  const handleCiudadChange = (opt) => {
    setCliente((prev) => ({
      ...prev,
      ciudad: opt ? opt.value : "",
      ciudadCodigo: opt ? opt.ciudadCodigo : "",
    }));
  };

  const limpiarFormulario = () => setCliente(ESTADO_INICIAL);

  const handleClose = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    limpiarFormulario();
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);

    try {
      const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
      if (!usuarioGuardado) {
        alert("No se encontró un usuario autenticado.");
        return;
      }

      const payload = {
        ...(clienteEditando && { id: clienteEditando.id }),
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
        ? `${API_URL}/Clientes/${clienteEditando.id}`
        : `${API_URL}/Clientes`;
      const method = clienteEditando ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      const clienteGuardado = await res.json();
      const mensaje = clienteEditando
        ? "Cliente modificado con éxito."
        : "Cliente agregado con éxito.";

      onSuccess(clienteGuardado, mensaje);
      limpiarFormulario();
      onClose();
    } catch (error) {
      alert("Error al guardar cliente: " + error.message);
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
