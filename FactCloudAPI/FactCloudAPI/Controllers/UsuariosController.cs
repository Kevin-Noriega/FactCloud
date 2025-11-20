using FacturacionAPI.Data;
using FacturacionAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace FacturacionAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsuariosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsuariosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/usuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            return await _context.Usuarios.ToListAsync();
        }

        // GET: api/usuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
                return NotFound();

            return usuario;
        }

        // POST: api/usuarios
        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {
            // Validación de correo único
            if (await _context.Usuarios.AnyAsync(u => u.Correo == usuario.Correo))
                return BadRequest(new { mensaje = "El correo ya está registrado." });

            usuario.FechaRegistro = DateTime.UtcNow;
            usuario.Estado = true;
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsuario), new { id = usuario.Id }, usuario);
        }

        // PATCH: api/usuarios/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchUsuario(int id, [FromBody] JsonElement datos)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
                return NotFound();

            // Actualizar solo los campos presentes en el request
            if (datos.TryGetProperty("nombre", out var nombre)) usuario.Nombre = nombre.GetString();
            if (datos.TryGetProperty("apellido", out var apellido)) usuario.Apellido = apellido.GetString();
            if (datos.TryGetProperty("correo", out var correo)) usuario.Correo = correo.GetString();
            if (datos.TryGetProperty("telefono", out var telefono)) usuario.Telefono = telefono.GetString();
            if (datos.TryGetProperty("nombreNegocio", out var nombreNegocio)) usuario.NombreNegocio = nombreNegocio.GetString();
            if (datos.TryGetProperty("logoNegocio", out var logoNegocio)) usuario.LogoNegocio = logoNegocio.GetString();
            if (datos.TryGetProperty("nitNegocio", out var nitNegocio)) usuario.NitNegocio = nitNegocio.GetString();
            if (datos.TryGetProperty("direccionNegocio", out var direccion)) usuario.DireccionNegocio = direccion.GetString();
            if (datos.TryGetProperty("tipoRegimen", out var regimen)) usuario.TipoRegimen = regimen.GetString();

            try
            {
                await _context.SaveChangesAsync();
                return Ok(usuario);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = "Error al actualizar", error = ex.Message });
            }
        }

        // PUT: api/usuarios/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(int id, Usuario usuario)
        {
            if (id != usuario.Id)
                return BadRequest(new { mensaje = "El ID no coincide" });

            _context.Entry(usuario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Usuarios.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/usuarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
                return NotFound();

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
