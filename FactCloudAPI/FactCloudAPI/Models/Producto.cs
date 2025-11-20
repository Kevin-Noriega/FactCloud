using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FacturacionAPI.Models
{
    public class Producto
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Usuario")]
        public int UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }

        // Información general
        [Required]
        [MaxLength(500)]
        public string Nombre { get; set; }

        [MaxLength(1000)]
        public string? Descripcion { get; set; }

        // Codificación estándar
        [MaxLength(100)]
        public string? CodigoInterno { get; set; }

        [MaxLength(100)]
        public string? CodigoUNSPSC { get; set; }

        [MaxLength(100)]
        public string? CodigoEAN { get; set; }

        // Unidad de medida
        [Required]
        [MaxLength(50)]
        public string UnidadMedida { get; set; } = "Unidad";

        // Marca y modelo
        [MaxLength(200)]
        public string? Marca { get; set; }

        [MaxLength(200)]
        public string? Modelo { get; set; }

        // Valores monetarios
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioUnitario { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Costo { get; set; }

        // Impuestos - requisitos DIAN
        [Required]
        [MaxLength(50)]
        public string TipoImpuesto { get; set; } = "IVA";

        [Required]
        [Column(TypeName = "decimal(5,2)")]
        public decimal TarifaIVA { get; set; } // Ej: 0, 5, 19

        public bool ProductoExcluido { get; set; } = false;
        public bool ProductoExento { get; set; } = false;

        // Impuesto al consumo (INC)
        public bool GravaINC { get; set; } = false;

        [Column(TypeName = "decimal(5,2)")]
        public decimal? TarifaINC { get; set; }

        // Inventario
        public int CantidadDisponible { get; set; }
        public int CantidadMinima { get; set; } = 0;

        [MaxLength(200)]
        public string? Categoria { get; set; }

        [MaxLength(200)]
        public string? CodigoBarras { get; set; }

        // Nuevos campos tributarios relacionados a retenciones y base gravable
        [MaxLength(50)]
        public string? TipoProducto { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? BaseGravable { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? RetencionFuente { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? RetencionIVA { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? RetencionICA { get; set; }

        public bool Activo { get; set; } = true;
        public DateTime FechaRegistro { get; set; } = DateTime.Now;

        public ICollection<DetalleFactura>? DetalleFacturas { get; set; }
    }
}
