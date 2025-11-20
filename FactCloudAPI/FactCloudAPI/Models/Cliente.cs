using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FacturacionAPI.Models
{
    public class Cliente
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Usuario")]
        public int UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }

        // Información básica y comercial
        [Required]
        [MaxLength(200)]
        public string Nombre { get; set; }

        [MaxLength(200)]
        public string? Apellido { get; set; }

        [MaxLength(200)]
        public string? NombreComercial { get; set; }

        // Identificación tributaria y legal
        [Required]
        [MaxLength(50)]
        public string TipoIdentificacion { get; set; } // CC, NIT, CE, Pasaporte

        [Required]
        [MaxLength(50)]
        public string NumeroIdentificacion { get; set; }

        public int? DigitoVerificacion { get; set; }

        [Required]
        [MaxLength(50)]
        public string TipoPersona { get; set; } // Natural, Jurídica

        [Required]
        [MaxLength(100)]
        public string RegimenTributario { get; set; } // Simplificado, Común, Gran Contribuyente

        [MaxLength(100)]
        public string? TipoResponsabilidad { get; set; }

        [MaxLength(100)]
        public string? TipoRegimen { get; set; }

        // Contacto y ubicación
        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string Correo { get; set; }

        [MaxLength(50)]
        public string? Telefono { get; set; }

        [Required]
        [MaxLength(100)]
        public string Departamento { get; set; }

        [Required]
        [MaxLength(100)]
        public string Ciudad { get; set; }

        [Required]
        [MaxLength(500)]
        public string Direccion { get; set; }

        [MaxLength(20)]
        public string? CodigoPostal { get; set; }

        [MaxLength(20)]
        public string? MunicipioCodigo { get; set; }

        [MaxLength(20)]
        public string? DepartamentoCodigo { get; set; }

        [MaxLength(5)]
        public string Pais { get; set; } = "CO";

        [MaxLength(20)]
        public string? ActividadEconomicaCIIU { get; set; }

        // Responsabilidades fiscales
        [MaxLength(100)]
public string? RegimenFiscal { get; set; }
        public bool RetenedorIVA { get; set; } = false;
        public bool RetenedorICA { get; set; } = false;
        public bool RetenedorRenta { get; set; } = false;
        public bool AutoretenedorRenta { get; set; } = false;

        // Estado y registro
        public bool Activo { get; set; } = true;
        public DateTime FechaRegistro { get; set; } = DateTime.Now;

        // Relación 1:N con Facturas
        public ICollection<Factura>? Facturas { get; set; }
    }
}
