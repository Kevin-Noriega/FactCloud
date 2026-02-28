import React, { useState } from 'react'
import { BagDash} from 'react-bootstrap-icons';
import DocumentosSoporte from '../components/comprasGastos/DocumentoSoporte';

function ComprasGastos (){
    const [activeTab, setActiveTab] = useState('documento');

  // NOMBRES LITERALES COMO SIIGO
  const tabs = [
    { id: 'documento', label: 'Documento Soporte' },
    { id: 'registros', label: 'Registro de eventos' },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'documento':
        return (
          <div className="tab-content p-4">
            <DocumentosSoporte/>
          </div>
        );

      case 'registros':
        return (
          <div className="tab-content p-4">
            <h4>Registro de eventos</h4>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container-fluid px-4">

      {/* HEADER */}
      <div className="header-card mb-3 px-4">
        <div className="header-content d-flex justify-content-between align-items-center">

            <h2 className="header-title">Compras y gastos
            </h2>

          <div className="header-icon">
            <BagDash size={50} />
          </div>

        </div>
      </div>

      {/* BOTONES TABS */}
      <div className="menu-tabs px-4">

        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`menu-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}

      </div>

      {/* CONTENIDO */}
      {renderContent()}

    </div>
  )
}
export default ComprasGastos;