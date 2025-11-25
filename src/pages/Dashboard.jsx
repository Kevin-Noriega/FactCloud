import React, { useEffect, useState} from "react";
import { API_URL } from "../api/config";
import { Link } from "react-router-dom";
import facturas from "../img/factura.png";
import productos from "../img/productos.png";
import clientes from "../img/clientes.png";
import ganancias from "../img/ganancias.png";
import { ToastContainer } from "react-toastify";

function Dashboard() {
  const [clientesCount, setClientesCount] = useState(0);
  const [productosCount, setProductosCount] = useState(0);
  const [facturasCount, setFacturasCount] = useState(0);
  const [facturasPendientes, setFacturasPendientes] = useState(0);
  const [totalVentas, setTotalVentas] = useState(0);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem("token");
      const [resClientes, resProductos, resFacturas] = await Promise.all([
        fetch(`${API_URL}/clientes`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_URL}/productos`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_URL}/facturas`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const [dataClientes, dataProductos, dataFacturas] = await Promise.all([
        resClientes.json(),
        resProductos.json(),
        resFacturas.json(),
      ]);

      setClientesCount(dataClientes.length);
      setProductosCount(dataProductos.length);
      setFacturasCount(dataFacturas.length);

      const pendientes = dataFacturas.filter(
        (f) => f.estado === "Pendiente" || f.estado === "Emitida"
      ).length;
      setFacturasPendientes(pendientes);

      const total = dataFacturas.reduce((sum, f) => sum + f.totalFactura, 0);
      setTotalVentas(total);

      return pendientes; // Retornamos pendientes para usar después
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("Error al cargar los datos del dashboard");
      return 0;
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4 px-4">
      <div className="row mb-4">
        <div className="col-12">
          <div
            className="card bg-gradient-primary text-white shadow-lg border-0"
            style={{ background: "linear-gradient(135deg, #00a2ff, #025b8f)" }}
          >
            <div className="card-body p-4">
              <h2 className="mb-2">¡Bienvenido a FactCloud! </h2>
              <p className="mb-0">
                Sistema de Facturación Electrónica - Cumplimiento DIAN 2025
              </p>
              <small className="opacity-75">
                {new Date().toLocaleDateString("es-CO", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </small>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total Facturas</p>
                  <h3 className="mb-0 text-primary">{facturasCount}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <img
                    src={facturas}
                    alt="facturas"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
              <Link
                to="/facturas"
                className="btn btn-sm btn-outline-primary mt-3 w-100"
              >
                Ver todas
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Clientes</p>
                  <h3 className="mb-0 text-success">{clientesCount}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                  <img
                    src={clientes}
                    alt="clientes"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
              <Link
                to="/clientes"
                className="btn btn-sm btn-outline-success mt-3 w-100"
              >
                Gestionar
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Productos</p>
                  <h3 className="mb-0 text-warning">{productosCount}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                  <img
                    src={productos}
                    alt="productos"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
              <Link
                to="/productos"
                className="btn btn-sm btn-outline-warning mt-3 w-100"
              >
                Ver inventario
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Ventas Totales</p>
                  <h3 className="mb-0 text-info">
                    ${totalVentas.toLocaleString("es-CO")}
                  </h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                  <img
                    src={ganancias}
                    alt="ganacias"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
              <Link
                to="/reportes"
                className="btn btn-sm btn-outline-info mt-3 w-100"
              >
                Ver reportes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {facturasPendientes > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div
              className="alert alert-warning d-flex align-items-center"
              role="alert"
            >
              <span className="fs-4 me-3">⚠️</span>
              <div>
                <strong>Tienes {facturasPendientes} facturas pendientes</strong>
                <p className="mb-0 small">
                  Recuerda enviarlas a la DIAN dentro de las 48 horas.
                </p>
              </div>
              <Link to="/facturas" className="btn btn-warning btn-sm ms-auto">
                Ver pendientes
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4 mb-4">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0 pt-4">
              <h5 className="mb-0">Tutoriales Rápidos</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <h6 className="text-primary">
                      Cómo crear tu primera factura
                    </h6>
                    <p className="small text-muted mb-2">
                      Aprende a generar facturas electrónicas cumpliendo con la
                      normativa DIAN.
                    </p>
                    <a href="#" className="btn btn-sm btn-outline-primary">
                      Ver tutorial
                    </a>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <h6 className="text-success">Enviar facturas a clientes</h6>
                    <p className="small text-muted mb-2">
                      Configura el envío automático de facturas por correo
                      electrónico.
                    </p>
                    <a href="#" className="btn btn-sm btn-outline-success">
                      Ver tutorial
                    </a>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <h6 className="text-warning">Generar reportes de ventas</h6>
                    <p className="small text-muted mb-2">
                      Consulta estadísticas y reportes detallados de tu negocio.
                    </p>
                    <a href="#" className="btn btn-sm btn-outline-warning">
                      Ver tutorial
                    </a>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <h6 className="text-info">Configurar tu perfil</h6>
                    <p className="small text-muted mb-2">
                      Personaliza la información de tu empresa y datos fiscales.
                    </p>
                    <a href="#" className="btn btn-sm btn-outline-info">
                      Ver tutorial
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0 pt-4">
              <h5 className="mb-0"> Normatividad DIAN</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <a
                  href="https://www.dian.gov.co/normatividad/Normatividad/Resoluci%C3%B3n%20000165%20de%2001-11-2023.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="list-group-item list-group-item-action border-0 px-0"
                >
                  <div className="d-flex align-items-center">
                    <span className="me-2"></span>
                    <div className="flex-grow-1">
                      <p className="mb-0 small fw-bold">
                        Resolución 000165 de 2023
                      </p>
                      <small className="text-muted">
                        Facturación electrónica obligatoria
                      </small>
                    </div>
                  </div>
                </a>

                <a
                  href="https://www.dian.gov.co/Prensa/Paginas/NG-Comunicado-de-Prensa-026-2025.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="list-group-item list-group-item-action border-0 px-0"
                >
                  <div className="d-flex align-items-center">
                    <span className="me-2"></span>
                    <div className="flex-grow-1">
                      <p className="mb-0 small fw-bold">Plazo de 48 horas</p>
                      <small className="text-muted">Para envío a la DIAN</small>
                    </div>
                  </div>
                </a>

                <a
                  href="https://www.dian.gov.co/impuestos/factura-electronica/Documents/Abece-FE-Facturador.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="list-group-item list-group-item-action border-0 px-0"
                >
                  <div className="d-flex align-items-center">
                    <span className="me-2"></span>
                    <div className="flex-grow-1">
                      <p className="mb-0 small fw-bold">Artículo 617 E.T.</p>
                      <small className="text-muted">
                        Requisitos de factura
                      </small>
                    </div>
                  </div>
                </a>

                <a
                  href="https://normograma.dian.gov.co/dian/compilacion/docs/concepto_tributario_dian_0051929_2000.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="list-group-item list-group-item-action border-0 px-0"
                >
                  <div className="d-flex align-items-center">
                    <span className="me-2"></span>
                    <div className="flex-grow-1">
                      <p className="mb-0 small fw-bold">Conservación 5 años</p>
                      <small className="text-muted">
                        Archivo de documentos
                      </small>
                    </div>
                  </div>
                </a>
              </div>

              <a
                href="https://www.dian.gov.co"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-sm w-100 mt-3"
              >
                Ver más en DIAN.gov.co →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-primary mb-3"> ¿Necesitas ayuda?</h6>
              <p className="small text-muted mb-3">
                Consulta nuestra documentación completa o contacta con soporte
                técnico.
              </p>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary">
                  Documentación
                </button>
                <button className="btn btn-sm btn-outline-primary">
                  Soporte
                </button>
                <button className="btn btn-sm btn-outline-primary">
                  Video tutoriales
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-success mb-3">Novedades de FactCloud</h6>
              <ul className="small mb-0">
                <li className="mb-2">Integración con DIAN automática</li>
                <li className="mb-2">Envío masivo de facturas por email</li>
                <li className="mb-2">Reportes avanzados en tiempo real</li>
                <li className="mb-0">Backup automático en la nube</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
