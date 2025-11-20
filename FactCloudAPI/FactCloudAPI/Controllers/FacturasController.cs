using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using FacturacionAPI.Data;
using FacturacionAPI.Models;
using FacturacionAPI.Services;

namespace FacturacionAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacturasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public FacturasController(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // ==================== CRUD BÁSICO ====================

        // GET: api/Facturas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Factura>>> ObtenerFacturas()
        {
            return await _context.Facturas
                .Include(f => f.Cliente)
                .Include(f => f.Usuario)
                .OrderByDescending(f => f.FechaEmision)
                .ToListAsync();
        }

        // GET: api/Facturas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Factura>> ObtenerFactura(int id)
        {
            var factura = await _context.Facturas
                .Include(f => f.Cliente)
                .Include(f => f.Usuario)
                .Include(f => f.DetalleFacturas)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (factura == null)
                return NotFound();

            return factura;
        }

        // POST: api/Facturas
        [HttpPost]
        public async Task<ActionResult<Factura>> CrearFactura(Factura factura)
        {
            try
            {
                // Calcular fechas automáticamente
                factura.CalcularFechas();

                _context.Facturas.Add(factura);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(ObtenerFactura), new { id = factura.Id }, factura);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = "Error al crear factura", error = ex.Message });
            }
        }

        // PUT: api/Facturas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarFactura(int id, Factura factura)
        {
            if (id != factura.Id)
                return BadRequest();

            try
            {
                factura.CalcularFechas();
                _context.Entry(factura).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FacturaExists(id))
                    return NotFound();
                throw;
            }
        }

        // DELETE: api/Facturas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarFactura(int id)
        {
            var factura = await _context.Facturas.FindAsync(id);
            if (factura == null)
                return NotFound();

            _context.Facturas.Remove(factura);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ==================== ENVÍO DE FACTURAS ====================

        // POST: api/Facturas/5/enviar-cliente
        [HttpPost("{id}/enviar-cliente")]
        public async Task<IActionResult> EnviarFacturaAlCliente(int id)
        {
            try
            {
                var factura = await _context.Facturas
                    .Include(f => f.Cliente)
                    .FirstOrDefaultAsync(f => f.Id == id);

                if (factura == null)
                    return NotFound(new { mensaje = "Factura no encontrada" });

                if (string.IsNullOrEmpty(factura.Cliente.Correo))
                    return BadRequest(new { mensaje = "El cliente no tiene correo registrado" });

                if (factura.EnviadaCliente)
                    return BadRequest(new { mensaje = "Esta factura ya fue enviada al cliente" });

                await _emailService.EnviarFacturaCliente(id);

                return Ok(new
                {
                    mensaje = "Factura enviada exitosamente al cliente",
                    correo = factura.Cliente.Correo,
                    fecha = DateTime.Now,
                    numeroFactura = factura.NumeroFactura
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    mensaje = "Error al enviar factura",
                    error = ex.Message
                });
            }
        }

        // POST: api/Facturas/5/enviar-dian
        [HttpPost("{id}/enviar-dian")]
        public async Task<IActionResult> EnviarADIAN(int id)
        {
            var factura = await _context.Facturas
                .Include(f => f.Cliente)
                .Include(f => f.Usuario)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (factura == null)
                return NotFound();

            if (!factura.DentroPlazoEnvioDIAN)
            {
                return BadRequest(new
                {
                    mensaje = "Factura fuera del plazo de 48 horas",
                    horasRestantes = factura.HorasRestantesEnvioDIAN
                });
            }

            try
            {
                // Aquí implementarías el envío real a DIAN
                factura.EnviadaDIAN = true;
                factura.FechaEnvioDIAN = DateTime.Now;
                factura.RespuestaDIAN = "Enviada exitosamente";

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    mensaje = "Factura enviada exitosamente a DIAN",
                    fechaEnvio = factura.FechaEnvioDIAN
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = "Error al enviar a DIAN", error = ex.Message });
            }
        }

        // ==================== REPORTES ====================

        // GET: api/Facturas/Reportes/Ventas
        [HttpGet("Reportes/Ventas")]
        public async Task<ActionResult> ObtenerReporteVentas(
            [FromQuery] DateTime? fechaInicio,
            [FromQuery] DateTime? fechaFin)
        {
            try
            {
                var query = _context.Facturas
                    .Include(f => f.Cliente)
                    .AsQueryable();

                // Aplicar filtros de fecha
                if (fechaInicio.HasValue)
                {
                    query = query.Where(f => f.FechaEmision >= fechaInicio.Value);
                }

                if (fechaFin.HasValue)
                {
                    query = query.Where(f => f.FechaEmision <= fechaFin.Value);
                }

                var facturas = await query
                    .OrderByDescending(f => f.FechaEmision)
                    .ToListAsync();

                var reporte = new
                {
                    totalFacturas = facturas.Count,
                    facturasPagadas = facturas.Count(f => f.Estado == "Pagada"),
                    facturasPendientes = facturas.Count(f => f.Estado == "Pendiente" || f.Estado == "Emitida"),
                    totalVentas = facturas.Sum(f => f.TotalFactura),
                    totalVentasPagadas = facturas.Where(f => f.Estado == "Pagada").Sum(f => f.TotalFactura),
                    totalVentasPendientes = facturas.Where(f => f.Estado != "Pagada").Sum(f => f.TotalFactura),
                    totalIVA = facturas.Sum(f => f.TotalIVA),
                    facturas = facturas.Select(f => new
                    {
                        f.Id,
                        f.NumeroFactura,
                        f.FechaEmision,
                        cliente = new
                        {
                            f.Cliente.Nombre,
                            f.Cliente.Apellido
                        },
                        f.Subtotal,
                        f.TotalIVA,
                        TotalINC = f.TotalINC ?? 0,
                        f.TotalFactura,
                        f.Estado,
                        f.MedioPago
                    }).ToList()
                };

                return Ok(reporte);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = "Error al generar reporte", error = ex.Message });
            }
        }

        // GET: api/Facturas/Reportes/TopClientes
        [HttpGet("Reportes/TopClientes")]
        public async Task<ActionResult> ObtenerTopClientes([FromQuery] int top = 10)
        {
            try
            {
                var topClientes = await _context.Facturas
                    .Include(f => f.Cliente)
                    .GroupBy(f => new
                    {
                        f.ClienteId,
                        f.Cliente.Nombre,
                        f.Cliente.Apellido
                    })
                    .Select(g => new
                    {
                        clienteId = g.Key.ClienteId,
                        nombreCliente = $"{g.Key.Nombre} {g.Key.Apellido}",
                        totalFacturas = g.Count(),
                        totalCompras = g.Sum(f => f.TotalFactura)
                    })
                    .OrderByDescending(x => x.totalCompras)
                    .Take(top)
                    .ToListAsync();

                return Ok(topClientes);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = "Error al obtener top clientes", error = ex.Message });
            }
        }

        // GET: api/Facturas/Reportes/ProductosMasVendidos
        [HttpGet("Reportes/ProductosMasVendidos")]
        public async Task<ActionResult> ObtenerProductosMasVendidos([FromQuery] int top = 10)
        {
            try
            {
                var productosMasVendidos = await _context.DetalleFacturas
                    .Include(d => d.Producto)
                    .GroupBy(d => new
                    {
                        d.ProductoId,
                        d.Producto.Nombre
                    })
                    .Select(g => new
                    {
                        productoId = g.Key.ProductoId,
                        nombreProducto = g.Key.Nombre,
                        cantidadVendida = g.Sum(d => d.Cantidad),
                        totalVentas = g.Sum(d => d.Cantidad * d.PrecioUnitario)
                    })
                    .OrderByDescending(x => x.cantidadVendida)
                    .Take(top)
                    .ToListAsync();

                return Ok(productosMasVendidos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = "Error al obtener productos más vendidos", error = ex.Message });
            }
        }

        // GET: api/Facturas/proximas-vencer-dian
        [HttpGet("proximas-vencer-dian")]
        public async Task<ActionResult<IEnumerable<Factura>>> ObtenerProximasVencerDIAN()
        {
            var facturas = await _context.Facturas
                .Where(f => !f.EnviadaDIAN && f.FechaLimiteEnvioDIAN <= DateTime.Now.AddHours(24))
                .Include(f => f.Cliente)
                .ToListAsync();

            return Ok(facturas);
        }

        // GET: api/Facturas/vencidas
        [HttpGet("vencidas")]
        public async Task<ActionResult<IEnumerable<Factura>>> ObtenerFacturasVencidas()
        {
            var facturas = await _context.Facturas
                .Include(f => f.Cliente)
                .ToListAsync();

            var vencidas = facturas.Where(f => f.EstaVencida).ToList();
            return Ok(vencidas);
        }

        // ==================== MÉTODOS AUXILIARES ====================

        // GET: api/Facturas/5/pdf
        [HttpGet("{id}/pdf")]
        public async Task<IActionResult> DescargarPdf(int id)
        {
            var factura = await _context.Facturas.Include(f => f.Cliente).FirstOrDefaultAsync(f => f.Id == id);
            if (factura == null) return NotFound();

            // Aquí usa tu generador PDF real o simula uno temporal
            var path = $"./PDF/factura_{id}.pdf"; // Debe existir o debes generarlo al vuelo
            if (!System.IO.File.Exists(path))
                return NotFound();

            var stream = new FileStream(path, FileMode.Open, FileAccess.Read);
            return File(stream, "application/pdf", $"Factura_{id}.pdf");
        }
        private bool FacturaExists(int id)
        {
            return _context.Facturas.Any(e => e.Id == id);
        }
        // PATCH: api/Facturas/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> RegistrarPago(int id, [FromBody] FacturaPagoDto pago)
        {
            if (pago == null)
                return BadRequest(new { mensaje = "Datos de pago inválidos." });

            var factura = await _context.Facturas.FindAsync(id);
            if (factura == null)
                return NotFound(new { mensaje = "Factura no encontrada." });

            if (!string.IsNullOrEmpty(pago.Estado))
                factura.Estado = pago.Estado;
            if (!string.IsNullOrEmpty(pago.MedioPago))
                factura.MedioPago = pago.MedioPago;
            if (!string.IsNullOrEmpty(pago.FormaPago))
                factura.FormaPago = pago.FormaPago;
            if (pago.MontoPagado > 0)
                factura.MontoPagado = pago.MontoPagado;
            factura.FechaPago = pago.FechaPago != default(DateTime) ? pago.FechaPago : DateTime.Now;
            if (!string.IsNullOrEmpty(pago.Observaciones))
                factura.Observaciones = pago.Observaciones;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
    }

