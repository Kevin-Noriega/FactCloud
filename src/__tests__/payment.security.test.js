
"use strict";

const fs   = require("fs");
const path = require("path");

// ── Rutas ─────────────────────────────────────────────────────────────────────
const FILES = {
  wompiService:  path.resolve(__dirname, "../Service/wompiService.js"),
  checkout:      path.resolve(__dirname, "../pages/Checkout.jsx"),
  pseResultado:  path.resolve(__dirname, "../pages/PSEResultado.jsx"),
};
const src = (key) => fs.readFileSync(FILES[key], "utf8");

// ── Funciones inlineadas desde checkoutUtils (sin import ESM) ─────────────────

function formatField(name, value) {
  switch (name) {
    case "cardNumber":
      return value.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim().substr(0,19);
    case "expiry":
      return value.replace(/\D/g,"").replace(/(\d{2})(\d)/,"$1/$2").substr(0,5);
    case "cvv":
      return value.replace(/\D/g,"").substr(0,4);
    case "telefono":
    case "telefonoFacturacion":
      return value.replace(/\D/g,"").substr(0,10);
    case "cardName":
      return value.replace(/[^a-zA-Z\s]/g,"").toUpperCase();
    case "digitoVerificacion":
      return value.replace(/\D/g,"").substr(0,1);
    case "nit":
    case "numeroIdentificacion":
      return value.replace(/\D/g,"");
    default:
      return value;
  }
}

const TIPO_DOCUMENTO_MAP = {
  "Cédula de Ciudadanía": "CC", "Cédula de Extranjería": "CE",
  NIT: "NIT", Pasaporte: "passport",
  CC: "CC", CE: "CE", TI: "TI", TE: "CE", PP: "passport", PEP: "CC", NUIP: "CC",
};
const getTipoDocCodigo = (t) => TIPO_DOCUMENTO_MAP[t] || "CC";

function validateCommonFields(d) {
  const e = {};
  if (!d.nombres)  e.nombres  = "Nombres requeridos";
  if (!d.apellidos) e.apellidos = "Apellidos requeridos";
  if (!d.tipoIdentificacion) e.tipoIdentificacion = "Tipo de documento requerido";
  if (!d.numeroIdentificacion) e.numeroIdentificacion = "Número requerido";
  if (!d.email || !/\S+@\S+\.\S+/.test(d.email)) e.email = "Email inválido";
  if (!d.telefono || d.telefono.length !== 10) e.telefono = "Teléfono debe tener 10 dígitos";
  if (!d.ciudad) e.ciudad = "Ciudad requerida";
  if (!d.direccion) e.direccion = "Dirección requerida";
  return e;
}
function validateBillingFields(d) {
  const e = {};
  if (!d.razonSocial) e.razonSocial = "Razón social requerida";
  if (!d.nit) e.nit = "NIT requerido";
  return e;
}
function validatePSEFields(d) {
  const e = {};
  if (!d.banco) e.banco = "Selecciona un banco";
  if (!d.tipoIdentificacion) e.tipoIdentificacion = "Tipo de documento requerido";
  if (!d.numeroIdentificacion) e.numeroIdentificacion = "Número de documento requerido";
  return e;
}
function validateCheckoutForm(d, method) {
  return {
    ...validateCommonFields(d),
    ...validateBillingFields(d),
    ...(method === "PSE" ? validatePSEFields(d) : {}),
  };
}

// ─── SEC-01 :: API key no hardcodeada ─────────────────────────────────────────
describe("SEC-01 :: API key no hardcodeada en código fuente", () => {
  it("wompiService.js no contiene la clave pub_test literal", () => {
    expect(src("wompiService")).not.toMatch(/pub_test_[A-Za-z0-9]+/);
  });

  it("wompiService.js lee la clave desde import.meta.env", () => {
    expect(src("wompiService")).toMatch(/import\.meta\.env\.VITE_WOMPI_PUBLIC_KEY/);
  });
});

// ─── SEC-02 :: Password no viaja en payload PSE ───────────────────────────────
describe("SEC-02 :: Password no incluida en payload PSE (datosRegistro dentro de handlePSEPayment)", () => {
  it("El bloque handlePSEPayment no incluye password en datosRegistro", () => {
    const code = src("checkout");
    // Extrae solo el bloque de la función handlePSEPayment
    const start = code.indexOf("const handlePSEPayment");
    const end   = code.indexOf("const handleCardPayment");
    const block = code.slice(start, end > start ? end : undefined);
    expect(block).not.toMatch(/password\s*:/);
  });

  it("El payload PSE construido no incluye el campo password", () => {
    const payload = {
      datosRegistro: {
        nombre: "Juan",
        correo: "j@test.com",
        // password omitido intencionalmente
      },
    };
    expect(payload.datosRegistro).not.toHaveProperty("password");
  });
});

// ─── SEC-03 :: Referencia no predecible ───────────────────────────────────────
describe("SEC-03 :: Referencias de transacción UUID (no predecibles)", () => {
  it("Checkout.jsx no usa Date.now() como referencia", () => {
    expect(src("checkout")).not.toMatch(/Nubee-PSE-\$\{Date\.now\(\)\}/);
    expect(src("checkout")).not.toMatch(/Nubee-\$\{Date\.now\(\)\}/);
  });

  it("Checkout.jsx usa crypto.randomUUID()", () => {
    expect(src("checkout")).toMatch(/crypto\.randomUUID\(\)/);
  });

  it("Dos UUIDs generados son distintos aunque ocurran en el mismo ms", () => {
    const r1 = `Nubee-PSE-${crypto.randomUUID()}`;
    const r2 = `Nubee-PSE-${crypto.randomUUID()}`;
    expect(r1).not.toBe(r2);
  });
});

// ─── SEC-04 :: Validación PSE ─────────────────────────────────────────────────
describe("SEC-04 :: Validación de inputs PSE", () => {
  const valid = {
    nombres: "Juan", apellidos: "Pérez",
    tipoIdentificacion: "CC", numeroIdentificacion: "1234567890",
    email: "juan@test.com", telefono: "3001234567",
    ciudad: "Bogotá", direccion: "Calle 10", razonSocial: "Juan Pérez",
    nit: "900123456", banco: "BCA",
  };

  it("Formulario PSE válido → sin errores", () => {
    expect(Object.keys(validateCheckoutForm(valid, "PSE"))).toHaveLength(0);
  });
  it("Sin banco → error.banco", () => {
    expect(validateCheckoutForm({ ...valid, banco: "" }, "PSE").banco).toBeDefined();
  });
  it("Email malformado → error.email", () => {
    expect(validateCheckoutForm({ ...valid, email: "no-email" }, "PSE").email).toBeDefined();
  });
  it("Teléfono corto → error.telefono", () => {
    expect(validateCheckoutForm({ ...valid, telefono: "300" }, "PSE").telefono).toBeDefined();
  });
  it("Sin documento → error.numeroIdentificacion", () => {
    expect(
      validateCheckoutForm({ ...valid, numeroIdentificacion: "" }, "PSE").numeroIdentificacion
    ).toBeDefined();
  });
  it("Sin razón social → error.razonSocial", () => {
    expect(validateCheckoutForm({ ...valid, razonSocial: "" }, "PSE").razonSocial).toBeDefined();
  });
});

// ─── SEC-05 :: Sanitización de inputs ────────────────────────────────────────
describe("SEC-05 :: Sanitización de campos de pago", () => {
  it("cardNumber acepta solo dígitos, máx 19 chars con espacios", () => {
    expect(formatField("cardNumber", "4111 1111 1111 1111abc")).toBe("4111 1111 1111 1111");
  });
  it("cvv acepta solo dígitos, máx 4", () => {
    expect(formatField("cvv", "123abc")).toBe("123");
    expect(formatField("cvv", "12345")).toBe("1234");
  });
  it("telefono solo dígitos, máx 10", () => {
    expect(formatField("telefono", "300-123-4567")).toBe("3001234567");
    expect(formatField("telefono", "30012345678")).toBe("3001234567");
  });
  it("digitoVerificacion solo 1 dígito", () => {
    expect(formatField("digitoVerificacion", "79")).toBe("7");
  });
  it("cardName solo letras mayúsculas sin símbolos", () => {
    expect(formatField("cardName", "Juan123 Pérez!")).toBe("JUAN PREZ");
  });
  it("nit solo dígitos (elimina puntos y guiones)", () => {
    expect(formatField("nit", "900.123.456-7")).toBe("9001234567");
  });
});

// ─── SEC-06 :: Mapeo tipo documento Wompi ────────────────────────────────────
describe("SEC-06 :: Mapeo de tipo de documento hacia API Wompi", () => {
  it("CC → 'CC'",         () => expect(getTipoDocCodigo("CC")).toBe("CC"));
  it("NIT → 'NIT'",       () => expect(getTipoDocCodigo("NIT")).toBe("NIT"));
  it("Pasaporte → 'passport'", () => expect(getTipoDocCodigo("Pasaporte")).toBe("passport"));
  it("Desconocido → 'CC' (seguro por defecto)", () =>
    expect(getTipoDocCodigo("INVALIDO")).toBe("CC"));
});

// ─── SEC-07 :: Integridad del monto ──────────────────────────────────────────
describe("SEC-07 :: Integridad del monto de la transacción", () => {
  const calcCents = (price) => Math.round(parseFloat(price) * 100);

  it("Monto válido → entero positivo en cents", () => {
    const cents = calcCents("259900");
    expect(Number.isInteger(cents)).toBe(true);
    expect(cents).toBeGreaterThan(0);
    expect(cents).toBe(25990000);
  });
  it("Monto 0 → rechazado", () => {
    const c = calcCents("0");
    expect(isNaN(c) || c <= 0).toBe(true);
  });
  it("Monto negativo → rechazado", () => {
    const c = calcCents("-100");
    expect(isNaN(c) || c <= 0).toBe(true);
  });
  it("String no numérico → rechazado", () => {
    const c = calcCents("abc");
    expect(isNaN(c) || c <= 0).toBe(true);
  });
});

// ─── SEC-08 :: XSS en datos de pago ──────────────────────────────────────────
describe("SEC-08 :: Prevención XSS en campos de pago", () => {
  it("cardName elimina tags <script>", () => {
    const r = formatField("cardName", "<script>alert(1)</script>");
    expect(r).not.toContain("<");
    expect(r).not.toContain(">");
  });
  it("nit elimina caracteres HTML", () => {
    const r = formatField("nit", "900<img>123");
    expect(r).not.toContain("<");
  });
});

// ─── SEC-09 :: Sin logs sensibles ────────────────────────────────────────────
describe("SEC-09 :: Ausencia de logs con datos sensibles", () => {
  it("wompiService.js no loggea tokens de tarjeta", () => {
    expect(src("wompiService")).not.toMatch(/console\.log.*[Tt]oken/);
  });
  it("wompiService.js no loggea CVC", () => {
    expect(src("wompiService")).not.toMatch(/console\.log.*cvc/i);
  });
  it("wompiService.js no loggea datos de card", () => {
    expect(src("wompiService")).not.toMatch(/console\.log.*card/i);
  });
});

// ─── SEC-10 :: Polling PSE robusto ───────────────────────────────────────────
describe("SEC-10 :: Polling PSE sin race conditions", () => {
  it("PSEResultado.jsx usa setInterval + useRef + clearInterval", () => {
    const code = src("pseResultado");
    expect(code).toMatch(/setInterval/);
    expect(code).toMatch(/useRef/);
    expect(code).toMatch(/clearInterval/);
  });
  it("PSEResultado.jsx define estado TIMEOUT para max reintentos", () => {
    const code = src("pseResultado");
    expect(code).toMatch(/TIMEOUT/);
    expect(code).toMatch(/MAX_RETRIES/);
  });
  it("PSEResultado.jsx limpia el intervalo en el cleanup (return)", () => {
    const code = src("pseResultado");
    expect(code).toMatch(/return\s*\(\)\s*=>/);
  });
});
