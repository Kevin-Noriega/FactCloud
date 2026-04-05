import React, { useState } from "react";
import { ExclamationCircleFill } from "react-bootstrap-icons";

/**
 * FloatingInput — Reusable input component with floating label
 * @param {string} label - Input label
 * @param {string} error - Error message
 * @param {string} className - Optional container className
 */
const FloatingInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
  className = "",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && value.toString().length > 0;

  // Sync with either "pago-input-group" (Checkout) or a generic one
  const containerClass = className || "pago-input-group";

  return (
    <div className={`${containerClass} ${hasValue || isFocused ? "active" : ""} ${error ? "error" : ""}`}>
      <input
        {...props}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoComplete="off"
      />
      {label && <label>{label}</label>}
      {error && (
        <span className="error-msg">
          <ExclamationCircleFill size={12} />
          {error}
        </span>
      )}
    </div>
  );
};

export default FloatingInput;
