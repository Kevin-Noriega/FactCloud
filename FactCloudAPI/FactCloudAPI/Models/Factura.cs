using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FacturacionAPI.Models;

namespace FacturacionAPI.Models
{
    public class Factura
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }

        [Required]
        public int ClienteId { get; set; }
        public Cliente? Cliente { get; set; }

        // Numeración y fechas
        [Required]
        [MaxLength(50)]
        public string NumeroFactura { get; set; }

        [MaxLength(50)]
        public string? Prefijo { get; set; }

        [Required]
        public DateTime FechaEmision { get; set; } = DateTime.Now;

        public DateTime? FechaVencimiento { get; set; }

        [MaxLength(50)]
        public string? HoraEmision { get; set; }

        // CUFE y QRCode
        [MaxLength(500)]
        public string? CUFE { get; set; }

        [MaxLength(500)]
        public string? QRCode { get; set; }

        // Valores monetarios
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalIVA { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? TotalINC { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? TotalDescuentos { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? TotalRetenciones { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalFactura { get; set; }

        // Método y medio de pago
        [Required]
        [MaxLength(50)]
        public string FormaPago { get; set; } = "Contado";

        [Required]
        [MaxLength(50)]
        public string MedioPago { get; set; } = "Efectivo";

        // Crédito y observaciones
        public int? DiasCredito { get; set; }
        [MaxLength(2000)]
        public string? Observaciones { get; set; }

        // Estado y envío DIAN
        [Required]
        [MaxLength(50)]
        public string Estado { get; set; } = "Emitida";

        public bool EnviadaDIAN { get; set; } = false;

        public DateTime? FechaLimiteEnvioDIAN { get; set; }
        public DateTime? FechaEnvioDIAN { get; set; }

        [MaxLength(500)]
        public string? RespuestaDIAN { get; set; }

        public DateTime FechaRegistro { get; set; } = DateTime.Now;

        // Envío a cliente
        public bool EnviadaCliente { get; set; } = false;
        public DateTime? FechaEnvioCliente { get; set; }

        // Pago y abonos
        public decimal? MontoPagado { get; set; }
        public DateTime? FechaPago { get; set; }

        // Detalles de factura
        public ICollection<DetalleFactura>? DetalleFacturas { get; set; }

        // Métodos auxiliares

        public void CalcularFechas()
        {
            if (string.IsNullOrEmpty(HoraEmision))
            {
                HoraEmision = FechaEmision.ToString("HH:mm:ss");
            }

            FechaLimiteEnvioDIAN = FechaEmision.AddHours(48);

            if (FormaPago == "Credito" && DiasCredito.HasValue && DiasCredito > 0)
            {
                FechaVencimiento = FechaEmision.AddDays(DiasCredito.Value);
            }
            else
            {
                FechaVencimiento = FechaEmision;
            }
        }

        [NotMapped]
        public bool DentroPlazoEnvioDIAN => EnviadaDIAN || (FechaLimiteEnvioDIAN.HasValue && DateTime.Now <= FechaLimiteEnvioDIAN);

        [NotMapped]
        public bool EstaVencida => FechaVencimiento.HasValue && DateTime.Now > FechaVencimiento && Estado != "Pagada";

        [NotMapped]
        public int? HorasRestantesEnvioDIAN
        {
            get
            {
                if (EnviadaDIAN || !FechaLimiteEnvioDIAN.HasValue) return null;
                var horasRestantes = (FechaLimiteEnvioDIAN.Value - DateTime.Now).TotalHours;
                return horasRestantes > 0 ? (int)Math.Ceiling(horasRestantes) : 0;
            }
        }
    }
}
