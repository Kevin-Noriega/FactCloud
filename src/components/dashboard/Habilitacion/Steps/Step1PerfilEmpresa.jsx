// steps/Step1PerfilEmpresa.jsx
import Select from "react-select";
import TiposDocumentos from "../../../../utils/TiposDocumentos.json";
import {
  REGIMEN_IVA_OPTIONS,
  TRIBUTOS_OPTIONS,
  RESPONSABILIDADES_OPTIONS,
} from "../constants";

export default function Step1PerfilEmpresa({
  form,
  actualizarCampo,
  manejarCambioRegimen,
  opcionesCiudades,
  opcionesActividad,
  valorRegimen,
  valorActividad,
  valorTributos,
  valorResponsabilidades,
}) {
  const p = form.perfil;

  return (
    <div className="fe-step-view">
      <p className="fe-step-helper mb-3">
        Diligencia la información que tienes registrada ante la DIAN. Debe
        corresponder a la información de tu RUT.
      </p>

      {/* Selector de tipo de persona */}
      <div className="fe-type-switch mb-3">
        {[
          { id: "tipoEmpresa", val: "empresa", label: "Empresa" },
          {
            id: "tipoNatural",
            val: "persona_natural",
            label: "Persona natural",
          },
        ].map(({ id, val, label }) => (
          <div className="form-check form-check-inline" key={val}>
            <input
              className="form-check-input"
              type="radio"
              name="tipoPersona"
              id={id}
              checked={p.tipoPersona === val}
              onChange={() => actualizarCampo("perfil", "tipoPersona", val)}
            />
            <label className="form-check-label" htmlFor={id}>
              {label}
            </label>
          </div>
        ))}
      </div>

      <div className="row g-3 fe-row-tight">
        {/* ── Columna izquierda ── */}
        <div className="col-lg-6">
          {/* Datos de acceso */}
          <div className="fe-block-card fe-block-card-tight">
            <h6 className="section-title-primary">Datos de acceso</h6>
            <div className="row g-2">
              <div className="col-12">
                <label className="form-label">
                  Correo acceso a Proveedor Tecnológico *
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={p.correoAcceso || ""}
                  onChange={(e) =>
                    actualizarCampo("perfil", "correoAcceso", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Información básica */}
          <div className="fe-block-card fe-block-card-tight mt-3">
            <h6 className="section-title-primary">Información básica</h6>
            <div className="row g-2">
              {/* Tipo de identificación */}
              <div className="col-md-5">
                <label className="form-label">Tipo de identificación *</label>
                <select
                  className="form-select"
                  value={p.tipoIdentificacion}
                  onChange={(e) =>
                    actualizarCampo(
                      "perfil",
                      "tipoIdentificacion",
                      e.target.value,
                    )
                  }
                >
                  <option value="">Seleccione un tipo</option>
                  {TiposDocumentos.map((t) => (
                    <option key={t.codigo} value={t.codigo}>
                      {t.nombre} ({t.sigla})
                    </option>
                  ))}
                </select>
              </div>

              {/* Número de identificación */}
              <div
                className={`col-md-${p.tipoPersona === "empresa" ? "5" : "6"}`}
              >
                <label className="form-label">Número de identificación *</label>
                <input
                  type="text"
                  className="form-control"
                  value={p.numeroIdentificacion}
                  onChange={(e) =>
                    actualizarCampo(
                      "perfil",
                      "numeroIdentificacion",
                      e.target.value,
                    )
                  }
                />
              </div>

              {/* DV — solo para empresa */}
              {p.tipoPersona === "empresa" && (
                <div className="col-md-2">
                  <label className="form-label">DV *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={p.dv}
                    onChange={(e) =>
                      actualizarCampo("perfil", "dv", e.target.value)
                    }
                  />
                </div>
              )}

              {/* Nombres — solo para persona natural */}
              {p.tipoPersona === "persona_natural" && (
                <>
                  <div className="col-md-6">
                    <label className="form-label">Nombres *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={p.nombres || ""}
                      onChange={(e) =>
                        actualizarCampo("perfil", "nombres", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Apellidos *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={p.apellidos || ""}
                      onChange={(e) =>
                        actualizarCampo("perfil", "apellidos", e.target.value)
                      }
                    />
                  </div>
                </>
              )}

              {/* Nombre comercial */}
              <div className="col-md-6">
                <label className="form-label">Nombre comercial</label>
                <input
                  type="text"
                  className="form-control"
                  value={p.nombreComercial}
                  onChange={(e) =>
                    actualizarCampo("perfil", "nombreComercial", e.target.value)
                  }
                />
              </div>

              {/* Razón social — solo empresa */}
              {p.tipoPersona === "empresa" && (
                <div className="col-12">
                  <label className="form-label">Razón social *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={p.razonSocial}
                    onChange={(e) =>
                      actualizarCampo("perfil", "razonSocial", e.target.value)
                    }
                  />
                </div>
              )}

              <div className="col-md-6">
                <label className="form-label">Correo electrónico *</label>
                <input
                  type="email"
                  className="form-control"
                  value={p.correo}
                  onChange={(e) =>
                    actualizarCampo("perfil", "correo", e.target.value)
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Dirección *</label>
                <input
                  type="text"
                  className="form-control"
                  value={p.direccion}
                  onChange={(e) =>
                    actualizarCampo("perfil", "direccion", e.target.value)
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Ciudad *</label>
                <Select
                  options={opcionesCiudades}
                  isClearable
                  isSearchable
                  value={
                    opcionesCiudades.find((o) => o.value === p.ciudad) || null
                  }
                  onChange={(o) =>
                    actualizarCampo("perfil", "ciudad", o?.value || "")
                  }
                  placeholder="Seleccione una ciudad"
                  classNamePrefix="fe-select"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Teléfono *</label>
                <input
                  type="text"
                  className="form-control"
                  value={p.telefono}
                  onChange={(e) =>
                    actualizarCampo("perfil", "telefono", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Columna derecha ── */}
        <div className="col-lg-6">
          {/* Datos tributarios */}
          <div className="fe-block-card fe-block-card-tight">
            <h6 className="section-title-primary">Datos tributarios</h6>
            <p className="fe-section-note mb-3">
              Estos datos los encuentras en tu RUT, casilla 53.
            </p>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Tipo de régimen de IVA *</label>
                <Select
                  options={REGIMEN_IVA_OPTIONS}
                  value={valorRegimen}
                  onChange={manejarCambioRegimen}
                  isClearable
                  isSearchable
                  placeholder="Seleccione el régimen"
                  classNamePrefix="fe-select"
                  noOptionsMessage={() => "No hay opciones"}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  Código de actividad económica *
                </label>
                <Select
                  options={opcionesActividad}
                  value={valorActividad}
                  onChange={(o) =>
                    actualizarCampo(
                      "perfil",
                      "actividadEconomica",
                      o?.value || "",
                    )
                  }
                  isClearable
                  isSearchable
                  placeholder="Seleccione la actividad"
                  classNamePrefix="fe-select"
                  noOptionsMessage={() => "No se encontraron actividades"}
                  filterOption={(opt, input) => {
                    const s = input.toLowerCase();
                    return (
                      opt.label.toLowerCase().includes(s) ||
                      opt.value.toLowerCase().includes(s)
                    );
                  }}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Tributos *</label>
                <Select
                  isMulti
                  closeMenuOnSelect={false}
                  options={TRIBUTOS_OPTIONS}
                  value={valorTributos}
                  onChange={(ops) =>
                    actualizarCampo(
                      "perfil",
                      "tributos",
                      (ops || []).map((i) => i.value),
                    )
                  }
                  placeholder="Seleccione tributos"
                  classNamePrefix="fe-select"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  Responsabilidades fiscales *
                </label>
                <Select
                  isMulti
                  closeMenuOnSelect={false}
                  options={RESPONSABILIDADES_OPTIONS}
                  value={valorResponsabilidades}
                  onChange={(ops) =>
                    actualizarCampo(
                      "perfil",
                      "responsabilidadesFiscales",
                      (ops || []).map((i) => i.value),
                    )
                  }
                  placeholder="Seleccione responsabilidades"
                  classNamePrefix="fe-select"
                />
              </div>
            </div>
          </div>

          {/* Representante legal — solo empresa */}
          {p.tipoPersona === "empresa" && (
            <div className="fe-block-card fe-block-card-tight mt-3">
              <h6 className="section-title-primary">
                Datos del representante legal
              </h6>
              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label">Nombre *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={p.representanteNombre}
                    onChange={(e) =>
                      actualizarCampo(
                        "perfil",
                        "representanteNombre",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Apellidos *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={p.representanteApellidos}
                    onChange={(e) =>
                      actualizarCampo(
                        "perfil",
                        "representanteApellidos",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="col-md-5">
                  <label className="form-label">Tipo de identificación *</label>
                  <select
                    className="form-select"
                    value={p.representanteTipoId}
                    onChange={(e) =>
                      actualizarCampo(
                        "perfil",
                        "representanteTipoId",
                        e.target.value,
                      )
                    }
                  >
                    <option value="">Seleccione</option>
                    {TiposDocumentos.map((t) => (
                      <option key={t.codigo} value={t.codigo}>
                        {t.nombre} ({t.sigla})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    Número de identificación *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={p.representanteNumeroId}
                    onChange={(e) =>
                      actualizarCampo(
                        "perfil",
                        "representanteNumeroId",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Ciudad de expedición *</label>
                  <Select
                    options={opcionesCiudades}
                    isClearable
                    isSearchable
                    value={
                      opcionesCiudades.find(
                        (o) => o.value === p.ciudadExpedicion,
                      ) || null
                    }
                    onChange={(o) =>
                      actualizarCampo(
                        "perfil",
                        "ciudadExpedicion",
                        o?.value || "",
                      )
                    }
                    placeholder="Seleccione ciudad"
                    classNamePrefix="fe-select"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Ciudad de residencia *</label>
                  <Select
                    options={opcionesCiudades}
                    isClearable
                    isSearchable
                    value={
                      opcionesCiudades.find(
                        (o) => o.value === p.ciudadResidencia,
                      ) || null
                    }
                    onChange={(o) =>
                      actualizarCampo(
                        "perfil",
                        "ciudadResidencia",
                        o?.value || "",
                      )
                    }
                    placeholder="Seleccione ciudad"
                    classNamePrefix="fe-select"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
