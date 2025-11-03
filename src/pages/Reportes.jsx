import React from 'react';
import useData from '../hooks/useData' // Importamos el hook para acceder a los datos

// Componente de Gráfica de Barras Simplificada
const BarChartSimple = ({ title, labels, data, color }) => (
  <div className="card shadow-sm p-4 h-100">
    <h5 className="card-title text-center text-secondary mb-4">{title}</h5>
    <div className="d-flex flex-column" style={{ height: '300px' }}>
      {labels.map((label, index) => (
        <div key={label} className="d-flex align-items-center mb-2">
          <small style={{ width: '60px' }} className="text-muted me-2 text-end">{label}</small>
          <div className="progress flex-grow-1" style={{ height: '20px' }}>
            <div
              className={`progress-bar bg-${color}`}
              role="progressbar"
              style={{ width: `${data[index]}%` }}
              aria-valuenow={data[index]}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {data[index]}%
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Componente de Gráfica de Dona/Pastel Simplificada (Visualización estática)
const DoughnutChartSimple = ({ title, labels, colors, values, totalLabel }) => {
    // Si values no es un array válido, asumimos un total de 0 para evitar errores.
    const validValues = Array.isArray(values) ? values : [];
    const total = validValues.reduce((sum, current) => sum + current, 0);
    // Evitar división por cero
    const percentages = total > 0 ? validValues.map(val => ((val / total) * 100).toFixed(0)) : validValues.map(() => 0);

    return (
        <div className="card shadow-sm p-4 h-100">
            <h5 className="card-title text-center text-secondary mb-4">{title}</h5>
            <div className="d-flex flex-column align-items-center">
                {/* La visualización de la dona se simulará solo con la leyenda por simplicidad */}
                <div className="legend w-75">
                    {labels.map((label, index) => (
                        <div key={label} className="d-flex justify-content-between align-items-center mb-2">
                            <span className="d-flex align-items-center">
                                <span 
                                    className={`badge bg-${colors[index]} me-2`} 
                                    style={{ width: '10px', height: '10px' }}
                                >
                                    &nbsp;
                                </span>
                                {label}
                            </span>
                            <span className="fw-bold">{percentages[index]}%</span>
                        </div>
                    ))}
                </div>
                <p className="text-muted mt-3 small">{totalLabel}: {total} unidades.</p>
            </div>
        </div>
    );
};

// Nuevo Componente: Gráfica de Línea/Área Simplificada (Muestra tendencia)
const AreaChartSimple = ({ title, labels, data, color }) => {
    // Si data no es un array válido, usamos un array vacío.
    const validData = Array.isArray(data) ? data : [];
    const maxVal = Math.max(...validData);
    
    return (
        <div className="card shadow-sm p-4 h-100">
            <h5 className="card-title text-center text-secondary mb-4">{title}</h5>
            <div className="chart-area" style={{ height: '300px', position: 'relative' }}>
                {/* Eje Y simplificado */}
                <small className="text-muted position-absolute" style={{ top: 0, left: 0 }}>Alto</small>
                <small className="text-muted position-absolute" style={{ bottom: 10, left: 0 }}>Bajo</small>
                
                {/* Simulación del área/línea de tendencia */}
                <div className="d-flex justify-content-around align-items-end h-100 pb-2" style={{ borderBottom: '1px solid #ccc' }}>
                    {validData.map((val, index) => (
                        <div 
                            key={index} 
                            className={`bg-${color} rounded-top`}
                            style={{ 
                                width: '15px', 
                                height: `${(val / (maxVal || 1)) * 90}%`, // Usamos maxVal || 1 para evitar división por cero
                                opacity: 0.7,
                                transition: 'height 0.3s'
                            }}
                            title={`Valor: ${val}`}
                        ></div>
                    ))}
                </div>
                {/* Eje X simplificado */}
                <div className="d-flex justify-content-around mt-1">
                    {labels.map((label, index) => (
                        <small key={index} className="text-muted" style={{ fontSize: '0.7rem' }}>{label}</small>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Componente para la acción de descarga
const DownloadButton = ({ label, format }) => {
    const handleClick = () => {
        alert(`Generando y descargando el reporte: "${label}" en formato ${format}...`);
        window.open('about:blank', '_blank'); 
    };

    return (
        <button 
            className="btn btn-outline-info w-100 d-flex justify-content-between align-items-center mb-2"
            onClick={handleClick}
        >
            <span>{label}</span>
            <span className="badge bg-secondary">{format}</span>
        </button>
    );
};


function Reportes() {
  
  const { data, loading } = useData();

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2 text-info">Cargando indicadores...</p>
      </div>
    );
  }

  // Verificar si data es nulo o no contiene las propiedades esperadas
  if (!data || !data.clientes || !data.productos || !data.facturas) {
     return (
        <div className="alert alert-danger mt-5">
            Error: No se pudieron cargar los datos de la base de datos.
        </div>
     );
  }

  // --- CÁLCULOS BASADOS EN DATOS REALES DE db.json ---
  
  // 1. Datos para la Gráfica de Dona de Clientes
  const totalClientes = data.clientes.length;
  // Simulación: asumimos que el 80% del total de clientes son activos
  const clientesActivos = Math.round(totalClientes * 0.8);
  const clientesInactivos = totalClientes - clientesActivos;

  const clientDoughnutValues = [clientesActivos, clientesInactivos]; 
  const clientDoughnutLabels = [`Clientes Activos (${clientesActivos})`, `Clientes Inactivos (${clientesInactivos})`];
  const clientDoughnutColors = ['primary', 'danger']; 

  // 2. Datos para la Gráfica de Dona de Inventario (Productos)
  const productosActivos = data.productos.filter(p => p.activo).length;
  const productosArchivados = data.productos.filter(p => !p.activo).length;
  const totalProductos = productosActivos + productosArchivados;

  const inventoryDoughnutValues = [productosActivos, productosArchivados]; 
  const inventoryDoughnutLabels = [`Productos Activos (${productosActivos})`, `Productos Archivados (${productosArchivados})`];
  const inventoryDoughnutColors = ['success', 'warning']; 


  // --- DATOS SIMULADOS NO ENCONTRADOS EN DB (Flujo de Caja y Metas) ---
  // Estos datos se mantienen simulados ya que db.json no tiene transacciones históricas o categorías de metas.
  
  // Gráfica de Barras: Cumplimiento de Metas (Simulado)
  const barChartData = [95, 80, 50, 65, 40]; 
  const barChartLabels = ['Hardware', 'Software', 'Servicios', 'Consultoría', 'Licencias'];

  // Gráfica de Área/Línea: Flujo de Caja (Simulado)
  const areaChartData = [100, 120, 90, 150, 110, 180, 160, 200]; // Flujo de caja
  const areaChartLabels = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8']; // Semanas


  return (
    <div className="reports-page">
      <h2 className="mb-4 text-secondary border-bottom pb-2">Generación de Reportes e Indicadores</h2>
      
      <div className="alert alert-info">
        Visualizaciones clave del desempeño de FACTCLOUD.
      </div>

      {/* --- Fila 1 de Gráficas --- */}
      <div className="row g-4 mb-5">
        
        {/* 1. Gráfica de Dona: Estado de Clientes (CON DATOS REALES) */}
        <div className="col-lg-5">
            <DoughnutChartSimple
                title="Estado de la Cartera de Clientes (Basado en DB)"
                labels={clientDoughnutLabels}
                values={clientDoughnutValues}
                colors={clientDoughnutColors}
                totalLabel={`Total de Clientes Registrados: ${totalClientes}`}
            />
        </div>

        {/* 2. Gráfica de Barras: Cumplimiento de Metas (SIMULADO) */}
        <div className="col-lg-7">
            <BarChartSimple
                title="Cumplimiento de Metas por Categoría (Simulado)"
                labels={barChartLabels}
                data={barChartData}
                color="info" 
            />
        </div>
        
      </div>

      {/* --- Fila 2 de Gráficas --- */}
       <div className="row g-4 mb-5">
        
        {/* 3. Gráfica de Dona: Distribución de Inventario (CON DATOS REALES) */}
        <div className="col-lg-5">
            <DoughnutChartSimple
                title="Estado del Inventario (Basado en DB)"
                labels={inventoryDoughnutLabels}
                values={inventoryDoughnutValues}
                colors={inventoryDoughnutColors}
                totalLabel={`Total de Productos Registrados: ${totalProductos}`}
            />
        </div>

        {/* 4. Gráfica de Área/Línea: Flujo de Caja (SIMULADO) */}
        <div className="col-lg-7">
             <AreaChartSimple
                title="Flujo de Caja Semanal (Simulado)"
                labels={areaChartLabels}
                data={areaChartData}
                color="success" 
            />
        </div>
        
      </div>

      {/* --- Opciones de Descarga (Manteniendo la funcionalidad de botón) --- */}
      <div className="card shadow-sm p-4">
        <h4>Opciones de Reporte Detallado (Descarga de Archivos)</h4>
        
        <div className="d-grid gap-2">
            <DownloadButton label="Ventas por Periodo" format="PDF" />
            <DownloadButton label="Inventario Valorizado" format="XLSX" />
            <DownloadButton label="Antigüedad de Cuentas por Cobrar" format="CSV" />
        </div>
        
      </div>
    </div>
  );
}

export default Reportes;
