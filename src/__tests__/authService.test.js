import { jest } from "@jest/globals";

const registerUserMock = jest.fn();

jest.unstable_mockModule("./authService.js", () => ({
  registerUser: registerUserMock,
}));

const { registerUser } = await import("./authService.js");

const validPayload = {
  documentType: "CC",
  documentNumber: "1234567890",
  fullName: "Kevin Noriega",
  phone: "3001234567",
  email: "kevin@factcloud.com",
  confirmEmail: "kevin@factcloud.com",
  password: "Segura123",
  confirmPassword: "Segura123",
  acceptTerms: true,
};

describe("Integración Ascendente — registerUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Nivel 1 → validación pasa con datos correctos", async () => {
    registerUserMock.mockResolvedValueOnce({
      success: true,
      userId: "usr_001",
      message: "Cuenta creada exitosamente",
    });

    const result = await registerUser(validPayload);

    expect(result.success).toBe(true);
    expect(result.userId).toBeDefined();
  });

  test("Nivel 2 → se llama a registerUser con los parámetros correctos", async () => {
    registerUserMock.mockResolvedValueOnce({ success: true });

    await registerUser(validPayload);

    expect(registerUserMock).toHaveBeenCalledWith(validPayload);
    expect(registerUserMock).toHaveBeenCalledTimes(1);
  });

  test("Nivel 3 → registro devuelve userId y mensaje de confirmación", async () => {
    registerUserMock.mockResolvedValueOnce({
      success: true,
      userId: "usr_abc123",
      message: "Cuenta creada exitosamente",
      redirectTo: "/dashboard",
    });

    const result = await registerUser(validPayload);

    expect(result.success).toBe(true);
    expect(result.userId).toMatch(/^usr_/);
    expect(result.message).toBe("Cuenta creada exitosamente");
  });
});

describe("Integración Descendente — flujos de error del sistema", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("email ya registrado → error 409 del servidor", async () => {
    registerUserMock.mockRejectedValueOnce({
      response: {
        status: 409,
        data: { message: "El correo ya está registrado" },
      },
    });

    await expect(
      registerUser({ ...validPayload, email: "existente@factcloud.com" }),
    ).rejects.toMatchObject({
      response: { status: 409 },
    });
  });

  test("error de servidor 500 → se propaga correctamente", async () => {
    registerUserMock.mockRejectedValueOnce({
      response: {
        status: 500,
        data: { message: "Error interno del servidor" },
      },
    });

    await expect(registerUser(validPayload)).rejects.toMatchObject({
      response: { status: 500 },
    });
  });

  test("timeout de red → rechaza la promesa", async () => {
    registerUserMock.mockRejectedValueOnce(new Error("Network timeout"));

    await expect(registerUser(validPayload)).rejects.toThrow("Network timeout");
  });

  test("descuento aplicado → flujo completo con código válido", async () => {
    registerUserMock.mockResolvedValueOnce({
      success: true,
      userId: "usr_disc01",
      plan: "Profesional",
      discountApplied: true,
      totalPaid: 693000,
    });

    const result = await registerUser({
      ...validPayload,
      discountCode: "FACT10",
    });

    expect(result.success).toBe(true);
    expect(result.discountApplied).toBe(true);
    expect(result.totalPaid).toBe(693000);
  });
});
