using FacturacionAPI.Data;
using FacturacionAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FacturacionAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Clientes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
        {
            try
            {
                var clientes = await _context.Clientes.ToListAsync();
                return Ok(clientes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener clientes", error = ex.Message });
            }
        }

        // GET: api/Clientes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> GetCliente(int id)
        {
            try
            {
                var cliente = await _context.Clientes.FindAsync(id);

                if (cliente == null)
                {
                    return NotFound(new { message = $"Cliente con ID {id} no encontrado" });
                }

                return Ok(cliente);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener cliente", error = ex.Message });
            }
        }

        // GET: api/Clientes/usuario/1
        [HttpGet("usuario/{usuarioId}")]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientesPorUsuario(int usuarioId)
        {
            try
            {
                var clientes = await _context.Clientes
                    .Where(c => c.UsuarioId == usuarioId)
                    .ToListAsync();

                return Ok(clientes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener clientes", error = ex.Message });
            }
        }

        // POST: api/Clientes
        [HttpPost]
        public async Task<ActionResult<Cliente>> PostCliente(Cliente cliente)
        {
            try
            {
                // Validar que el usuario existe
                var usuario = await _context.Usuarios.FindAsync(cliente.UsuarioId);
                if (usuario == null)
                {
                    return BadRequest(new { message = "El usuario especificado no existe" });
                }

                _context.Clientes.Add(cliente);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCliente), new { id = cliente.Id }, cliente);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al crear cliente", error = ex.Message });
            }
        }

        // PUT: api/Clientes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCliente(int id, Cliente cliente)
        {
            if (id != cliente.Id)
            {
                return BadRequest(new { message = "El ID del cliente no coincide" });
            }

            _context.Entry(cliente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteExists(id))
                {
                    return NotFound(new { message = $"Cliente con ID {id} no encontrado" });
                }
                throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al actualizar cliente", error = ex.Message });
            }
        }

        // DELETE: api/Clientes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            try
            {
                var cliente = await _context.Clientes.FindAsync(id);

                if (cliente == null)
                {
                    return NotFound(new { message = $"Cliente con ID {id} no encontrado" });
                }

                _context.Clientes.Remove(cliente);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cliente eliminado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al eliminar cliente", error = ex.Message });
            }
        }

        // Método auxiliar para verificar si existe un cliente
        private bool ClienteExists(int id)
        {
            return _context.Clientes.Any(e => e.Id == id);

        }
    }
}
