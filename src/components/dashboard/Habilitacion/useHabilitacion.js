// ─────────────────────────────────────────────────────────────────────────
// useHabilitacion.js
// Hook centralizado del wizard de habilitación electrónica.
// Correcciones aplicadas:
//   - useEffect duplicado eliminado
//   - guardarEtapa2 ahora llama PUT /api/Habilitacion/certificado
//   - guardarEtapa4 descomentado y funcional
//   - guardarEtapa5 consulta GET /api/Habilitacion/rango-actual
//   - guardarEtapa6 llama POST /api/Habilitacion/finalizar (sin body)
//   - Estados para Step3 (enviando), Step5 (estadoConsulta, prefijosResult)
//     y Step6 (numeraciones, ultimaActualizacion) correctamente gestionados
//   - cargarEstado usa GET /api/Habilitacion/estado para posicionar stepper
// ─────────────────────────────────────────────────────────────────────────
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
  toArray,
} from "./constants";

// Mapa de paso textual → número de etapa
const PASO_A_ETAPA = {
  SIN_NEGOCIO: 1,
  SIN_EMPRESA: 1,
  SIN_CERTIFICADO: 2,
  SIN_TEST_SET: 3,
  SIN_RESOLUCION: 4,
  RESOLUCION_VENCIDA: 4,
  PENDIENTE_FACTUS: 4,
  HABILITADO: 6,
};

export function useHabilitacion() {
  // ── Estado del wizard ───────────────────────────────────────────────────
  const [etapaActual, setEtapaActual] = useState(1);
  const [tieneNegocio, setTieneNegocio] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [form, setForm] = useState(INITIAL_FORM);

  // ── Estados específicos por step ─────────────────────────────────────
  // Step 3
  const [enviandoTestSet, setEnviandoTestSet] = useState(false);

  // Step 5
  const [estadoConsulta, setEstadoConsulta] = useState("idle"); // idle|loading|success|sin_prefijos|error
  const [prefijosResult, setPrefijosResult] = useState([]);

  // Step 6
  const [numeraciones, setNumeraciones] = useState([]);
  const [ultimaActualizacion, setUltimaActualizacion] = useState("");
  const [cargandoRango, setCargandoRango] = useState(false);

  // ── Opciones para Selects ─────────────────────────────────────────────
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

  // ── Valores derivados para Selects controlados ────────────────────────
  const valorRegimen =
    REGIMEN_IVA_OPTIONS.find((i) => i.value === form.perfil.regimenIva) ?? null;

  const valorActividad =
    opcionesActividad.find((i) => i.value === form.perfil.actividadEconomica) ??
    null;

  const valorTributos = TRIBUTOS_OPTIONS.filter((i) =>
    toArray(form.perfil.tributos).includes(i.value),
  );

  const valorResponsabilidades = RESPONSABILIDADES_OPTIONS.filter((i) =>
    toArray(form.perfil.responsabilidadesFiscales).includes(i.value),
  );

  // ── Helpers de estado ─────────────────────────────────────────────────
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

  // ── Carga inicial del estado ──────────────────────────────────────────
  /**
   * Llama GET /api/Habilitacion/estado para obtener el estado completo
   * del wizard y posicionar el stepper en el paso correcto.
   * Después carga los datos del perfil para hidratar el formulario.
   */
  const cargarEstado = useCallback(async () => {
    try {
      // 1. Estado global del wizard (para el stepper)
      const { data: estado } = await axiosClient.get("/Habilitacion/estado");

      if (!estado.tieneNegocio) {
        setTieneNegocio(false);
        setEtapaActual(1);
        return;
      }

      setTieneNegocio(true);
      setEtapaActual(PASO_A_ETAPA[estado.pasoActual] ?? 1);

      // 2. Datos del perfil empresa para hidratar formulario
      try {
        const { data: perfil } = await axiosClient.get(
          "/Habilitacion/perfil-empresa",
        );
        setForm((prev) => ({
          ...prev,
          perfil: {
            ...prev.perfil,
            tipoPersona: perfil.tipoPersona || "empresa",
            correoAcceso: perfil.correoAcceso || "",
            tipoIdentificacion: perfil.tipoIdentificacion || "",
            numeroIdentificacion: perfil.numeroIdentificacion || "",
            dv: perfil.dv ?? "",
            nombreComercial: perfil.nombreComercial || "",
            razonSocial: perfil.razonSocial || "",
            nombres: perfil.nombres || "",
            apellidos: perfil.apellidos || "",
            correo: perfil.correo || "",
            direccion: perfil.direccion || "",
            ciudad: perfil.ciudad || "",
            telefono: perfil.telefono || "",
            regimenIva: perfil.regimenIvaCodigo || "",
            actividadEconomica: perfil.actividadEconomicaCIIU || "",
            tributos: perfil.tributos || [],
            responsabilidadesFiscales: perfil.responsabilidadesFiscales || [],
            representanteNombre: perfil.representanteNombre || "",
            representanteApellidos: perfil.representanteApellidos || "",
            representanteTipoId: perfil.representanteTipoId || "",
            representanteNumeroId: perfil.representanteNumeroId || "",
            ciudadExpedicion: perfil.ciudadExpedicion || "",
            ciudadResidencia: perfil.ciudadResidencia || "",
          },
        }));
      } catch {
        // El perfil puede no existir aún si el negocio es nuevo
      }

      // 3. Si ya tenemos resolución, precargar datos del rango para Step 6
      if (estado.tieneResolucion && estado.habitadoEnFactus) {
        cargarRangoActual(false);
      }
    } catch (e) {
      if (e.response?.status === 404) {
        setTieneNegocio(false);
        setEtapaActual(1);
      } else {
        console.error(
          "Error cargando estado habilitación:",
          e.response?.data || e,
        );
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    cargarEstado();
  }, [cargarEstado]);

  // ── Consulta de rango activo (Step 5 & 6) ───────────────────────────
  const cargarRangoActual = useCallback(
    async (actualizarEstadoConsulta = true) => {
      if (actualizarEstadoConsulta) setEstadoConsulta("loading");
      setCargandoRango(true);

      try {
        const { data } = await axiosClient.get("/Habilitacion/rango-actual");

        if (actualizarEstadoConsulta) {
          if (data.prefijo) {
            setEstadoConsulta("success");
            setPrefijosResult([
              {
                prefijo: data.prefijo,
                resolucion: data.rangoDesde + " - " + data.rangoHasta,
                estado: data.estado,
              },
            ]);
          } else {
            setEstadoConsulta("sin_prefijos");
          }
        }

        // Preparar datos para Step 6
        setNumeraciones([
          {
            tipoNumeracion: "Factura electrónica de venta",
            prefijo: data.prefijo || "—",
            numeracionDian: data.factusRangoId?.toString() || "—",
            fechaResolucion: "—",
            rangoNumeracion: `${data.rangoDesde} - ${data.rangoHasta}`,
            proximoNumero:
              data.currentFactus?.toString() ||
              data.rangoDesde?.toString() ||
              "—",
          },
        ]);

        const ahora = new Date();
        setUltimaActualizacion(
          ahora.toLocaleString("es-CO", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        );
      } catch (e) {
        if (actualizarEstadoConsulta) setEstadoConsulta("error");
        console.error("Error consultando rango actual:", e.response?.data || e);
      } finally {
        setCargandoRango(false);
      }
    },
    [],
  );

  // ── Guardadores por etapa ─────────────────────────────────────────────

  /** Etapa 1 — Perfil empresa */
  const guardarEtapa1 = async () => {
    const p = form.perfil;
    await axiosClient.put("/Habilitacion/perfil-empresa", {
      tipoPersona: p.tipoPersona,
      tipoIdentificacion: p.tipoIdentificacion,
      numeroIdentificacion: p.numeroIdentificacion,
      dv: p.dv ? Number(p.dv) : null,
      nombreComercial: p.nombreComercial,
      razonSocial: p.razonSocial,
      nombres: p.nombres,
      apellidos: p.apellidos,
      correo: p.correo,
      direccion: p.direccion,
      ciudad: p.ciudad,
      departamento: "",
      telefono: p.telefono,
      regimenIvaCodigo: p.regimenIva,
      actividadEconomicaCIIU: p.actividadEconomica,
      tributos: toArray(p.tributos),
      responsabilidadesFiscales: toArray(p.responsabilidadesFiscales),
      representanteNombre: p.representanteNombre,
      representanteApellidos: p.representanteApellidos,
      representanteTipoId: p.representanteTipoId,
      representanteNumeroId: p.representanteNumeroId,
      ciudadExpedicion: p.ciudadExpedicion,
      ciudadResidencia: p.ciudadResidencia,
      correoAcceso: p.correoAcceso,
    });
    setTieneNegocio(true);
  };

  /**
   * Etapa 2 — Certificado digital.
   * CORRECCIÓN: antes solo validaba localmente. Ahora llama al backend.
   */
  const guardarEtapa2 = async () => {
    const c = form.certificado;

    if (!c.opcion) {
      throw new Error("Selecciona una opción de certificado para continuar.");
    }

    if (c.opcion === "Nubee" && !c.aceptarExoneracion) {
      throw new Error("Debes aceptar la carta de exoneración para continuar.");
    }

    if (c.opcion === "propio") {
      if (!c.archivoCertificado && !c.nombreArchivo) {
        throw new Error("Debes subir el archivo de certificado (.p12 / .pfx).");
      }
      if (!c.passwordCertificado) {
        throw new Error("Ingresa la contraseña del certificado.");
      }
    }

    await axiosClient.put("/Habilitacion/certificado", {
      opcion: c.opcion === "Nubee" ? "nubee" : "propio",
      nombreArchivo: c.archivoCertificado?.name ?? c.nombreArchivo ?? null,
      passwordCertificado: c.opcion === "propio" ? c.passwordCertificado : null,
      aceptarExoneracion: c.aceptarExoneracion,
      versionCarta: "v1.0",
    });
  };

  /**
   * Etapa 3 — Set de pruebas DIAN.
   * El botón "Enviar" dentro del step lo gestiona onEnviarTestSet.
   * guardarEtapa3 valida que el testSetId esté guardado y avanza.
   */
  const guardarEtapa3 = async () => {
    if (!form.setPruebas.testSetId?.trim()) {
      throw new Error(
        "Ingresa el código del set de pruebas antes de continuar.",
      );
    }
    // Si el usuario no presionó "Enviar" todavía, lo hacemos aquí
    await axiosClient.post("/Habilitacion/test-set", {
      testSetId: form.setPruebas.testSetId,
      resolucionPrueba: form.setPruebas.resolucionPrueba,
    });
  };

  /**
   * Envío explícito del test set desde el botón dentro del Step3.
   * Separado de guardarEtapa3 para permitir el spinner propio del botón.
   */
  const onEnviarTestSet = async () => {
    if (
      !form.setPruebas.testSetId?.trim() ||
      !form.setPruebas.resolucionPrueba?.trim()
    ) {
      setError(
        "Completa el código del set de pruebas y el número de resolución.",
      );
      return;
    }

    limpiarMensajes();
    setEnviandoTestSet(true);
    try {
      await axiosClient.post("/Habilitacion/test-set", {
        testSetId: form.setPruebas.testSetId,
        resolucionPrueba: form.setPruebas.resolucionPrueba,
      });
      setExito("Set de pruebas guardado correctamente.");
    } catch (e) {
      setError(
        e.response?.data?.mensaje ??
          e.message ??
          "Error guardando el set de pruebas.",
      );
    } finally {
      setEnviandoTestSet(false);
    }
  };

  /**
   * Etapa 4 — Resolución DIAN + registro en Factus.
   * CORRECCIÓN: antes estaba completamente comentado.
   */
  const guardarEtapa4 = async () => {
    const n = form.numeracion;

    if (
      !n.numeroAutorizacion ||
      !n.prefijo ||
      !n.rangoDesde ||
      !n.rangoHasta ||
      !n.fechaInicio ||
      !n.fechaFin
    ) {
      throw new Error("Completa todos los campos de la resolución DIAN.");
    }

    // 4a: Guardar la resolución en Nubee
    const { data } = await axiosClient.post("/Habilitacion/resolucion", {
      numeroAutorizacion: n.numeroAutorizacion,
      prefijo: n.prefijo,
      rangoDesde: Number(n.rangoDesde),
      rangoHasta: Number(n.rangoHasta),
      fechaInicio: n.fechaInicio,
      fechaFin: n.fechaFin,
      claveTecnica: n.claveTecnica || "",
      tipoAmbiente: n.tipoAmbiente || "1",
    });

    // 4b: Registrar el rango en Factus automáticamente
    await axiosClient.post("/Habilitacion/registrar-rango", {
      resolucionId: data.resolucionId,
      forzar: false,
    });
  };

  /**
   * Etapa 5 — Consultar prefijos / rango activo.
   * No guarda nada; consulta el estado en Factus y muestra la info.
   */
  const guardarEtapa5 = async () => {
    // Solo consultamos; si ya tenemos datos es suficiente para avanzar
    await cargarRangoActual(true);

    if (estadoConsulta === "error") {
      throw new Error(
        "No se pudo verificar el estado del rango. Intenta de nuevo.",
      );
    }
  };

  /**
   * Etapa 6 — Finalizar habilitación.
   * CORRECCIÓN: antes enviaba { completado: true }; ahora llama sin body
   * porque el backend verifica todo internamente.
   */
  const guardarEtapa6 = async () => {
    await axiosClient.post("/Habilitacion/finalizar");
  };

  // ── Acción principal "Guardar y continuar" ───────────────────────────
  const GUARDADORES = {
    1: guardarEtapa1,
    2: guardarEtapa2,
    3: guardarEtapa3,
    4: guardarEtapa4,
    5: guardarEtapa5,
    6: guardarEtapa6,
  };

  const guardarEtapa = async () => {
    limpiarMensajes();
    setCargando(true);
    try {
      await GUARDADORES[etapaActual]();
      if (etapaActual < 6) {
        setEtapaActual((prev) => prev + 1);
      } else {
        setExito(
          "¡Habilitación completada! Ya puedes emitir facturas electrónicas.",
        );
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
    limpiarMensajes();
  };

  return {
    // Estado del wizard
    etapaActual,
    tieneNegocio,
    form,
    cargando,
    error,
    exito,

    // Datos derivados para Selects
    opcionesCiudades,
    opcionesActividad,
    valorRegimen,
    valorActividad,
    valorTributos,
    valorResponsabilidades,

    // Step 3
    enviandoTestSet,
    onEnviarTestSet,

    // Step 5
    estadoConsulta,
    prefijosResult,
    onConsultarPrefijos: () => cargarRangoActual(true),

    // Step 6
    numeraciones,
    ultimaActualizacion,
    cargandoRango,
    onActualizarRango: () => cargarRangoActual(false),

    // Acciones
    actualizarCampo,
    manejarCambioRegimen,
    guardarEtapa,
    volver,
  };
}
