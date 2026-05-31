import React, { useRef } from "react";

/**
 * FloatingInput — input con label flotante (borde completo redondeado)
 * Mismo estilo que el registro, listo para usar en NuevoClienteEmpresa.
 *
 * Props:
 *  label        — texto del label
 *  error        — string de error (opcional)
 *  className    — clase extra al wrapper
 *  todas las props nativas de <input> (name, value, onChange, type, etc.)
 */
export default function FloatingInput({
  label,
  error,
  className = "",
  ...inputProps
}) {
  const hasValue =
    inputProps.value !== undefined
      ? String(inputProps.value).length > 0
      : false;

  return (
    <div
      className={`fi-wrapper${hasValue ? " active" : ""}${error ? " error" : ""} ${className}`}
    >
      <input {...inputProps} placeholder=" " className="fi-input" />
      <label className="fi-label">{label}</label>
      {error && <span className="fi-error">{error}</span>}
    </div>
  );
}
