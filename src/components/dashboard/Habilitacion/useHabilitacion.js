// ─────────────────────────────────────────────────────────────
// useHabilitacion.js
// Custom hook que centraliza TODO el estado y llamadas API del
// wizard de habilitación. El componente visual no llama a axios
// directamente — solo consume este hook.
// ─────────────────────────────────────────────────────────────
import { useCallback, useEffect, useMemo, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import Ciudades from "../../../utils/Ciudades.json";
import ActividadesEconomicasCIIU from "../../../utils/ActividadesEconomicasCIIU.json";
import {
  INITIAL_FORM,
  MAPEO_REGIMEN,
  REGIMEN_IVA_OPTIONS,
  TRIBUTOS_OPTIONS,
  RESPONSABILIDADES_OPTIONS,
  normalizarFormulario,
  toArray,
} from "./constants";

export function useHabilitacion() {
  const [etapaActual, setEtapaActual] = useState(1);
  const [tieneNegocio, setTieneNegocio] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [form, setForm] = useState(INITIAL_FORM);

  // ── opciones para Select ────────────────────────────────────

  const opcionesCiudades = useMemo(
    () =>
      Ciudades.map((c) => {
        const nombre = c.ciudad || c.nombre;
        const codigo = c.codigoCiudad || c.codigo;
        return {
          value: nombre,
          label: codigo ? `${codigo} - ${nombre}` : nombre,
        };
      }),
    [],
  );

  const opcionesActividad = useMemo(
    () =>
      ActividadesEconomicasCIIU.map((a) => ({
        value: a.codigo,
        label: `${a.codigo} - ${a.descripcion}`,
      })),
    [],
  );

  // ── valores seleccionados (para los componentes Select) ─────

  const valorRegimen =
    REGIMEN_IVA_OPTIONS.find((i) => i.value === form.perfil.regimenIva) || null;

  const valorActividad =
    opcionesActividad.find((i) => i.value === form.perfil.actividadEconomica) ||
    null;

  const valorTributos = TRIBUTOS_OPTIONS.filter((i) =>
    toArray(form.perfil.tributos).includes(i.value),
  );

  const valorResponsabilidades = RESPONSABILIDADES_OPTIONS.filter((i) =>
    toArray(form.perfil.responsabilidadesFiscales).includes(i.value),
  );

  // ── helpers de estado ───────────────────────────────────────

  const actualizarCampo = useCallback((bloque, campo, valor) => {
    setForm((prev) => ({
      ...prev,
      [bloque]: { ...prev[bloque], [campo]: valor },
    }));
  }, []);

  const manejarCambioRegimen = useCallback((opcion) => {
    const value = opcion?.value || "";
    const mapeo = MAPEO_REGIMEN[value];
    setForm((prev) => ({
      ...prev,
      perfil: {
        ...prev.perfil,
        regimenIva: value,
        tributos: mapeo?.tributos || [],
        responsabilidadesFiscales: mapeo?.responsabilidadesFiscales || [],
      },
    }));
  }, []);

  const limpiarMensajes = () => {
    setError("");
    setExito("");
  };

  // ── carga inicial ───────────────────────────────────────────

  /**
   * Al montar, llama GET /api/negocios/mio.
   * Si el negocio ya existe lo hidrata en el form y detecta
   * qué pasos ya están completados para posicionar el stepper.
   */
  const cargarEstado = useCallback(async () => {
    try {
      const { data } = await axiosClient.get("/negocios/mio");

      setTieneNegocio(true);

      // Mapear la respuesta del backend al shape del formulario
      const pasos = data.pasosCompletados ?? [];
      const negocio = {
        perfil: {
          tipoPersona:
            data.datosGenerales?.tipoSujeto === 1
              ? "persona_natural"
              : "empresa",
          correoAcceso: data.datosGenerales?.correoRecepcionDian ?? "",
          tipoIdentificacion: String(
            data.datosGenerales?.tipoDocumento ?? "31",
          ),
          numeroIdentificacion: data.datosGenerales?.numeroIdentificacion ?? "",
          dv: data.datosGenerales?.dvNit ?? "",
          nombreComercial: data.datosGenerales?.nombreComercial ?? "",
          razonSocial: data.datosGenerales?.razonSocial ?? "",
          nombres: data.datosGenerales?.primerNombre ?? "",
          apellidos: data.datosGenerales?.primerApellido ?? "",
          correo: data.datosGenerales?.correoElectronico ?? "",
          direccion: data.datosGenerales?.direccion ?? "",
          ciudad: data.datosGenerales?.ciudad ?? "",
          telefono: data.datosGenerales?.telefono ?? "",
          regimenIva: data.perfilTributario?.regimenIvaCodigo ?? "",
          actividadEconomica:
            data.perfilTributario?.actividadEconomicaCIIU ?? "",
          tributos: toArray(
            data.perfilTributario?.tributosJson
              ? JSON.parse(data.perfilTributario.tributosJson)
              : [],
          ),
          responsabilidadesFiscales: toArray(
            data.perfilTributario?.responsabilidadesFiscalesJson
              ? JSON.parse(data.perfilTributario.responsabilidadesFiscalesJson)
              : [],
          ),
          representanteNombre: data.representanteLegal?.nombre ?? "",
          representanteApellidos: data.representanteLegal?.apellidos ?? "",
          representanteTipoId: String(
            data.representanteLegal?.tipoDocumento ?? "13",
          ),
          representanteNumeroId:
            data.representanteLegal?.numeroIdentificacion ?? "",
          ciudadExpedicion: data.representanteLegal?.ciudadExpedicion ?? "",
          ciudadResidencia: data.representanteLegal?.ciudadResidencia ?? "",
        },
        setPruebas: {
          testSetId: data.configuracionDian?.softwarePIN ?? "",
          resolucionPrueba: data.configuracionDian?.numeroResolucionDIAN ?? "",
        },
        numeracion: {
          prefijo: data.configuracionDian?.prefijoAutorizadoDIAN ?? "",
          tipoFacturacion: "Factura electrónica de venta",
        },
      };

      setForm(normalizarFormulario(negocio));

      // Posicionar el stepper en el primer paso pendiente
      const ORDEN = [
        "datos-generales",
        "perfil-tributario",
        "representante-legal",
        "configuracion-dian",
      ];
      const primerPendiente = ORDEN.findIndex((p) => !pasos.includes(p));
      if (primerPendiente >= 0) setEtapaActual(primerPendiente + 1);
      else setEtapaActual(5); // todos completos → ir a prefijos/sync
    } catch (e) {
      // El negocio no existe aún — wizard empieza en 1
      if (e.response?.status === 404) {
        setTieneNegocio(false);
        setEtapaActual(1);
      }
    }
  }, []);

  useEffect(() => {
    cargarEstado();
  }, [cargarEstado]);

  // ── guardadores por etapa ───────────────────────────────────

  /**
   * Etapa 1 — Perfil de la empresa.
   * Si el negocio no existe → POST /api/negocios.
   * Si ya existe           → PUT /api/negocios/mio/datos-generales
   *                          PUT /api/negocios/mio/perfil-tributario
   *                          PUT /api/negocios/mio/representante-legal
   */
  const guardarEtapa1 = async () => {
    const p = form.perfil;

    const datosGenerales = {
      tipoSujeto: p.tipoPersona === "empresa" ? 2 : 1,
      tipoDocumento: parseInt(p.tipoIdentificacion, 10),
      nombreComercial: p.nombreComercial,
      razonSocial: p.razonSocial,
      primerNombre: p.nombres,
      primerApellido: p.apellidos,
      numeroIdentificacion: p.numeroIdentificacion,
      dvNit: p.dv,
      direccion: p.direccion,
      ciudad: p.ciudad,
      telefono: p.telefono,
      correoElectronico: p.correo,
      correoRecepcionDian: p.correoAcceso,
    };

    if (!tieneNegocio) {
      await axiosClient.post("/negocios", datosGenerales);
      setTieneNegocio(true);
    } else {
      await axiosClient.put("/negocios/mio/datos-generales", datosGenerales);
    }

    await axiosClient.put("/negocios/mio/perfil-tributario", {
      regimenIvaCodigo: p.regimenIva,
      actividadEconomicaCIIU: p.actividadEconomica,
      tributosJson: JSON.stringify(toArray(p.tributos)),
      responsabilidadesFiscalesJson: JSON.stringify(
        toArray(p.responsabilidadesFiscales),
      ),
    });

    if (p.tipoPersona === "empresa") {
      await axiosClient.put("/negocios/mio/representante-legal", {
        nombre: p.representanteNombre,
        apellidos: p.representanteApellidos,
        tipoDocumento: parseInt(p.representanteTipoId, 10),
        numeroIdentificacion: p.representanteNumeroId,
        ciudadExpedicion: p.ciudadExpedicion,
        ciudadResidencia: p.ciudadResidencia,
      });
    }
  };

  /**
   * Etapa 2 — Certificado digital.
   * Por ahora solo valida que el usuario aceptó la exoneración.
   * Cuando tengas el endpoint de certificados, añádelo aquí.
   */
  const guardarEtapa2 = async () => {
    if (!form.certificado.aceptarExoneracion) {
      throw new Error("Debes aceptar la carta de exoneración para continuar.");
    }
    // TODO: POST /api/negocios/mio/certificado cuando esté listo
  };

  /**
   * Etapa 3 — Set de pruebas DIAN.
   * Guarda el testSetId en ConfiguracionDian.
   */
  const guardarEtapa3 = async () => {
    await axiosClient.post("/Habilitacion/test-set", {
      testSetId: form.setPruebas.testSetId,
    });
  };

  /**
   * Etapa 4 — Solicitar numeración.
   * Registra la resolución DIAN.
   */
  const guardarEtapa4 = async () => {
   /* await axiosClient.post("/Habilitacion/resolucion", {
      numeroAutorizacion: form.setPruebas.resolucionPrueba,
      prefijo: form.numeracion.prefijo,
      rangoDesde: 1,
      rangoHasta: 5000000,
      fechaInicio: new Date().toISOString().split("T")[0],
      fechaFin: new Date(Date.now() + 365 * 86400000)
        .toISOString()
        .split("T")[0],
      claveTecnica: "",
      tipoAmbiente: "1",
    });*/
  };

  /**
   * Etapa 5 — Asociar prefijos (informacional, sin llamada API extra).
   */
  const guardarEtapa5 = async () => {
    // El prefijo ya se guardó en etapa 4. Aquí solo se confirma en UI.
  };

  /**
   * Etapa 6 — Sincronizar / finalizar habilitación.
   */
  const guardarEtapa6 = async () => {
    if (!form.sincronizacion.sincronizado) {
      throw new Error("Debes confirmar que la información fue sincronizada.");
    }
    await axiosClient.post("/Habilitacion/finalizar", { completado: true });
  };

  const GUARDADORES = {
    1: guardarEtapa1,
    2: guardarEtapa2,
    3: guardarEtapa3,
    4: guardarEtapa4,
    5: guardarEtapa5,
    6: guardarEtapa6,
  };

  // ── acción principal del botón "Guardar y continuar" ────────

  const guardarEtapa = async () => {
    limpiarMensajes();
    setCargando(true);
    try {
      await GUARDADORES[etapaActual]();
      if (etapaActual < 6) {
        setEtapaActual((prev) => prev + 1);
      } else {
        setExito("¡Habilitación completada correctamente!");
      }
    } catch (e) {
      setError(
        e.response?.data?.mensaje ??
          e.message ??
          "No fue posible guardar la etapa.",
      );
    } finally {
      setCargando(false);
    }
  };

  const volver = () => {
    if (etapaActual > 1) setEtapaActual((prev) => prev - 1);
  };

  return {
    // estado
    etapaActual,
    form,
    cargando,
    error,
    exito,
    // datos derivados para los Select
    opcionesCiudades,
    opcionesActividad,
    valorRegimen,
    valorActividad,
    valorTributos,
    valorResponsabilidades,
    // acciones
    actualizarCampo,
    manejarCambioRegimen,
    guardarEtapa,
    volver,
  };
}
