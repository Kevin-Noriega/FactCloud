using FacturacionAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(ApplicationDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDTO model)
    {
        var usuario = _context.Usuarios
            .FirstOrDefault(u => u.Correo == model.Correo);

        if (usuario == null)
            return Unauthorized(new { message = "Usuario no encontrado" });

        if (usuario.ContrasenaHash != model.Contrasena) // si no hay hash
            return Unauthorized(new { message = "Contraseña incorrecta" });

        var token = GenerarToken(usuario.Correo);

        return Ok(new { token, usuario });
    }

    private string GenerarToken(string correo)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, correo),
            new Claim("role", "Usuario")
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(3),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class LoginDTO
{
    public string Correo { get; set; }
    public string Contrasena { get; set; }
}