const FAQS = [
  // SECCIÓN: HOME
  {
    seccion: "home",
    categoria: "General",
    pregunta: "¿Qué es FactCloud?",
    respuesta: "FactCloud es una plataforma de facturación electrónica validada por la DIAN que permite a empresas y profesionales en Colombia emitir facturas legalmente válidas de forma rápida y segura. Automatiza todo el proceso desde la generación hasta la validación fiscal."
  },
  {
    seccion: "home",
    categoria: "General",
    pregunta: "¿Por qué elegir FactCloud?",
    respuesta: "Integración automática con DIAN, interfaz intuitiva sin curva de aprendizaje, soporte técnico en español 24/7, y cumplimiento garantizado con todas las normativas colombianas. Además, planes flexibles desde $29.900/mes sin contratos a largo plazo."
  },
  {
    seccion: "home",
    categoria: "Comenzar",
    pregunta: "¿Cómo empiezo a facturar?",
    respuesta: "Regístrate en 3 minutos, carga tu certificado digital, configura tu información fiscal y empieza a facturar. El proceso incluye habilitación automática con DIAN. Ofrecemos 14 días de prueba gratis sin tarjeta de crédito."
  },
  {
    seccion: "home",
    categoria: "Comenzar",
    pregunta: "¿Necesito conocimientos técnicos?",
    respuesta: "No, la plataforma está diseñada para usuarios sin conocimientos técnicos. El proceso es tan simple como completar un formulario. Para integraciones avanzadas con tu sistema actual, ofrecemos API REST y SDKs con documentación completa."
  },
  {
    seccion: "home",
    categoria: "Características",
    pregunta: "¿Qué documentos puedo emitir?",
    respuesta: "Facturas de venta, notas crédito, notas débito, facturas de exportación y documentos soporte. Todos con validación automática DIAN, firma digital, código CUFE y código QR según normativa vigente."
  },
  {
    seccion: "home",
    categoria: "Características",
    pregunta: "¿Puedo gestionar mis clientes y productos?",
    respuesta: "Sí, incluye gestión completa de clientes con validación RUT, catálogo de productos/servicios con códigos UNSPSC, inventario básico y historial de transacciones. Importación masiva desde Excel disponible."
  },
  {
    seccion: "home",
    categoria: "Ventajas",
    pregunta: "¿Qué beneficios obtendré?",
    respuesta: "Ahorra hasta 70% del tiempo en facturación manual, elimina errores de digitación, reduce costos de papel y envío, mejora tu flujo de efectivo con seguimiento en tiempo real, y cumple 100% con DIAN sin preocupaciones."
  },
  {
    seccion: "home",
    categoria: "Ventajas",
    pregunta: "¿Es seguro guardar mis datos en la nube?",
    respuesta: "Totalmente seguro. Usamos cifrado militar AES-256, backups automáticos cada 6 horas, certificación ISO 27001 y servidores con redundancia geográfica. Tus datos están más seguros que en servidores locales."
  },

  // SECCIÓN: PLANES
  {
    seccion: "planes",
    categoria: "Planes disponibles",
    pregunta: "¿Qué planes ofrecen?",
    respuesta: "Plan Básico ($29.900/mes, 50 facturas), Profesional ($79.900/mes, 300 facturas, 3 usuarios), y Empresarial ($149.900/mes, ilimitadas, 10 usuarios). Todos incluyen validación DIAN, firma digital, soporte técnico y actualizaciones automáticas."
  },
  {
    seccion: "planes",
    categoria: "Planes disponibles",
    pregunta: "¿Hay descuentos por pago anual?",
    respuesta: "Sí, obtienes 2 meses gratis pagando anualmente (17% de descuento). Plan Básico $299.000/año, Profesional $799.000/año, Empresarial $1.499.000/año. Sin costos adicionales ni sorpresas en la factura."
  },
  {
    seccion: "planes",
    categoria: "Comparación",
    pregunta: "¿Qué incluye cada plan?",
    respuesta: "Básico: 50 facturas/mes, 1 usuario, soporte email. Profesional: 300 facturas/mes, 3 usuarios, API REST, webhooks, soporte prioritario. Empresarial: facturas ilimitadas, 10 usuarios, SDK oficial, integración personalizada, gerente de cuenta dedicado."
  },
  {
    seccion: "planes",
    categoria: "Comparación",
    pregunta: "¿Cuál plan es mejor para mí?",
    respuesta: "Básico ideal para freelancers y pequeños negocios (<50 facturas/mes). Profesional para empresas en crecimiento con equipo de trabajo. Empresarial para grandes volúmenes y necesidades de integración con ERP o CRM existente."
  },
  {
    seccion: "planes",
    categoria: "Facturación y pagos",
    pregunta: "¿Cómo se realiza el pago?",
    respuesta: "Aceptamos tarjetas de crédito/débito (Visa, Mastercard), PSE, Nequi y transferencia bancaria. Renovación automática mensual o anual. Facturas electrónicas emitidas automáticamente cada ciclo con IVA incluido."
  },
  {
    seccion: "planes",
    categoria: "Facturación y pagos",
    pregunta: "¿Qué pasa si excedo mi límite de facturas?",
    respuesta: "Recibes notificación al llegar al 80% de tu límite. Puedes comprar paquetes adicionales ($15.000 por 25 facturas extra) o actualizar tu plan inmediatamente. Las facturas nunca se bloquean para evitar interrupciones en tu negocio."
  },
  {
    seccion: "planes",
    categoria: "Cambios y cancelaciones",
    pregunta: "¿Puedo cambiar de plan después?",
    respuesta: "Sí, cambios ilimitados sin penalizaciones. Upgrades inmediatos pagando diferencia prorrateada. Downgrades aplican al siguiente ciclo de facturación con crédito a favor. Gestiona todo desde tu panel de usuario."
  },
  {
    seccion: "planes",
    categoria: "Cambios y cancelaciones",
    pregunta: "¿Hay periodo de prueba?",
    respuesta: "14 días de prueba gratis en cualquier plan, sin tarjeta de crédito. Acceso completo a todas las funcionalidades para que pruebes el sistema con casos reales. Cancelación en un clic sin explicaciones ni retenciones."
  },

  // SECCIÓN: CÓMO FUNCIONA
  {
    seccion: "como-funciona",
    categoria: "Proceso general",
    pregunta: "¿Cómo funciona el proceso de facturación?",
    respuesta: "1) Creas la factura ingresando datos del cliente y productos. 2) El sistema genera automáticamente el XML UBL 2.1 y lo firma digitalmente. 3) Se envía a DIAN para validación. 4) Recibes confirmación en segundos con código CUFE. 5) El cliente recibe la factura por email con PDF y código QR."
  },
  {
    seccion: "como-funciona",
    categoria: "Proceso general",
    pregunta: "¿Cuánto tarda en validarse una factura?",
    respuesta: "Entre 5 y 30 segundos normalmente. DIAN procesa la validación en tiempo real. En horarios pico puede tomar hasta 2 minutos. Recibes notificación automática del estado (Aceptada, Rechazada o En proceso) en tu panel y por email."
  },
  {
    seccion: "como-funciona",
    categoria: "Configuración inicial",
    pregunta: "¿Qué necesito para empezar?",
    respuesta: "RUT actualizado, certificado digital de firma (expedido por entidad certificadora autorizada), resolución de numeración DIAN (si la tienes), y logo de tu empresa (opcional). Nosotros te guiamos paso a paso en el proceso de habilitación DIAN."
  },
  {
    seccion: "como-funciona",
    categoria: "Configuración inicial",
    pregunta: "¿Cómo obtengo el certificado digital?",
    respuesta: "Lo solicitas a entidades como Certicámara, GSE o ANDES. Cuesta entre $80.000 y $200.000 con vigencia de 1-2 años. Necesitas documento de identidad del representante legal y RUT. FactCloud acepta formatos .p12, .pfx y .pem."
  },
  {
    seccion: "como-funciona",
    categoria: "Crear facturas",
    pregunta: "¿Cómo creo una factura?",
    respuesta: "Click en 'Nueva Factura', selecciona o crea el cliente, agrega productos/servicios de tu catálogo o ingrésalos manualmente, el sistema calcula impuestos automáticamente (IVA, INC, retenciones), previsualizas y envías. Toma menos de 2 minutos."
  },
  {
    seccion: "como-funciona",
    categoria: "Crear facturas",
    pregunta: "¿Puedo facturar desde mi celular?",
    respuesta: "Sí, la plataforma es 100% responsive y funciona en cualquier dispositivo. Accede desde Chrome, Safari o cualquier navegador móvil. Todos los planes incluyen acceso ilimitado en múltiples dispositivos simultáneamente."
  },
  {
    seccion: "como-funciona",
    categoria: "Gestión y reportes",
    pregunta: "¿Cómo consulto mis facturas emitidas?",
    respuesta: "El panel principal muestra todas tus facturas con filtros por fecha, cliente, estado DIAN, monto y tipo de documento. Exporta reportes en Excel, CSV o PDF. Búsqueda instantánea por número, CUFE o nombre de cliente."
  },
  {
    seccion: "como-funciona",
    categoria: "Gestión y reportes",
    pregunta: "¿Genera reportes contables?",
    respuesta: "Sí, reportes de ventas por periodo, IVA recaudado, retenciones, ventas por cliente/producto, y estados de cuenta. Formato compatible con software contable estándar. Planes Profesional+ incluyen export directo a SIIGO, Alegra y Helisa."
  },

  // SECCIÓN: DIAN
  {
    seccion: "dian",
    categoria: "Normativa",
    pregunta: "¿Qué es la facturación electrónica DIAN?",
    respuesta: "Es el sistema obligatorio en Colombia donde todas las facturas deben generarse en formato XML UBL 2.1, firmarse digitalmente y validarse ante DIAN antes de entregarse al cliente. Reemplaza completamente las facturas en papel desde 2024 para todos los obligados a facturar."
  },
  {
    seccion: "dian",
    categoria: "Normativa",
    pregunta: "¿Quiénes están obligados a facturar electrónicamente?",
    respuesta: "Todos los responsables de IVA (régimen común), grandes contribuyentes, y cualquier persona natural o jurídica obligada a facturar. Aplica para transacciones B2B, B2C y B2G. Multas desde $500.000 hasta 1% de ingresos brutos por incumplimiento según Resolución 000012."
  },
  {
    seccion: "dian",
    categoria: "Habilitación DIAN",
    pregunta: "¿Qué es la habilitación ante DIAN?",
    respuesta: "Es el proceso de registro, pruebas y autorización que hace DIAN para permitirte emitir facturas electrónicas válidas. Incluye: inscripción en RUT como facturador electrónico, registro del software, ambiente de pruebas (5 facturas test mínimo), y habilitación en producción."
  },
  {
    seccion: "dian",
    categoria: "Habilitación DIAN",
    pregunta: "¿FactCloud me ayuda con la habilitación?",
    respuesta: "Sí, lo hacemos automáticamente. Solo necesitas tu certificado digital y nosotros gestionamos el registro del software ante DIAN, generamos las facturas de prueba, enviamos el set de habilitación y activamos tu cuenta en producción. Toma 1-2 días hábiles."
  },
  {
    seccion: "dian",
    categoria: "Requisitos técnicos",
    pregunta: "¿Qué debe tener una factura electrónica válida?",
    respuesta: "Formato XML UBL 2.1, firma digital certificada, código CUFE (identificador único), código QR con validación DIAN, numeración consecutiva autorizada, datos fiscales completos de emisor y receptor, y validación DIAN exitosa con su sello electrónico."
  },
  {
    seccion: "dian",
    categoria: "Requisitos técnicos",
    pregunta: "¿Qué es el código CUFE?",
    respuesta: "Código Único de Factura Electrónica. Es un hash alfanumérico de 96 caracteres generado con datos de la factura (número, fecha, NIT, valor, etc.) que garantiza su autenticidad e integridad. Es único para cada factura y permite validarla en el portal DIAN."
  },
  {
    seccion: "dian",
    categoria: "Documentos soportados",
    pregunta: "¿Qué documentos electrónicos hay además de facturas?",
    respuesta: "Nota Crédito (devoluciones, anulaciones, descuentos), Nota Débito (intereses, ajustes al alza), Factura de Exportación (ventas internacionales), y Documento Soporte (compras a no obligados). Todos con mismos requisitos de validación DIAN."
  },
  {
    seccion: "dian",
    categoria: "Documentos soportados",
    pregunta: "¿Cuándo uso Nota Crédito vs Nota Débito?",
    respuesta: "Nota Crédito: disminuye valor de factura original (devoluciones, descuentos post-venta, anulaciones totales/parciales). Nota Débito: incrementa valor (intereses por mora, costos adicionales no facturados inicialmente). Ambas deben referenciar la factura original por número y CUFE."
  },

  // SECCIÓN: CUENTA Y ACCESO
  {
    seccion: "cuenta",
    categoria: "Cuenta y acceso",
    pregunta: "¿Cómo recupero mi contraseña?",
    respuesta: "En la página de inicio de sesión, haz clic en '¿Olvidaste tu contraseña?'. Ingresa tu email registrado y recibirás un enlace de recuperación válido por 1 hora. Si no llega el correo, verifica tu carpeta de spam o contacta soporte."
  },
  {
    seccion: "cuenta",
    categoria: "Cuenta y acceso",
    pregunta: "¿Puedo tener múltiples usuarios en mi cuenta?",
    respuesta: "Sí, el plan Profesional permite hasta 3 usuarios y el Empresarial hasta 10. Cada usuario tiene su propio login y puedes asignar permisos específicos (administrador, operador, solo lectura) desde el panel de configuración."
  },

  // SECCIÓN: FACTURACIÓN
  {
    seccion: "facturacion",
    categoria: "Facturación",
    pregunta: "¿Qué hago si DIAN rechaza una factura?",
    respuesta: "Revisa el mensaje de error en el detalle de la factura. Errores comunes: datos del cliente incorrectos, certificado vencido, numeración duplicada. Corrige el error y reenvía desde el botón 'Reenviar a DIAN'. La numeración no se pierde, solo se actualiza el documento."
  },
  {
    seccion: "facturacion",
    categoria: "Facturación",
    pregunta: "¿Puedo anular una factura ya validada por DIAN?",
    respuesta: "No se puede anular directamente. Debes crear una Nota Crédito por el 100% del valor para reversar la operación. La factura original queda anulada fiscalmente pero permanece en el sistema para auditorías."
  },

  // SECCIÓN: TÉCNICO
  {
    seccion: "tecnico",
    categoria: "Técnico",
    pregunta: "¿Cómo integro FactCloud con mi sistema actual?",
    respuesta: "Usa nuestra API REST documentada en OpenAPI 3.0. Tienes endpoints para crear facturas, consultar clientes, productos y webhooks para recibir eventos. También ofrecemos SDKs oficiales en JavaScript y C#. Planes Empresarial incluyen soporte de integración."
  },
  {
    seccion: "tecnico",
    categoria: "Técnico",
    pregunta: "¿Los datos están seguros y respaldados?",
    respuesta: "Sí, usamos cifrado AES-256 en reposo y TLS 1.3 en tránsito. Backups automáticos cada 6 horas con retención de 90 días. Almacenamiento en servidores cloud distribuidos con redundancia geográfica. Cumplimos ISO 27001 y GDPR."
  }
];

export default FAQS;