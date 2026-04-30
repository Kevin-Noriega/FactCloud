import React, { useState } from 'react';
import Facturas from './documentosVenta/Facturas';
import NotaCredito from './documentosVenta/NotaCredito';
import NotaDebito from './documentosVenta/NotaDebito';
import DocumentoEquivalentePOS from './documentosVenta/DocumentoEquivalentePOS';

function DocumentosVenta() {
  const [activeTab, setActiveTab] = useState('factura');

  const tabs = [
    { id: 'factura', label: 'Factura de ventas' },
    { id: 'pos', label: 'Documento Equivalente (POS)' },
    { id: 'notaCredito', label: 'Nota crédito' },
    { id: 'notaDebito', label: 'Nota dédito' }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'factura':
        return <div className="item-content pt-5">
            <Facturas/>
        </div>;
      case 'notaCredito':
        return <div className="item-content pt-5">
            <NotaCredito/>
        </div>;
      case 'notaDebito':
        return <div className="item-content pt-5">
            <NotaDebito/>
        </div>;
      case 'pos':
        return <div className="item-content pt-5">
            <DocumentoEquivalentePOS/>
        </div>;
      default:
        return null;
    }
  };

  return (
    <div className="container-menu-acceso px-3">

      {/* TABS SIIGO */}
      <div className="items-acceso">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`item-acceso ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENIDO ABAJO */}
      {renderContent()}
    </div>
  );
}

export default DocumentosVenta;
