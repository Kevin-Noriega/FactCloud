using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FactCloudAPI.Migrations
{
    /// <inheritdoc />
    public partial class ActualizacionTokes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Apellido = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Correo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    ContrasenaHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NitNegocio = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    DvNitNegocio = table.Column<int>(type: "int", nullable: true),
                    NombreNegocio = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    TipoRegimen = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    DireccionNegocio = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CiudadNegocio = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    DepartamentoNegocio = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CorreoNegocio = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    LogoNegocio = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    TipoIdentificacion = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    CodigoPostal = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    DepartamentoCodigo = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    TelefonoNegocio = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    ActividadEconomicaCIIU = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    RegimenFiscal = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ResponsabilidadesRUT = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Pais = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    SoftwareProveedor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SoftwarePIN = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PrefijoAutorizadoDIAN = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NumeroResolucionDIAN = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FechaResolucionDIAN = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RangoNumeracionDesde = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RangoNumeracionHasta = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AmbienteDIAN = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Estado = table.Column<bool>(type: "bit", nullable: false),
                    FechaRegistro = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Clientes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Apellido = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    NombreComercial = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    TipoIdentificacion = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    NumeroIdentificacion = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DigitoVerificacion = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    TipoPersona = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    RegimenTributario = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TipoResponsabilidad = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    TipoRegimen = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Correo = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Departamento = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Ciudad = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Direccion = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CodigoPostal = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    MunicipioCodigo = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    DepartamentoCodigo = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Pais = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    ActividadEconomicaCIIU = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    RetenedorIVA = table.Column<bool>(type: "bit", nullable: false),
                    RetenedorICA = table.Column<bool>(type: "bit", nullable: false),
                    RetenedorRenta = table.Column<bool>(type: "bit", nullable: false),
                    AutoretenedorRenta = table.Column<bool>(type: "bit", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    FechaRegistro = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clientes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Clientes_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Productos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CodigoInterno = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CodigoUNSPSC = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CodigoEAN = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    UnidadMedida = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Marca = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Modelo = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    PrecioUnitario = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Costo = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    TipoImpuesto = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TarifaIVA = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    ProductoExcluido = table.Column<bool>(type: "bit", nullable: false),
                    ProductoExento = table.Column<bool>(type: "bit", nullable: false),
                    GravaINC = table.Column<bool>(type: "bit", nullable: false),
                    TarifaINC = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    CantidadDisponible = table.Column<int>(type: "int", nullable: false),
                    CantidadMinima = table.Column<int>(type: "int", nullable: false),
                    Categoria = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CodigoBarras = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    TipoProducto = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    BaseGravable = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RetencionFuente = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RetencionIVA = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RetencionICA = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    FechaRegistro = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Productos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Productos_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Facturas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    ClienteId = table.Column<int>(type: "int", nullable: false),
                    NumeroFactura = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Prefijo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    FechaEmision = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaVencimiento = table.Column<DateTime>(type: "datetime2", nullable: true),
                    HoraEmision = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CUFE = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    QRCode = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Subtotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalIVA = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalINC = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    TotalDescuentos = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    TotalRetenciones = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    TotalFactura = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    FormaPago = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MedioPago = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DiasCredito = table.Column<int>(type: "int", nullable: true),
                    Observaciones = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    Estado = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    EnviadaDIAN = table.Column<bool>(type: "bit", nullable: false),
                    FechaLimiteEnvioDIAN = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FechaEnvioDIAN = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RespuestaDIAN = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    FechaRegistro = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EnviadaCliente = table.Column<bool>(type: "bit", nullable: false),
                    FechaEnvioCliente = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MontoPagado = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    FechaPago = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Facturas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Facturas_Clientes_ClienteId",
                        column: x => x.ClienteId,
                        principalTable: "Clientes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Facturas_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DetalleFacturas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FacturaId = table.Column<int>(type: "int", nullable: false),
                    ProductoId = table.Column<int>(type: "int", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Cantidad = table.Column<int>(type: "int", nullable: false),
                    UnidadMedida = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PrecioUnitario = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PorcentajeDescuento = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    ValorDescuento = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SubtotalLinea = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TarifaIVA = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    ValorIVA = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TarifaINC = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    ValorINC = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    TotalLinea = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ProductoId1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DetalleFacturas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DetalleFacturas_Facturas_FacturaId",
                        column: x => x.FacturaId,
                        principalTable: "Facturas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DetalleFacturas_Productos_ProductoId",
                        column: x => x.ProductoId,
                        principalTable: "Productos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DetalleFacturas_Productos_ProductoId1",
                        column: x => x.ProductoId1,
                        principalTable: "Productos",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Clientes_UsuarioId",
                table: "Clientes",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_DetalleFacturas_FacturaId",
                table: "DetalleFacturas",
                column: "FacturaId");

            migrationBuilder.CreateIndex(
                name: "IX_DetalleFacturas_ProductoId",
                table: "DetalleFacturas",
                column: "ProductoId");

            migrationBuilder.CreateIndex(
                name: "IX_DetalleFacturas_ProductoId1",
                table: "DetalleFacturas",
                column: "ProductoId1");

            migrationBuilder.CreateIndex(
                name: "IX_Facturas_ClienteId",
                table: "Facturas",
                column: "ClienteId");

            migrationBuilder.CreateIndex(
                name: "IX_Facturas_UsuarioId",
                table: "Facturas",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Productos_UsuarioId",
                table: "Productos",
                column: "UsuarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DetalleFacturas");

            migrationBuilder.DropTable(
                name: "Facturas");

            migrationBuilder.DropTable(
                name: "Productos");

            migrationBuilder.DropTable(
                name: "Clientes");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
