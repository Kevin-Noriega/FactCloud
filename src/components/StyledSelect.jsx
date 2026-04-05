import React, { useState } from "react";
import Select from "react-select";
import { pseSelectStyles } from "../utils/checkoutUtils";

export default function StyledSelect({ label, error, className = "", ...props }) {
  const [isFocused, setIsFocused] = useState(false);
  const containerClass = className || "pago-input-group";
  const hasValue = props.value && (Array.isArray(props.value) ? props.value.length > 0 : !!props.value);

  return (
    <div className={`${containerClass} ${hasValue || isFocused ? "active" : ""} ${error ? "error" : ""}`}>
      <Select
        {...props}
        onFocus={(e) => {
          setIsFocused(true);
          if (props.onFocus) props.onFocus(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          if (props.onBlur) props.onBlur(e);
        }}
        placeholder={isFocused ? (props.placeholder || "") : ""}
        styles={{
          ...pseSelectStyles,
          ...(props.styles || {}),
          control: (base, state) => ({
            ...pseSelectStyles.control(base, state),
            ...(props.styles?.control?.(base, state) || {}),
          }),
        }}
      />
      {label && <label>{label}</label>}
    </div>
  );
}
