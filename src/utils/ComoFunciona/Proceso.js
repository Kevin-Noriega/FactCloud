const Proceso =[
    {
        numer : 1,
        titulo : "Validación de datos",
        descripcion : " Sistema verifica NIT, resolución DIAN, productos y cálculos matemáticos antes de continuar."
    },
    {
        numer : 2,
        titulo : "Generación XML",
        descripcion : "Motor de plantillas crea documento XML según estándar UBL 2.1 y anexo técnico 1.9."
    },
    {
        numer : 3,
        titulo : "Firma digital",
        descripcion : "Certificado digital firma el XML generando hash SHA-256 y calculando CUFE único."
    },
    {
        numer : 4,
        titulo : "Envío a DIAN",
        descripcion : "Transmisión segura mediante SOAP/REST con reintentos automáticos y circuit breaker."
    },
    {
        numer : 5,
        titulo : "Respuesta y PDF",
        descripcion : "DIAN valida y responde. Sistema genera PDF profesional y envía por email al cliente."

}]
export default Proceso;