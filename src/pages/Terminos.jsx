// pages/Terminos.jsx
import { useEffect } from "react";
import "../styles/Legal.css";

const secciones = [
    { id: "s1", titulo: "Aceptación de términos" },
    { id: "s2", titulo: "Descripción del servicio" },
    { id: "s3", titulo: "Registro y cuenta" },
    { id: "s4", titulo: "Planes y facturación" },
    { id: "s5", titulo: "Uso aceptable" },
    { id: "s6", titulo: "Propiedad intelectual" },
    { id: "s7", titulo: "Limitación de responsabilidad" },
    { id: "s8", titulo: "Modificaciones" },
    { id: "s9", titulo: "Terminación" },
    { id: "s10", titulo: "Legislación aplicable" },
];

export default function Terminos() {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="legal-page">

            {/* Hero */}
            <div className="legal-hero">
                <span className="legal-hero-badge">Documento legal</span>
                <h1>Términos y Condiciones</h1>
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
                        <strong>Importante:</strong> Al acceder o usar Nubee, aceptas estos Términos y
                        Condiciones en su totalidad. Si no estás de acuerdo con alguna parte, no debes usar
                        el servicio.
                    </div>

                    {/* 1 */}
                    <section className="legal-section" id="s1">
                        <div className="legal-section-header">
                            <span className="legal-section-num">1</span>
                            <h2>Aceptación de términos</h2>
                        </div>
                        <p>
                            Estos Términos y Condiciones ("Términos") constituyen un acuerdo legalmente
                            vinculante entre usted ("Usuario") y <strong>Nubee S.A.S.</strong>, empresa
                            constituida bajo las leyes de la República de Colombia, con domicilio en Bogotá D.C.
                        </p>
                        <p>
                            Al crear una cuenta, acceder o utilizar cualquier función de la plataforma Nubee,
                            usted declara tener capacidad legal para celebrar contratos y acepta cumplir con estos
                            Términos, nuestra Política de Privacidad y cualquier directriz adicional publicada en
                            la plataforma.
                        </p>
                        <p>
                            El uso del servicio por parte de menores de 18 años requiere supervisión y
                            autorización expresa de un representante legal.
                        </p>
                    </section>

                    {/* 2 */}
                    <section className="legal-section" id="s2">
                        <div className="legal-section-header">
                            <span className="legal-section-num">2</span>
                            <h2>Descripción del servicio</h2>
                        </div>
                        <p>
                            Nubee es una plataforma SaaS (Software como Servicio) de facturación electrónica
                            y gestión empresarial diseñada para cumplir con los requisitos establecidos por la
                            Dirección de Impuestos y Aduanas Nacionales (DIAN) de Colombia.
                        </p>
                        <p>El servicio incluye, entre otras funcionalidades:</p>
                        <ul>
                            <li>Emisión de facturas electrónicas validadas ante la DIAN</li>
                            <li>Generación de notas crédito, notas débito y documentos soporte</li>
                            <li>Gestión de clientes, proveedores y productos/servicios</li>
                            <li>Reportes de ventas y análisis de facturación</li>
                            <li>Búsqueda global unificada dentro del sistema</li>
                            <li>Almacenamiento de documentos en la nube</li>
                        </ul>
                        <p>
                            Nubee se reserva el derecho de modificar, suspender o discontinuar cualquier
                            aspecto del servicio con previo aviso de 30 días, salvo en casos de emergencia técnica
                            o cumplimiento normativo.
                        </p>
                    </section>

                    {/* 3 */}
                    <section className="legal-section" id="s3">
                        <div className="legal-section-header">
                            <span className="legal-section-num">3</span>
                            <h2>Registro y cuenta</h2>
                        </div>
                        <p>
                            Para acceder a las funciones del servicio, debe registrarse y crear una cuenta
                            proporcionando información precisa, completa y actualizada. Usted es responsable de:
                        </p>
                        <ul>
                            <li>Mantener la confidencialidad de sus credenciales de acceso</li>
                            <li>Todas las actividades realizadas bajo su cuenta</li>
                            <li>Notificar a Nubee inmediatamente ante cualquier uso no autorizado</li>
                            <li>Mantener actualizados los datos de su perfil y negocio</li>
                        </ul>
                        <p>
                            Nubee no será responsable de pérdidas causadas por el uso no autorizado de su
                            cuenta cuando dicho uso resulte de su incumplimiento de las obligaciones de seguridad.
                        </p>
                        <div className="legal-info-box">
                            <strong>Una cuenta por negocio:</strong> Cada cuenta corresponde a un único NIT o
                            número de identificación fiscal. El uso compartido de credenciales entre distintos
                            contribuyentes está prohibido.
                        </div>
                    </section>

                    {/* 4 */}
                    <section className="legal-section" id="s4">
                        <div className="legal-section-header">
                            <span className="legal-section-num">4</span>
                            <h2>Planes y facturación</h2>
                        </div>
                        <p>
                            Nubee ofrece diferentes planes de suscripción con distintas capacidades de
                            documentos electrónicos anuales y funcionalidades. Los precios vigentes se
                            encuentran publicados en <strong>Nubee.co/planes</strong>.
                        </p>
                        <ul>
                            <li>Los pagos se procesan en pesos colombianos (COP)</li>
                            <li>Las suscripciones anuales se cobran por adelantado</li>
                            <li>Los complementos (add-ons) se facturan junto a la suscripción principal</li>
                            <li>No se realizan reembolsos por períodos parcialmente utilizados</li>
                            <li>Los precios pueden cambiar con previo aviso de 30 días</li>
                        </ul>
                        <p>
                            El impuesto al valor agregado (IVA) aplicable a los servicios de software se añadirá
                            al precio base según la normativa fiscal colombiana vigente.
                        </p>
                        <div className="legal-warn-box">
                            <strong>Mora en el pago:</strong> El incumplimiento en el pago puede resultar en la
                            suspensión temporal del acceso hasta que la deuda sea saldada. Los datos se conservan
                            por 90 días adicionales tras la suspensión.
                        </div>
                    </section>

                    {/* 5 */}
                    <section className="legal-section" id="s5">
                        <div className="legal-section-header">
                            <span className="legal-section-num">5</span>
                            <h2>Uso aceptable</h2>
                        </div>
                        <p>
                            El uso de Nubee debe ajustarse a la legislación colombiana e internacional
                            aplicable. Está expresamente prohibido:
                        </p>
                        <ul>
                            <li>Emitir facturas con información falsa o fraudulenta</li>
                            <li>Usar el sistema para evasión fiscal o lavado de activos</li>
                            <li>Intentar acceder a cuentas o datos de otros usuarios</li>
                            <li>Realizar ingeniería inversa, descompilar o copiar el software</li>
                            <li>Automatizar accesos no autorizados (scraping, bots maliciosos)</li>
                            <li>Revender el acceso al servicio sin autorización escrita</li>
                            <li>Cargar contenido que infrinja derechos de terceros</li>
                        </ul>
                        <p>
                            El incumplimiento puede resultar en la terminación inmediata de la cuenta sin
                            derecho a reembolso y en acciones legales correspondientes.
                        </p>
                    </section>

                    {/* 6 */}
                    <section className="legal-section" id="s6">
                        <div className="legal-section-header">
                            <span className="legal-section-num">6</span>
                            <h2>Propiedad intelectual</h2>
                        </div>
                        <p>
                            Todo el software, código fuente, diseños, logotipos, textos y demás elementos de
                            Nubee son propiedad exclusiva de Nubee S.A.S. o sus licenciantes, protegidos
                            por las leyes de propiedad intelectual de Colombia y tratados internacionales.
                        </p>
                        <p>
                            Se le otorga una licencia limitada, no exclusiva, intransferible y revocable para
                            usar el servicio exclusivamente para sus fines comerciales legítimos.
                        </p>
                        <p>
                            Usted conserva la propiedad de todos los datos e información que ingrese en la
                            plataforma. Nubee obtiene una licencia limitada para procesar dichos datos
                            únicamente con el fin de prestar el servicio.
                        </p>
                    </section>

                    {/* 7 */}
                    <section className="legal-section" id="s7">
                        <div className="legal-section-header">
                            <span className="legal-section-num">7</span>
                            <h2>Limitación de responsabilidad</h2>
                        </div>
                        <p>
                            En la máxima medida permitida por la ley, Nubee no será responsable por:
                        </p>
                        <ul>
                            <li>Daños indirectos, incidentales o consecuentes</li>
                            <li>Pérdida de datos causada por errores del usuario</li>
                            <li>Interrupciones del servicio por causas de fuerza mayor</li>
                            <li>Decisiones fiscales o legales tomadas basándose en los reportes del sistema</li>
                            <li>Cambios normativos de la DIAN no reflejados aún en el sistema</li>
                        </ul>
                        <p>
                            La responsabilidad total máxima de Nubee en ningún caso superará el monto
                            pagado por el usuario en los últimos 12 meses por el uso del servicio.
                        </p>
                    </section>

                    {/* 8 */}
                    <section className="legal-section" id="s8">
                        <div className="legal-section-header">
                            <span className="legal-section-num">8</span>
                            <h2>Modificaciones</h2>
                        </div>
                        <p>
                            Nubee puede actualizar estos Términos en cualquier momento. Los cambios
                            significativos serán notificados por correo electrónico con al menos 15 días de
                            anticipación.
                        </p>
                        <p>
                            El uso continuado del servicio después de la fecha efectiva de los cambios
                            constituye aceptación de los nuevos términos. Si no acepta los cambios, debe
                            cancelar su suscripción antes de la fecha de entrada en vigor.
                        </p>
                    </section>

                    {/* 9 */}
                    <section className="legal-section" id="s9">
                        <div className="legal-section-header">
                            <span className="legal-section-num">9</span>
                            <h2>Terminación</h2>
                        </div>
                        <p>
                            Cualquiera de las partes puede terminar el contrato en cualquier momento.
                            El usuario puede cancelar su cuenta desde el panel de configuración.
                            Nubee puede suspender o terminar cuentas por incumplimiento de estos Términos.
                        </p>
                        <p>
                            Tras la terminación, Nubee conservará sus datos por 90 días durante los cuales
                            podrá solicitar su exportación. Transcurrido este plazo, los datos serán eliminados
                            de forma permanente.
                        </p>
                    </section>

                    {/* 10 */}
                    <section className="legal-section" id="s10">
                        <div className="legal-section-header">
                            <span className="legal-section-num">10</span>
                            <h2>Legislación aplicable</h2>
                        </div>
                        <p>
                            Estos Términos se rigen por las leyes de la República de Colombia. Cualquier
                            disputa derivada de este acuerdo se resolverá ante los jueces y tribunales
                            competentes de la ciudad de Bogotá D.C., renunciando expresamente a cualquier
                            otro fuero que pudiera corresponder.
                        </p>
                        <p>
                            Antes de acudir a la vía judicial, las partes se comprometen a intentar una
                            resolución amigable durante un período de 30 días.
                        </p>
                    </section>

                    {/* Contacto */}
                    <div className="legal-contact">
                        <h3>¿Tienes preguntas sobre estos términos?</h3>
                        <p>Nuestro equipo legal está disponible para aclarar cualquier duda.</p>
                        <p>
                            <a href="mailto:legal@Nubee.co">legal@Nubee.co</a>
                            {" · "}
                            <a href="/soporte">Centro de soporte</a>
                        </p>
                    </div>

                </main>
            </div>
        </div>
    );
}