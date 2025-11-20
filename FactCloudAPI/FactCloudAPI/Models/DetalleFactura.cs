using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FacturacionAPI.Models
{
    public class DetalleFactura
    {
        public int Id { get; set; }

        [Required]
        public int FacturaId { get; set; }
        public Factura? Factura { get; set; }

        [Required]
        public int ProductoId { get; set; }
        public Producto? Producto { get; set; }

        // Descripcion y Cantidad
        [Required]
        [StringLength(500)]
        public string Descripcion { get; set; }

        [Required]
        public int Cantidad { get; set; }

        [Required]
        [StringLength(50)]
        public string UnidadMedida { get; set; }

        // Valores
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioUnitario { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? PorcentajeDescuento { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? ValorDescuento { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal SubtotalLinea { get; set; }

        // Impuestos
        [Required]
        [Column(TypeName = "decimal(5,2)")]
        public decimal TarifaIVA { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorIVA { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? TarifaINC { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? ValorINC { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalLinea { get; set; }
    }
}
