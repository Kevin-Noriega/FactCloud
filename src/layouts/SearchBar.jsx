import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import FactCloudLogo from "../img/logo.png";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "#f1f3f4",
        borderRadius: "999px",
        padding: "6px 12px",
        width: "100%",
        maxWidth: "480px",
      }}
    >
      {/* ICONO BUSCAR */}
      <img
        src={FactCloudLogo}
        alt="FactCloud"
        style={{
          width: "23px",
          height: "22px",
          opacity: 0.9,
        }}
      />

      {/* INPUT */}
      <input
        type="text"
        placeholder="Buscar en FactCloud"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          flex: 1,
          fontSize: "17px",
        }}
      />
    </div>
  );
}
