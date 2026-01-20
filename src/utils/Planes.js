export const planes = [
  {
    id: 1,
    name: "Starter",
    description: "Ideal para emprendedores iniciando",
    monthlyPrice: "5.900",
    annualPrice: 70800,
    discount: "-10%",
    originalPrice: "85.000 /año",
    featured: false,
    tag: null,
    features: [
      {
        text: "1 Usuario",
        tooltip: "Cuenta individual para emprendedores que están empezando su negocio."
      },
      {
        text: "100 Documentos al mes",
        tooltip: "Emite hasta 100 facturas electrónicas mensuales. Aproximadamente 3-4 documentos diarios."
      },
      {
        text: "Funciones básicas",
        tooltip: "Creación de facturas, gestión de clientes y productos. Reportes simples incluidos."
      },
      {
        text: "Soporte por email (48h)",
        tooltip: "Respuesta garantizada en máximo 48 horas hábiles vía correo electrónico."
      }
    ]
  },
  {
    id: 2,
    name: "Básico",
    description: "Para pequeños negocios en crecimiento",
    monthlyPrice: "12.900",
    annualPrice: 154800,
    discount: "-15%",
    originalPrice: "182.000 /año",
    featured: false,
    tag: null,
    features: [
      {
        text: "1 Usuario",
        tooltip: "Cuenta individual perfecta para emprendedores y negocios unipersonales. Acceso completo a todas las funciones."
      },
      {
        text: "240 Documentos electrónicos al mes",
        tooltip: "Facturas, notas débito y crédito incluidas. Perfecto para negocios que emiten hasta 8 documentos diarios."
      },
      {
        text: "Envío automático por email",
        tooltip: "PDF y XML llegan al instante al correo de tus clientes con tu logo empresarial personalizado."
      },
      {
        text: "Soporte por email",
        tooltip: "Respuesta en 24 horas. Equipo de soporte técnico disponible de lunes a viernes 8am-6pm."
      },
      {
        text: "Reportes básicos",
        tooltip: "Acceso a reportes de ventas mensuales, clientes frecuentes e inventario básico."
      }
    ]
  },
  {
    id: 3,
    name: "Profesional",
    description: "Perfecto para PYMES establecidas",
    monthlyPrice: "24.900",
    annualPrice: 298800,
    discount: "-20%",
    originalPrice: "373.500 /año",
    featured: true,
    tag: "MÁS POPULAR",
    features: [
      {
        text: "Facturas ilimitadas",
        tooltip: "Emite todas las facturas que necesites. Sin límites diarios ni mensuales. Ideal para alto volumen de ventas."
      },
      {
        text: "POS incluido",
        tooltip: "Sistema punto de venta integrado para tiendas físicas. Facturación en tiempo real desde tu mostrador."
      },
      {
        text: "3 usuarios",
        tooltip: "Hasta 3 cuentas de usuario con permisos configurables para tu equipo de trabajo."
      },
      {
        text: "Soporte WhatsApp prioritario",
        tooltip: "Atención prioritaria vía WhatsApp en horario laboral con tiempo de respuesta promedio de 2 horas."
      },
      {
        text: "Reportes avanzados",
        tooltip: "Análisis detallado de ventas, proyecciones, rentabilidad por producto y dashboards personalizables."
      }
    ]
  },
  {
    id: 4,
    name: "Empresarial",
    description: "Solución completa para empresas grandes",
    monthlyPrice: "49.900",
    annualPrice: 598800,
    discount: "-25%",
    originalPrice: "798.400 /año",
    featured: false,
    tag: null,
    features: [
      {
        text: "Todo ilimitado",
        tooltip: "Facturas, usuarios, almacenamiento y documentos sin ningún tipo de restricción."
      },
      {
        text: "Nómina electrónica",
        tooltip: "Generación automática de nómina electrónica cumpliendo con las regulaciones de la DIAN."
      },
      {
        text: "Usuarios ilimitados",
        tooltip: "Agrega tantos usuarios como necesites con roles y permisos personalizados por departamento."
      },
      {
        text: "Soporte 24/7",
        tooltip: "Soporte técnico disponible las 24 horas del día, los 7 días de la semana por múltiples canales."
      },
      {
        text: "API acceso",
        tooltip: "Integra FactCloud con tus sistemas existentes mediante nuestra API REST completa."
      },
      {
        text: "Gerente dedicado",
        tooltip: "Un gerente de cuentas exclusivo para atender todas tus necesidades empresariales."
      }
    ]
  },
  {
    id: 5,
    name: "Premium",
    description: "Para corporaciones y grandes empresas",
    monthlyPrice: "89.900",
    annualPrice: 1078800,
    discount: "-30%",
    originalPrice: "1.350.000 /año",
    featured: false,
    tag: "CORPORATIVO",
    features: [
      {
        text: "Todo de Empresarial +",
        tooltip: "Todas las características del plan Empresarial más funcionalidades exclusivas Premium."
      },
      {
        text: "Multiempresa ilimitada",
        tooltip: "Gestiona múltiples empresas desde una sola cuenta. Perfecto para holdings y grupos corporativos."
      },
      {
        text: "Integraciones personalizadas",
        tooltip: "Desarrollamos integraciones a medida con tus sistemas ERP, CRM o cualquier plataforma empresarial."
      },
      {
        text: "Consultoría DIAN incluida",
        tooltip: "Asesoría especializada en normativas DIAN, cambios tributarios y optimización de procesos de facturación."
      },
      {
        text: "SLA 99.9%",
        tooltip: "Garantía de disponibilidad del 99.9% con compensación por incumplimiento del acuerdo de nivel de servicio."
      },
      {
        text: "Almacenamiento ilimitado",
        tooltip: "Guarda todos tus documentos históricos sin límites de espacio ni tiempo. Acceso permanente."
      }
    ]
  },
  {
    id: 6,
    name: "Pago por Uso",
    description: "Paga solo por lo que facturas",
    monthlyPrice: "350",
    annualPrice: 0,
    discount: null,
    originalPrice: null,
    featured: false,
    tag: "FLEXIBLE",
    period: "/doc",
    annualText: "Sin cuota mensual",
    buttonText: "Empezar gratis",
    features: [
      {
        text: "Sin cuota mensual",
        tooltip: "No pagas nada si no facturas. Cero cargos fijos mensuales o anuales."
      },
      {
        text: "$350 por documento emitido",
        tooltip: "Tarifa simple y transparente por cada factura generada. Ideal para facturación ocasional."
      },
      {
        text: "Usuarios ilimitados",
        tooltip: "Agrega cuantos usuarios necesites sin cargos adicionales. Solo pagas por documentos emitidos."
      },
      {
        text: "Todas las funciones incluidas",
        tooltip: "Acceso completo a todas las características de la plataforma sin restricciones funcionales."
      },
      {
        text: "Ideal para facturación esporádica",
        tooltip: "Perfecto para freelancers, consultores o negocios con facturación irregular o baja frecuencia."
      }
    ]
  }
];
