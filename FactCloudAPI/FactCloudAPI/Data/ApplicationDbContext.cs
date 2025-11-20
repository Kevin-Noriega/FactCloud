using FacturacionAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace FacturacionAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Factura> Facturas { get; set; }
        public DbSet<DetalleFactura> DetalleFacturas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cliente -> Usuario (relación 1:N)
            modelBuilder.Entity<Cliente>()
                .HasOne(c => c.Usuario)
                .WithMany(u => u.Clientes)
                .HasForeignKey(c => c.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            // Producto -> Usuario (relación 1:N)
            modelBuilder.Entity<Producto>()
                .HasOne(p => p.Usuario)
                .WithMany(u => u.Productos)
                .HasForeignKey(p => p.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            // Factura -> Usuario (relación 1:N)
            modelBuilder.Entity<Factura>()
                .HasOne(f => f.Usuario)
                .WithMany(u => u.Facturas)
                .HasForeignKey(f => f.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            // Factura -> Cliente (relación 1:N)
            modelBuilder.Entity<Factura>()
                .HasOne(f => f.Cliente)
                .WithMany(c => c.Facturas)
                .HasForeignKey(f => f.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);

            // DetalleFactura -> Factura (relación 1:N con cascada)
            modelBuilder.Entity<DetalleFactura>()
                .HasOne(d => d.Factura)
                .WithMany(f => f.DetalleFacturas)
                .HasForeignKey(d => d.FacturaId)
                .OnDelete(DeleteBehavior.Cascade);

            // DetalleFactura -> Producto (relación 1:N)
            modelBuilder.Entity<DetalleFactura>()
                .HasOne(d => d.Producto)
                .WithMany()
                .HasForeignKey(d => d.ProductoId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
