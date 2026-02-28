import { ArrowRight, BookmarkCheck, FileEarmarkText, GraphUpArrow, People } from "react-bootstrap-icons"

export const Tutoriales = () => {
  return (
   <div className="tutorials-section">
             <div className="section-card">
               <div className="section-header">
                 <h5 className="section-title">Tutoriales Rápidos</h5>
               </div>
               <div className="tutorials-grid">
                 <div className="tutorial-card">
                   <div className="tutorial-icon tutorial-icon-primary">
                     <FileEarmarkText size={24} />
                   </div>
                   <div className="tutorial-content">
                     <h6 className="tutorial-title">
                       Cómo crear tu primera factura
                     </h6>
                     <p className="tutorial-description">
                       Aprende a generar facturas electrónicas cumpliendo con la
                       normativa DIAN.
                     </p>
                     <a href="#" className="tutorial-link">
                       Ver tutorial
                       <ArrowRight size={14} className="ms-2" />
                     </a>
                   </div>
                 </div>
   
                 <div className="tutorial-card">
                   <div className="tutorial-icon tutorial-icon-success">
                     <People size={24} />
                   </div>
                   <div className="tutorial-content">
                     <h6 className="tutorial-title">Enviar facturas a clientes</h6>
                     <p className="tutorial-description">
                       Configura el envío automático de facturas por correo
                       electrónico.
                     </p>
                     <a href="#" className="tutorial-link">
                       Ver tutorial
                       <ArrowRight size={14} className="ms-2" />
                     </a>
                   </div>
                 </div>
   
                 <div className="tutorial-card">
                   <div className="tutorial-icon tutorial-icon-warning">
                     <GraphUpArrow size={24} />
                   </div>
                   <div className="tutorial-content">
                     <h6 className="tutorial-title">Generar reportes de ventas</h6>
                     <p className="tutorial-description">
                       Consulta estadísticas y reportes detallados de tu negocio.
                     </p>
                     <a href="#" className="tutorial-link">
                       Ver tutorial
                       <ArrowRight size={14} className="ms-2" />
                     </a>
                   </div>
                 </div>
   
                 <div className="tutorial-card">
                   <div className="tutorial-icon tutorial-icon-info">
                     <BookmarkCheck size={24} />
                   </div>
                   <div className="tutorial-content">
                     <h6 className="tutorial-title">Configurar tu perfil</h6>
                     <p className="tutorial-description">
                       Personaliza la información de tu empresa y datos fiscales.
                     </p>
                     <a href="#" className="tutorial-link">
                       Ver tutorial
                       <ArrowRight size={14} className="ms-2" />
                     </a>
                   </div>
                 </div>
               </div>
             </div>
           </div>
  )
}
