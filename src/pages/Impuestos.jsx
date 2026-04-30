import React, { useState } from "react";
import { FileEarmarkText } from "react-bootstrap-icons";
import TablaImpuestos from "../components/impuestos/TablaImpuestos";
import TablaAutorretenciones from "../components/impuestos/TablaAutorretenciones";
import "../styles/Impuestos/Impuestos.css";
function Impuestos() {
  const [activeTab, setActiveTab] = useState("impuestos");

  const tabs = [
    { id: "impuestos", label: "Impuestos" },
    { id: "autorretenciones", label: "Autoretenciones" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "impuestos":
        return (
          <div className="tab-content p-4" style={{ height: "100%" }}>
            <TablaImpuestos />
          </div>
        );
      case "autorretenciones":
        return (
          <div className="tab-content p-4" style={{ height: "100%" }}>
            <TablaAutorretenciones />
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
          <h2 className="header-title">Impuestos</h2>
          <div className="header-icon">
            <FileEarmarkText size={50} />
          </div>
        </div>
      </div>

      {/* TABS */}
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

export default Impuestos;
