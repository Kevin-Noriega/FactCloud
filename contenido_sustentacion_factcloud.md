# Contenido sugerido para sustentacion - Proyecto FactCloud / Nubee

## Diapositiva 2 - Nombre del proyecto e integrantes

**Nombre del proyecto:** FactCloud / Nubee  
**Tipo de sistema:** Plataforma web SaaS para facturacion electronica y gestion comercial.  
**Integrantes:** [Colocar nombres del equipo]  
**Programa / ficha:** [Colocar datos academicos]  
**Fecha:** [Colocar fecha de sustentacion]

## Diapositiva 3 - Introduccion

FactCloud es una aplicacion web desarrollada para apoyar a pequenas y medianas empresas colombianas en la gestion de su facturacion electronica, clientes, productos, ventas, pagos, reportes y cumplimiento tributario ante la DIAN.

El proyecto busca centralizar en una sola plataforma procesos que normalmente se realizan con herramientas separadas, hojas de calculo o sistemas costosos. La solucion incluye una interfaz publica, registro de usuarios, autenticacion, panel administrativo, facturacion, punto de venta POS, reportes, tienda de planes, pagos en linea y flujos de habilitacion DIAN.

## Diapositiva 4 - Identificacion del problema

**Problema:** Muchas PYMES en Colombia tienen dificultades para cumplir con la facturacion electronica, controlar ventas, organizar clientes/productos y consultar reportes comerciales en tiempo real.

**A quienes afecta:** Comerciantes, emprendedores, pequenos negocios, administradores, contadores y usuarios que necesitan emitir documentos electronicos sin depender de procesos manuales.

**Impacto:** Errores en facturas, perdida de tiempo, bajo control de inventario/productos, dificultad para consultar ventas, riesgo de incumplimiento DIAN y poca trazabilidad de pagos o documentos.

**Solucion propuesta:** Una plataforma web en la nube que automatiza y organiza los procesos de facturacion, ventas, productos, clientes, pagos, reportes y habilitacion electronica.

## Diapositiva 5 - Descripcion del sistema

FactCloud es un sistema web compuesto por modulos publicos, privados y administrativos.

**Modulos principales:**
- Landing page informativa con planes, soporte, informacion DIAN y contacto.
- Registro, inicio de sesion y proteccion de rutas.
- Dashboard de usuario.
- Gestion de clientes, productos y contactos.
- Creacion de facturas, notas credito, notas debito y documentos soporte.
- Habilitacion DIAN para facturacion electronica.
- Reportes de ventas por cliente, producto, vendedor y comparativo mensual.
- Punto de venta POS con carrito, productos, categorias y cobro.
- Checkout con tarjeta y PSE mediante Wompi.
- Administracion de usuarios, clientes, facturas, productos, planes, auditoria y suscripciones.

**Herramienta de gestion sugerida:** Kanban con columnas: Pendiente, En desarrollo, En pruebas, Corregido y Finalizado.

## Diapositiva 6 - Requerimientos del sistema

### Requisitos funcionales

| Codigo | Requisito |
|---|---|
| RF-01 | Permitir registro e inicio de sesion de usuarios. |
| RF-02 | Gestionar clientes, productos y contactos. |
| RF-03 | Crear facturas electronicas con productos, impuestos, descuentos y formas de pago. |
| RF-04 | Enviar facturas a validacion DIAN desde el flujo del sistema. |
| RF-05 | Permitir habilitacion DIAN mediante datos de software, set de pruebas y resolucion. |
| RF-06 | Generar reportes de ventas por cliente, producto, vendedor y mes. |
| RF-07 | Procesar pagos por tarjeta y PSE mediante Wompi. |
| RF-08 | Permitir venta rapida en modulo POS con carrito y lectura de codigo de barras. |
| RF-09 | Administrar usuarios, planes, productos, facturas y auditoria desde panel admin. |

### Requisitos no funcionales

| Codigo | Requisito |
|---|---|
| RNF-01 | Interfaz web responsiva y usable. |
| RNF-02 | Proteccion de rutas privadas mediante autenticacion. |
| RNF-03 | Manejo seguro de tokens y cierre de sesion ante errores 401. |
| RNF-04 | Variables sensibles fuera del codigo fuente mediante `.env.local`. |
| RNF-05 | Validacion y sanitizacion de campos de pago. |
| RNF-06 | Compilacion exitosa para produccion con Vite. |
| RNF-07 | Arquitectura modular por paginas, componentes, hooks, servicios y utilidades. |

## Diapositiva 7 - Modelos del sistema

**Diagrama de casos de uso sugerido:**

Actores:
- Usuario / Empresa
- Administrador
- DIAN
- Pasarela de pagos Wompi

Casos de uso:
- Registrarse / iniciar sesion.
- Gestionar perfil.
- Gestionar clientes.
- Gestionar productos.
- Crear factura.
- Crear documento soporte.
- Crear nota credito/debito.
- Configurar habilitacion DIAN.
- Consultar reportes.
- Realizar pago de plan.
- Usar POS.
- Administrar usuarios, planes y auditoria.

## Diapositiva 8 - Visualizacion de la aplicacion

**Pantallazos recomendados:**
- Pagina principal: muestra propuesta de valor y planes.
- Login/registro: evidencia autenticacion.
- Dashboard: vista principal del usuario autenticado.
- Clientes o productos: gestion de datos maestros.
- Nueva factura: formulario con cliente, productos, impuestos y pagos.
- Habilitacion DIAN: pasos de configuracion.
- Reportes: ventas por cliente/producto/vendedor.
- POS: productos, carrito y modal de cobro.
- Panel administrador: gestion de usuarios o facturas.

## Diapositiva 9 - Pruebas del software

Se definieron pruebas para verificar seguridad, validacion de pagos, funcionamiento de checkout, integridad de datos y construccion del proyecto.

**Tipos de pruebas aplicadas o planificadas:**
- Pruebas unitarias sobre utilidades de checkout y seguridad de pagos.
- Pruebas de integracion entre frontend, servicios API y pasarela de pago.
- Pruebas de sistema sobre flujos completos: login, crear factura, pago, reportes y POS.
- Prueba de compilacion: `npm run build` ejecutado correctamente.

**Resultado actual:** El build de produccion fue exitoso. La ejecucion de Jest quedo pendiente porque el comando `jest` no esta disponible en `node_modules/.bin`.

## Diapositiva 10 - Plan de pruebas

**Objetivo:** Verificar que FactCloud permita gestionar facturacion, pagos, clientes, productos y reportes de forma correcta, segura y estable.

**Alcance:** Se prueban modulos de autenticacion, checkout, facturacion, reportes, POS, administracion y validaciones de formularios.

**Estrategias:**
- Pruebas unitarias para funciones de validacion, formato y seguridad.
- Pruebas de integracion para comunicacion con API, Wompi y flujos DIAN.
- Pruebas funcionales manuales sobre pantallas principales.
- Pruebas de construccion con Vite para validar despliegue.

## Diapositiva 11 - Pruebas unitarias

**Caso seleccionado:** Seguridad y validacion de pagos.

**Casos disenados:**
- API key de Wompi no debe estar hardcodeada.
- Password no debe viajar en payload PSE.
- Referencia de transaccion debe usar `crypto.randomUUID()`.
- Validacion de email, telefono, documento, banco y razon social.
- Sanitizacion de tarjeta, CVV, telefono, NIT y nombre del titular.
- No registrar en consola tokens, CVC o datos de tarjeta.

**Resultado esperado:** Los datos sensibles no se exponen, los campos invalidos se rechazan y la transaccion usa referencias no predecibles.

## Diapositiva 12 - Pruebas de integracion

**Esquema:** Frontend React -> Axios/API -> Backend -> Servicios externos.

**Caso seleccionado:** Pago PSE.

**Flujo de prueba:**
1. Usuario selecciona un plan.
2. Completa datos personales, facturacion y banco.
3. Frontend valida campos obligatorios.
4. Se crea una transaccion PSE.
5. El usuario es redirigido al banco.
6. La pantalla de resultado consulta estado mediante polling.
7. El sistema muestra aprobado, rechazado o timeout.

**Evaluacion:** La integracion debe mantener seguridad, evitar datos sensibles en payload y controlar estados pendientes.

## Diapositiva 13 - Pruebas de sistema

**Prueba 1: Crear factura**
- Iniciar sesion.
- Ir a Nueva factura.
- Seleccionar cliente y productos.
- Agregar impuestos, descuentos y formas de pago.
- Validar que el total de pagos coincida con el total de la factura.
- Guardar y enviar a DIAN.

**Prueba 2: Punto de venta POS**
- Abrir POS.
- Buscar producto o escanear codigo de barras.
- Agregar al carrito.
- Revisar subtotal/impuestos.
- Abrir modal de cobro.
- Finalizar venta.

**Pantallazos:** Nueva factura y POS.

## Diapositiva 14 - Metricas del software

**Metricas medidas en el repositorio:**

| Tipo | Archivos | Lineas |
|---|---:|---:|
| JSX | 168 | 39.353 |
| JavaScript | 55 | 5.460 |
| CSS | 69 | 22.618 |
| JSON | 11 | 7.693 |
| Total | 303 | 75.124 |

**Interpretacion:** El proyecto tiene una base amplia de componentes, estilos, servicios y configuraciones, lo que evidencia un sistema modular con varias funcionalidades implementadas.

## Diapositiva 15 - Metricas de atributos internos

**Tamano del software:**
- 303 archivos medidos dentro de `src`.
- 75.124 lineas totales entre JSX, JS, CSS y JSON.
- Mayor concentracion en componentes JSX y estilos CSS.

**Modularidad:**
- Separacion por `pages`, `components`, `hooks`, `api`, `utils`, `features`, `contexts`, `layouts`, `services` y `styles`.
- Uso de hooks personalizados para logica de negocio.
- Servicios separados para API, pagos y POS.

**Herramientas sugeridas para pantallazo:** VS Code, terminal con conteo de lineas, `npm run build`, y si se instala, SonarQube/SonarLint.

## Diapositiva 16 - Metricas de atributos externos

**Atributo 1: Seguridad**
- Variables sensibles manejadas por entorno (`VITE_WOMPI_PUBLIC_KEY`).
- Access token en memoria.
- Refresh token manejado por cookie mediante `withCredentials`.
- Logout global ante respuesta 401.
- Validacion y sanitizacion de datos de pago.

**Atributo 2: Rendimiento / despliegue**
- Build de produccion exitoso con Vite.
- 5.081 modulos transformados.
- Bundle principal aproximado: 6.175,61 kB minificado y 1.088,25 kB gzip.
- Advertencia: el bundle principal supera 500 kB, por lo que se recomienda aplicar code splitting.

## Diapositiva 17 - Metricas de calidad del software

**Atributos internos:**
- Modularidad: estructura por capas de frontend.
- Mantenibilidad: componentes, hooks y servicios separados.
- Reutilizacion: componentes compartidos como tablas, filtros, modales y formularios.

**Atributos externos:**
- Seguridad: pruebas definidas para pagos y manejo de datos sensibles.
- Usabilidad: navegacion por modulos, formularios guiados, dashboard y POS.
- Compatibilidad: aplicacion web construida con React, Vite y Bootstrap.

**SonarQube:** Colocar pantallazo cuando se ejecute el analisis. Si no esta instalado, indicar que la medicion automatizada queda como mejora futura.

## Diapositiva 18 - Estimacion del software

**Estimacion basada en modulos:**

| Modulo | Complejidad |
|---|---|
| Autenticacion y rutas protegidas | Media |
| Clientes y productos | Media |
| Facturacion electronica | Alta |
| Habilitacion DIAN | Alta |
| Pagos Wompi/PSE | Alta |
| POS | Alta |
| Reportes | Media |
| Administracion | Media |

**Esfuerzo estimado:** Proyecto de complejidad media-alta por la cantidad de modulos, integraciones externas, validaciones tributarias y flujos transaccionales.

## Diapositiva 19 - Aplicacion del software

**Funcionamiento general para demo:**
1. Mostrar pagina de inicio y propuesta de valor.
2. Iniciar sesion.
3. Entrar al dashboard.
4. Registrar o consultar un cliente.
5. Registrar o consultar un producto.
6. Crear una factura con impuestos y forma de pago.
7. Mostrar flujo de habilitacion DIAN.
8. Consultar reportes.
9. Mostrar POS y carrito.
10. Mostrar panel administrativo.

## Diapositiva 20 - Conclusiones

FactCloud permite centralizar procesos comerciales y tributarios en una plataforma web, reduciendo tareas manuales y facilitando la gestion de facturacion electronica para PYMES.

El proyecto evidencia una arquitectura modular basada en React, Vite, componentes reutilizables, hooks personalizados, servicios API, rutas protegidas e integracion con pasarela de pagos.

Las pruebas disenadas se enfocan en seguridad de pagos, validacion de formularios, integridad de transacciones y flujos criticos como PSE, facturacion y POS.

Las metricas muestran un sistema de tamano considerable, con 303 archivos y mas de 75 mil lineas medidas. El build de produccion fue exitoso, aunque se recomienda optimizar el bundle con carga diferida y completar la configuracion de Jest/SonarQube para fortalecer la evaluacion de calidad.

## Diapositiva 21 - Cierre

**Gracias.**  
Preguntas y observaciones.

