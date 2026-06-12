// validators.test.js
import {
  validateDocumentType,
  validateDocumentNumber,
  validateFullName,
  validatePhone,
  validateEmail,
  validatePassword,
  validateRegisterForm,
} from './Registro.js';

// ============================================================
// CAMINO BÁSICO — flujo completo exitoso del formulario
// ============================================================
describe('Camino Básico — Registro exitoso', () => {
  const validData = {
    documentType: 'CC',
    documentNumber: '1234567890',
    fullName: 'Kevin Noriega',
    phone: '3001234567',
    email: 'kevin@factcloud.com',
    confirmEmail: 'kevin@factcloud.com',
    password: 'Segura123',
    confirmPassword: 'Segura123',
    acceptTerms: true,
  };

  test('debe retornar valid:true con todos los datos correctos', () => {
    const result = validateRegisterForm(validData);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  test('validateDocumentType acepta tipos válidos', () => {
    expect(validateDocumentType('CC')).toBe(true);
    expect(validateDocumentType('CE')).toBe(true);
    expect(validateDocumentType('NIT')).toBe(true);
    expect(validateDocumentType('PP')).toBe(true);
  });

  test('validateEmail acepta email con formato correcto', () => {
    expect(validateEmail('usuario@dominio.com')).toBe(true);
    expect(validateEmail('test.123@empresa.co')).toBe(true);
  });

  test('validatePassword acepta contraseña con mayúscula y número', () => {
    expect(validatePassword('Segura123')).toBe(true);
    expect(validatePassword('Abcd1234')).toBe(true);
  });
});

// ============================================================
// ANÁLISIS DE VALORES LÍMITE
// ============================================================
describe('Valores Límite — Número de documento (5-20 dígitos)', () => {
  test('4 dígitos → inválido (límite inferior - 1)', () => {
    expect(validateDocumentNumber('1234')).toBe(false);
  });

  test('5 dígitos → válido (límite inferior exacto)', () => {
    expect(validateDocumentNumber('12345')).toBe(true);
  });

  test('6 dígitos → válido (límite inferior + 1)', () => {
    expect(validateDocumentNumber('123456')).toBe(true);
  });

  test('10 dígitos → válido (valor típico)', () => {
    expect(validateDocumentNumber('1234567890')).toBe(true);
  });

  test('19 dígitos → válido (límite superior - 1)', () => {
    expect(validateDocumentNumber('1234567890123456789')).toBe(true);
  });

  test('20 dígitos → válido (límite superior exacto)', () => {
    expect(validateDocumentNumber('12345678901234567890')).toBe(true);
  });

  test('21 dígitos → inválido (límite superior + 1)', () => {
    expect(validateDocumentNumber('123456789012345678901')).toBe(false);
  });
});

describe('Valores Límite — Contraseña (mínimo 8 caracteres)', () => {
  test('7 caracteres → inválido', () => {
    expect(validatePassword('Abcd12')).toBe(false); // solo 6 con mayus y num
    expect(validatePassword('Abcde12')).toBe(false);
  });

  test('8 caracteres con mayúscula y número → válido', () => {
    expect(validatePassword('Abcde123')).toBe(true);
  });

  test('9+ caracteres → válido', () => {
    expect(validatePassword('MiClave1234')).toBe(true);
  });
});

describe('Valores Límite — Nombre completo (3-100 caracteres)', () => {
  test('2 caracteres → inválido', () => {
    expect(validateFullName('Ab')).toBe(false);
  });

  test('3 caracteres → válido', () => {
    expect(validateFullName('Ana')).toBe(true);
  });

  test('100 caracteres → válido', () => {
    expect(validateFullName('A'.repeat(100))).toBe(true);
  });

  test('101 caracteres → inválido', () => {
    expect(validateFullName('A'.repeat(101))).toBe(false);
  });
});

// ============================================================
// PARTICIÓN DE EQUIVALENCIA
// ============================================================
describe('Partición de Equivalencia — validateDocumentType', () => {
  // Clase válida
  test('CC es tipo válido', () => expect(validateDocumentType('CC')).toBe(true));
  test('NIT es tipo válido', () => expect(validateDocumentType('NIT')).toBe(true));

  // Clase inválida
  test('cadena vacía es inválida', () => expect(validateDocumentType('')).toBe(false));
  test('tipo desconocido es inválido', () => expect(validateDocumentType('DNI')).toBe(false));
  test('null es inválido', () => expect(validateDocumentType(null)).toBe(false));
});

describe('Partición de Equivalencia — validatePhone', () => {
  // Clase válida: empieza con 3 y tiene 10 dígitos
  test('3001234567 → válido', () => expect(validatePhone('3001234567')).toBe(true));
  test('3151234567 → válido', () => expect(validatePhone('3151234567')).toBe(true));

  // Clase inválida: no empieza con 3
  test('empieza con 2 → inválido', () => expect(validatePhone('2001234567')).toBe(false));

  // Clase inválida: menos de 10 dígitos
  test('9 dígitos → inválido', () => expect(validatePhone('300123456')).toBe(false));

  // Clase inválida: letras
  test('contiene letras → inválido', () => expect(validatePhone('300123abcd')).toBe(false));
});

describe('Partición de Equivalencia — validateEmail', () => {
  // Clase válida
  test('email con @ y dominio → válido', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  // Clase inválida: sin @
  test('sin @ → inválido', () => expect(validateEmail('userexample.com')).toBe(false));

  // Clase inválida: sin dominio
  test('sin dominio → inválido', () => expect(validateEmail('user@')).toBe(false));

  // Clase inválida: vacío
  test('cadena vacía → inválido', () => expect(validateEmail('')).toBe(false));
});

describe('Partición de Equivalencia — Confirmaciones', () => {
  test('correos iguales → sin error', () => {
    const data = {
      documentType: 'CC', documentNumber: '12345', fullName: 'Ana Lopez',
      phone: '3001234567', email: 'a@b.com', confirmEmail: 'a@b.com',
      password: 'Clave1234', confirmPassword: 'Clave1234', acceptTerms: true,
    };
    expect(validateRegisterForm(data).errors.confirmEmail).toBeUndefined();
  });

  test('correos distintos → error en confirmEmail', () => {
    const data = {
      documentType: 'CC', documentNumber: '12345', fullName: 'Ana Lopez',
      phone: '3001234567', email: 'a@b.com', confirmEmail: 'x@b.com',
      password: 'Clave1234', confirmPassword: 'Clave1234', acceptTerms: true,
    };
    expect(validateRegisterForm(data).errors.confirmEmail).toBeDefined();
  });

  test('contraseñas distintas → error en confirmPassword', () => {
    const data = {
      documentType: 'CC', documentNumber: '12345', fullName: 'Ana Lopez',
      phone: '3001234567', email: 'a@b.com', confirmEmail: 'a@b.com',
      password: 'Clave1234', confirmPassword: 'OtraClave9', acceptTerms: true,
    };
    expect(validateRegisterForm(data).errors.confirmPassword).toBeDefined();
  });

  test('términos no aceptados → error en acceptTerms', () => {
    const data = {
      documentType: 'CC', documentNumber: '12345', fullName: 'Ana Lopez',
      phone: '3001234567', email: 'a@b.com', confirmEmail: 'a@b.com',
      password: 'Clave1234', confirmPassword: 'Clave1234', acceptTerms: false,
    };
    expect(validateRegisterForm(data).errors.acceptTerms).toBeDefined();
  });
});