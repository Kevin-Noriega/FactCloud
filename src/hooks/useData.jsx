import React, { useState, useEffect } from 'react';

// Se define la estructura mínima y segura de datos
const emptyData = {
    clientes: [],
    productos: [],
    facturas: [],
};

/**
 * Componente Modal Simple de Bootstrap (implementado dentro del hook para evitar dependencias externas)
 */
// eslint-disable-next-line react-refresh/only-export-components
const ActionModal = ({ show, title, body, record, onConfirm, onClose }) => {
    if (!show) return null;

    // Determina si el modal es de eliminación para cambiar el estilo y los botones
    const isDeletion = title.includes('Eliminar');
    // Determina si es un modal de agregar/edición (solo tienen botón de cerrar)
    const isDetailOrEdit = title.includes('Detalle') || title.includes('Editar') || title.includes('Agregar');

    return (
        // El div principal tiene la clase 'modal d-block' para forzar la visibilidad
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', overflowY: 'auto' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content shadow-lg">
                    <div className="modal-header">
                        <h5 className="modal-title text-primary">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p className={isDeletion ? "text-danger fw-bold" : "text-muted"}>{body}</p>
                        
                        {/* Muestra el contenido del registro si existe */}
                        {record && (
                            <div className="alert alert-light border">
                                <p className="mb-1"><strong>ID:</strong> {record.id}</p>
                                <p className="mb-1"><strong>Nombre/Cliente:</strong> {record.nombre || record.cliente || 'N/A'}</p>
                                {/* Muestra otros campos relevantes en Detalle/Editar */}
                                {record.precio && <p className="mb-1"><strong>Precio:</strong> ${record.precio.toLocaleString('es-CL')}</p>}
                                {record.correo && <p className="mb-1"><strong>Correo:</strong> {record.correo}</p>}
                                {record.telefono && <p className="mb-1"><strong>Teléfono:</strong> {record.telefono}</p>}
                                {record.fecha && <p className="mb-1"><strong>Fecha:</strong> {record.fecha}</p>}
                            </div>
                        )}
                        
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            {isDeletion ? 'Cancelar' : 'Cerrar'}
                        </button>
                        {isDeletion && (
                            <button type="button" className="btn btn-danger" onClick={onConfirm}>
                                Eliminar Permanentemente
                            </button>
                        )}
                        {/* Botón de guardar/actualizar simulado para Detalle/Editar */}
                        {isDetailOrEdit && !isDeletion && (
                             <button 
                                 type="button" 
                                 className="btn btn-primary" 
                                 onClick={() => {
                                     console.log(`[SIMULACIÓN] Guardando cambios para ${record.id}`);
                                     onClose(); // Cerrar al simular guardar
                                 }}
                             >
                                Guardar
                             </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


/**
 * Hook para simular la carga asíncrona de datos desde una fuente
 * @param {string} [entity] - Opcional. Nombre de la entidad a devolver ('clientes', 'productos', 'facturas').
 * @returns {object} { data: object|array, loading: boolean, handleAction: function, ModalComponent: React.Component }
 */
const useData = (entity) => {
    // ⚠️ Inicializamos data con la estructura mínima vacía para prevenir errores de desestructuración
    const [allData, setAllData] = useState(emptyData);
    const [loading, setLoading] = useState(true);

    // Estado para el modal
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const [pendingAction, setPendingAction] = useState(null);

    const closeModal = () => {
        setShowModal(false);
        setPendingAction(null);
    };

    // Función que realmente ejecuta la acción (solo para eliminación)
    const executePendingAction = () => {
        if (!pendingAction) return;

        const { id, type, recordType } = pendingAction;
        
        // Ejecución de la eliminación
        setAllData(prevData => ({
            ...prevData,
            [type]: prevData[type].filter(r => r.id !== id),
        }));
        
        console.warn(`[ACCIÓN EJECUTADA] Registro ID ${id} de ${recordType} ELIMINADO de la lista.`);
        closeModal();
    };

    /**
     * Función para simular acciones (Editar, Eliminar, Archivar)
     *
     * @param {string | number} idOrType - Puede ser el ID del registro O el tipo de entidad (ej: 'clientes').
     * @param {string} action - La acción a ejecutar ('Editar', 'Eliminar', 'Agregar', etc.).
     * @param {string} recordType - El tipo de registro (ej: 'Cliente', 'Producto').
     */
    const handleAction = (idOrType, action, recordType) => {
        let success = false;
        let message = '';
        
        // 1. Determinar si es una acción genérica (Agregar) o específica (Detalle/Eliminar)
        let type = recordType.toLowerCase();
        let id = typeof idOrType === 'number' ? idOrType : (typeof idOrType === 'string' && idOrType.match(/^\d+$/) ? parseInt(idOrType, 10) : null);
        
        // 2. Buscar el payload real
        let payload = {};
        if (id !== null && allData[type]) {
             payload = allData[type].find(r => r.id === id) || {};
        }

        switch (action) {
            case 'Detalle':
            case 'Editar':
                // Muestra modal de detalle/edición
                setModalContent({
                    title: `${action} ${recordType} ID ${id}`,
                    body: action === 'Editar' ? `Simulación de formulario de edición para el ${recordType.toLowerCase()}.` : `Vista de detalle para el ${recordType.toLowerCase()}.`,
                    record: payload,
                });
                setShowModal(true);
                success = true;
                break;
            
            case 'Eliminar':
                if (id !== null && allData[type]) {
                    // Muestra modal de confirmación
                    setModalContent({
                        title: `Confirmar Eliminación de ${recordType}`,
                        body: `¿Estás seguro de que deseas eliminar permanentemente a ${payload.nombre || payload.cliente || `el registro ID ${id}`}? Esta acción no se puede deshacer.`,
                        record: payload,
                    });
                    setPendingAction({ id, type, recordType });
                    setShowModal(true);
                    success = true;
                } else {
                    message = `No se pudo encontrar el registro ${id} para eliminar.`;
                }
                break;
                
            case 'Agregar':
                // Muestra modal de agregar
                setModalContent({
                    title: `Agregar Nuevo ${recordType}`,
                    body: `Aquí se mostraría el formulario para crear un nuevo ${recordType.toLowerCase()}. Simulemos el guardado.`,
                });
                setShowModal(true);
                success = true;
                break;

            case 'Archivar':
            case 'Desarchivar':
                // Esta acción se ejecuta directamente sin modal
                if (recordType === 'Producto' && id !== null) {
                    const isArchiving = action === 'Archivar';
                    const activeState = !isArchiving;
                    
                    setAllData(prevData => ({
                        ...prevData,
                        productos: prevData.productos.map(p =>
                            p.id === id ? { ...p, activo: activeState } : p
                        ),
                    }));
                    success = true;
                    message = `Producto ID ${id} ha sido ${action}do.`;
                }
                break;

            case 'PDF':
                // Simulación de generación de PDF
                window.open('about:blank', '_blank');
                success = true;
                message = 'Generando PDF en nueva ventana.';
                break;
                
            default:
                message = 'Acción no reconocida.';
        }

        if (success) {
            console.log(`[ACCIÓN EXITOSA] ${message}`);
        } else {
            console.warn(`[ACCIÓN FALLIDA] ${message || 'Acción cancelada.'}`);
        }
    };

    useEffect(() => {
        // Carga de datos simulada
        const fullData = {
            clientes: [
                { id: 1, nombre: 'Carlos Pérez', activo: true, correo: 'carlos@mail.com', telefono: '555-1001' },
                { id: 2, nombre: 'Ana Gómez', activo: true, correo: 'ana@mail.com', telefono: '555-1002' },
                { id: 3, nombre: 'Felipe Díaz', activo: false, correo: 'felipe@mail.com', telefono: '555-1003' },
                { id: 4, nombre: 'Sofía Castro', activo: true, correo: 'sofia@mail.com', telefono: '555-1004' },
            ],
            productos: [
                { id: 101, nombre: 'Laptop Dell', activo: true, precio: 3000000 },
                { id: 102, nombre: 'Monitor Samsung', activo: true, precio: 950000 },
                { id: 103, nombre: 'Licencia MS Office', activo: false, precio: 500000 },
                { id: 104, nombre: 'Servicio de Hosting', activo: true, precio: 150000 },
            ],
            facturas: [
                { id: 1001, cliente: 'Carlos Pérez', total: 3000000, fecha: '2024-05-01' },
                { id: 1002, cliente: 'Ana Gómez', total: 950000, fecha: '2024-05-15' },
                { id: 1003, cliente: 'Sofía Castro', total: 150000, fecha: '2024-06-01' },
            ],
        };
            
        setAllData(fullData);
        setLoading(false);

    }, []);
    
    // Devolvemos el array específico si se pide, sino devolvemos todo el objeto data
    const records = entity ? allData[entity] || [] : allData;

    // El hook debe devolver el componente Modal para que sea renderizado en la App
    const ModalComponent = () => (
        <ActionModal 
            show={showModal} 
            title={modalContent.title || 'Acción'} 
            body={modalContent.body || ''} 
            record={modalContent.record}
            onConfirm={executePendingAction} 
            onClose={closeModal} 
        />
    );

    // Devolvemos el array, la función de acción, y el componente Modal para ser usado en las páginas
    return { records, loading, handleAction, ModalComponent };
};

export default useData;
