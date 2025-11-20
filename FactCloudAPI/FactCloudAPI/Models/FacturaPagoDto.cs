namespace FacturacionAPI.Models
{
    public class FacturaPagoDto
    {
        public string Estado { get; set; } // "Pagada" o "Abonada"
        public string MedioPago { get; set; } // Efectivo, Transferencia, etc
        public string FormaPago { get; set; } // Contado, Crédito, Abono, etc
        public decimal MontoPagado { get; set; } // Cuánto está pagando
        public DateTime FechaPago { get; set; } // Registrar fecha real
        public string Referencia { get; set; } // # de transacción, cheque, etc
        public string BancoOrigen { get; set; } // Si es transferencia
        public string BancoDestino { get; set; } // Si es transferencia
        public string Observaciones { get; set; } // Comentarios generales

    }
}
