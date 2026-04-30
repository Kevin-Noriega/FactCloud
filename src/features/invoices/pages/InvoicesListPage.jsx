import React, { useState } from "react";
import { FileEarmarkText } from "react-bootstrap-icons";
import DocumentosVenta from "../../../components/ventas/DocumentosVenta";

function Ventas() {
  const [activeTab, setActiveTab] = useState("documentos");

  const tabs = [
    { id: "documentos", label: "Documentos de venta" },
    { id: "recaudos", label: "Recaudos" },
    { id: "impresion", label: "Impresión y envío masivo" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "documentos":
        return (
          <div className="tab-content p-4" style={{ height: "100%" }}>
            <DocumentosVenta />
          </div>
        );

      case "recaudos":
        return (
          <div className="tab-content p-4" style={{ height: "100%" }}>
            <h4>Recaudos</h4>
            <p>Gestiona los pagos recibidos y pendientes.</p>
          </div>
        );

      case "impresion":
        return (
          <div className="tab-content p-4" style={{ height: "100%" }}>
            <h4>Impresión y envío masivo de comprobantes</h4>
            <p>Selecciona los documentos que deseas imprimir o enviar.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="container-fluid d-flex flex-column"
      style={{ minHeight: "100vh" }}
    >
      {/* HEADER */}
      <div className="header-card mb-3 px-4">
        <div className="header-content d-flex justify-content-between align-items-center">
          <h2 className="header-title">Ventas</h2>

          <div className="header-icon">
            <FileEarmarkText size={50} />
          </div>
        </div>
      </div>

      {/* BOTONES TABS */}
      <div className="menu-tabs px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`menu-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENIDO */}
      <div style={{ flex: 1 }}>{renderContent()}</div>
    </div>
  );
}

export default Ventas;
