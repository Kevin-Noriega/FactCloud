// pages/Privacidad.jsx
import { useEffect } from "react";
import "../styles/Legal.css";

const secciones = [
    { id: "p1", titulo: "Responsable del tratamiento" },
    { id: "p2", titulo: "Datos que recopilamos" },
    { id: "p3", titulo: "Finalidades del tratamiento" },
    { id: "p4", titulo: "Base legal" },
    { id: "p5", titulo: "Compartir datos" },
    { id: "p6", titulo: "Transferencias internacionales" },
    { id: "p7", titulo: "Retención de datos" },
    { id: "p8", titulo: "Tus derechos" },
    { id: "p9", titulo: "Cookies" },
    { id: "p10", titulo: "Seguridad" },
    { id: "p11", titulo: "Menores de edad" },
    { id: "p12", titulo: "Cambios en esta política" },
];

export default function Privacidad() {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="legal-page">

            {/* Hero */}
            <div className="legal-hero">
                <span className="legal-hero-badge">Documento legal</span>
                <h1>Política de Privacidad</h1>
                <p className="legal-hero-meta">
                    Última actualización: 1 de enero de 2025 · Nubee S.A.S. · Colombia
                </p>
            </div>

            <div className="legal-layout">

                {/* Sidebar */}
                <aside className="legal-sidebar">
                    <p className="legal-sidebar-title">Contenido</p>
                    <nav className="legal-nav">
                        {secciones.map((s) => (
                            <a key={s.id} href={`#${s.id}`}>{s.titulo}</a>
                        ))}
                    </nav>
                </aside>

                {/* Contenido */}
                <main className="legal-content">

                    <div className="legal-info-box">
                        <strong>Tu privacidad importa:</strong> En Nubee tratamos tus datos personales con
                        total transparencia y cumpliendo la Ley 1581 de 2012 (Habeas Data) y sus decretos
                        reglamentarios. Esta política explica qué datos recopilamos, por qué y cómo los
                        protegemos.
                    </div>

                    {/* 1 */}
                    <section className="legal-section" id="p1">
                        <div className="legal-section-header">
                            <span className="legal-section-num">1</span>
                            <h2>Responsable del tratamiento</h2>
                        </div>
                        <p>
                            El responsable del tratamiento de datos personales es <strong>Nubee S.A.S.</strong>,
                            identificada con NIT [●], con domicilio en Bogotá D.C., Colombia.
                        </p>
                        <p>
                            Para ejercer tus derechos o realizar consultas sobre privacidad, puedes contactarnos en:
                        </p>
                        <ul>
                            <li>Correo electrónico: <strong>privacidad@Nubee.co</strong></li>
                            <li>Dirección: Bogotá D.C., Colombia</li>
                            <li>Teléfono: (605) 123 4567</li>
                        </ul>
                    </section>

                    {/* 2 */}
                    <section className="legal-section" id="p2">
                        <div className="legal-section-header">
                            <span className="legal-section-num">2</span>
                            <h2>Datos que recopilamos</h2>
                        </div>
                        <p>Recopilamos los siguientes tipos de información:</p>

                        <p><strong>Datos de identificación y contacto:</strong></p>
                        <ul>
                            <li>Nombre completo, razón social y NIT o cédula</li>
                            <li>Correo electrónico y número de teléfono</li>
                            <li>Dirección del establecimiento de comercio</li>
                        </ul>

                        <p><strong>Datos de la operación:</strong></p>
                        <ul>
                            <li>Información fiscal: resolución DIAN, prefijo, rango autorizado</li>
                            <li>Datos de clientes y proveedores que registras en el sistema</li>
                            <li>Productos, servicios y precios de tu catálogo</li>
                            <li>Facturas, notas y documentos electrónicos emitidos</li>
                        </ul>

                        <p><strong>Datos técnicos y de uso:</strong></p>
                        <ul>
                            <li>Dirección IP y tipo de navegador</li>
                            <li>Historial de sesiones y actividad en la plataforma</li>
                            <li>Cookies de funcionalidad y analítica</li>
                        </ul>

                        <p><strong>Datos de pago:</strong></p>
                        <ul>
                            <li>Nubee no almacena datos de tarjetas de crédito directamente</li>
                            <li>Los pagos son procesados por pasarelas certificadas (Wompi / PSE)</li>
                        </ul>
                    </section>

                    {/* 3 */}
                    <section className="legal-section" id="p3">
                        <div className="legal-section-header">
                            <span className="legal-section-num">3</span>
                            <h2>Finalidades del tratamiento</h2>
                        </div>
                        <p>Tratamos tus datos personales para:</p>
                        <ul>
                            <li>Prestar el servicio de facturación electrónica contratado</li>
                            <li>Gestionar tu cuenta, suscripción y facturación del servicio</li>
                            <li>Transmitir documentos electrónicos a la DIAN en tu nombre</li>
                            <li>Enviarte notificaciones del sistema, alertas y comunicaciones transaccionales</li>
                            <li>Brindarte soporte técnico y atención al cliente</li>
                            <li>Mejorar la plataforma mediante análisis de uso anonimizado</li>
                            <li>Cumplir obligaciones legales y requerimientos de autoridades</li>
                            <li>Enviarte comunicaciones comerciales sobre nuevas funciones (con opción de cancelación)</li>
                        </ul>
                    </section>

                    {/* 4 */}
                    <section className="legal-section" id="p4">
                        <div className="legal-section-header">
                            <span className="legal-section-num">4</span>
                            <h2>Base legal del tratamiento</h2>
                        </div>
                        <p>El tratamiento de tus datos se sustenta en:</p>
                        <ul>
                            <li><strong>Ejecución del contrato:</strong> para prestarte el servicio contratado</li>
                            <li><strong>Obligación legal:</strong> para cumplir con la normativa de la DIAN y tributaria</li>
                            <li><strong>Consentimiento:</strong> para comunicaciones de marketing (revocable en cualquier momento)</li>
                            <li><strong>Interés legítimo:</strong> para mejorar el servicio y prevenir el fraude</li>
                        </ul>
                        <p>
                            Todo tratamiento se realiza bajo los principios de la Ley 1581 de 2012: legalidad,
                            finalidad, libertad, veracidad, transparencia, acceso y circulación restringida,
                            seguridad y confidencialidad.
                        </p>
                    </section>

                    {/* 5 */}
                    <section className="legal-section" id="p5">
                        <div className="legal-section-header">
                            <span className="legal-section-num">5</span>
                            <h2>Compartir datos con terceros</h2>
                        </div>
                        <p>
                            No vendemos ni arrendamos tus datos personales. Podemos compartirlos únicamente con:
                        </p>
                        <ul>
                            <li><strong>DIAN:</strong> para la transmisión de facturas y documentos electrónicos según la ley</li>
                            <li><strong>Proveedores de infraestructura:</strong> servidores en la nube (Azure) bajo acuerdos de confidencialidad</li>
                            <li><strong>Pasarelas de pago:</strong> Wompi / PSE para procesar transacciones</li>
                            <li><strong>Herramientas de análisis:</strong> datos anonimizados para métricas de uso</li>
                            <li><strong>Autoridades competentes:</strong> cuando sea requerido por orden judicial o legal</li>
                        </ul>
                        <div className="legal-info-box">
                            Todos los terceros que acceden a datos en nombre de Nubee están sujetos a
                            acuerdos de procesamiento de datos que les obligan a proteger tu información.
                        </div>
                    </section>

                    {/* 6 */}
                    <section className="legal-section" id="p6">
                        <div className="legal-section-header">
                            <span className="legal-section-num">6</span>
                            <h2>Transferencias internacionales</h2>
                        </div>
                        <p>
                            Algunos de nuestros proveedores de infraestructura operan fuera de Colombia
                            (principalmente en Estados Unidos mediante Microsoft Azure). Estas transferencias
                            se realizan bajo garantías contractuales adecuadas y cumpliendo los requisitos
                            de la Ley 1581 de 2012 para transferencias internacionales.
                        </p>
                    </section>

                    {/* 7 */}
                    <section className="legal-section" id="p7">
                        <div className="legal-section-header">
                            <span className="legal-section-num">7</span>
                            <h2>Retención de datos</h2>
                        </div>
                        <p>Conservamos tus datos durante los siguientes períodos:</p>
                        <ul>
                            <li><strong>Datos de cuenta activa:</strong> durante toda la vigencia del contrato</li>
                            <li><strong>Documentos electrónicos:</strong> mínimo 5 años según obligación legal tributaria</li>
                            <li><strong>Historial de sesiones:</strong> 12 meses por seguridad</li>
                            <li><strong>Datos tras cancelación:</strong> 90 días para exportación, luego eliminación permanente</li>
                        </ul>
                        <p>
                            Los documentos electrónicos pueden conservarse por más tiempo si así lo exige
                            una normativa fiscal o requerimiento legal específico.
                        </p>
                    </section>

                    {/* 8 */}
                    <section className="legal-section" id="p8">
                        <div className="legal-section-header">
                            <span className="legal-section-num">8</span>
                            <h2>Tus derechos (Habeas Data)</h2>
                        </div>
                        <p>
                            De acuerdo con la Ley 1581 de 2012, tienes derecho a:
                        </p>
                        <ul>
                            <li><strong>Conocer</strong> los datos personales que tenemos sobre ti</li>
                            <li><strong>Actualizar</strong> o corregir datos inexactos o incompletos</li>
                            <li><strong>Solicitar la eliminación</strong> de datos cuando no sean necesarios</li>
                            <li><strong>Revocar el consentimiento</strong> para tratamientos basados en él</li>
                            <li><strong>Presentar quejas</strong> ante la Superintendencia de Industria y Comercio (SIC)</li>
                            <li><strong>Portabilidad:</strong> obtener una copia de tus datos en formato estructurado</li>
                        </ul>
                        <p>
                            Para ejercer cualquiera de estos derechos, envía tu solicitud a{" "}
                            <strong>privacidad@Nubee.co</strong> indicando tu nombre, NIT y el derecho
                            que deseas ejercer. Responderemos en un plazo máximo de 15 días hábiles.
                        </p>
                    </section>

                    {/* 9 */}
                    <section className="legal-section" id="p9">
                        <div className="legal-section-header">
                            <span className="legal-section-num">9</span>
                            <h2>Cookies y tecnologías similares</h2>
                        </div>
                        <p>Nubee utiliza cookies para:</p>
                        <ul>
                            <li><strong>Cookies esenciales:</strong> necesarias para el funcionamiento del sistema (sesión, autenticación)</li>
                            <li><strong>Cookies funcionales:</strong> para recordar tus preferencias de interfaz</li>
                            <li><strong>Cookies analíticas:</strong> para entender cómo se usa la plataforma (datos anonimizados)</li>
                        </ul>
                        <p>
                            Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar
                            el funcionamiento de algunas características del sistema.
                        </p>
                    </section>

                    {/* 10 */}
                    <section className="legal-section" id="p10">
                        <div className="legal-section-header">
                            <span className="legal-section-num">10</span>
                            <h2>Seguridad de los datos</h2>
                        </div>
                        <p>
                            Implementamos medidas técnicas y organizativas para proteger tus datos:
                        </p>
                        <ul>
                            <li>Cifrado TLS/SSL en todas las comunicaciones</li>
                            <li>Contraseñas almacenadas con hash bcrypt</li>
                            <li>Autenticación con tokens JWT y refresh tokens</li>
                            <li>Backups automáticos diarios con retención de 30 días</li>
                            <li>Control de acceso por roles dentro de la plataforma</li>
                            <li>Monitoreo de accesos sospechosos y alertas de seguridad</li>
                            <li>Infraestructura en centros de datos certificados ISO 27001</li>
                        </ul>
                        <div className="legal-warn-box">
                            En caso de detectar una brecha de seguridad que afecte tus datos, te notificaremos
                            en un plazo de 72 horas junto con las medidas adoptadas.
                        </div>
                    </section>

                    {/* 11 */}
                    <section className="legal-section" id="p11">
                        <div className="legal-section-header">
                            <span className="legal-section-num">11</span>
                            <h2>Menores de edad</h2>
                        </div>
                        <p>
                            Nubee no está dirigido a menores de 18 años. No recopilamos intencionadamente
                            datos personales de menores. Si detectas que un menor ha proporcionado datos sin
                            consentimiento parental, contáctanos para eliminarlos de inmediato.
                        </p>
                    </section>

                    {/* 12 */}
                    <section className="legal-section" id="p12">
                        <div className="legal-section-header">
                            <span className="legal-section-num">12</span>
                            <h2>Cambios en esta política</h2>
                        </div>
                        <p>
                            Podemos actualizar esta Política de Privacidad para reflejar cambios en nuestras
                            prácticas o en la normativa aplicable. Los cambios significativos serán notificados
                            por correo electrónico con al menos 15 días de anticipación.
                        </p>
                        <p>
                            La versión más reciente siempre estará disponible en{" "}
                            <strong>Nubee.co/privacidad</strong>. El uso continuado del servicio implica
                            aceptación de la política vigente.
                        </p>
                    </section>

                    {/* Contacto */}
                    <div className="legal-contact">
                        <h3>Contacto de privacidad</h3>
                        <p>Para ejercer tus derechos o consultas sobre el tratamiento de datos:</p>
                        <p>
                            <a href="mailto:privacidad@Nubee.co">privacidad@Nubee.co</a>
                            {" · "}
                            <a href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer">
                                Superintendencia de Industria y Comercio
                            </a>
                        </p>
                    </div>

                </main>
            </div>
        </div>
    );
}