import React, { useState } from 'react';
import Facturas from './documentosVenta/Facturas';
import NotaCredito from './documentosVenta/NotaCredito';
import NotaDebito from './documentosVenta/NotaDebito';

function DocumentosVenta() {
  const [activeTab, setActiveTab] = useState('factura');

  const tabs = [
    { id: 'factura', label: 'Factura de ventas' },
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
