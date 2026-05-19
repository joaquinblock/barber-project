import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateProfessionalDto } from './create-professional.dto';
import { UserRole } from '@business/shared/types';
import { expect, describe, it } from '@jest/globals';

describe('CreateProfessionalDto', () => {
  const validateDto = async (dto: CreateProfessionalDto) => {
    const instance = plainToInstance(CreateProfessionalDto, dto); //necesario para que class-validator funcione correctamente porque los decoradores de validación solo funcionan en instancias de clases, no en objetos literales. plainToInstance convierte un objeto literal en una instancia de la clase CreateProfessionalDto,
    return await validate(instance); //validate devuelve un array de errores de validación. Si el array está vacío, significa que el DTO es válido.
  };

  it('debería validar un DTO válido', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'Password123',
      fullName: 'John Doe',
      phone: '2284214618',
      roles: [UserRole.PROFESSIONAL],
      isActive: true,
      businessId: '550e8400-e29b-41d4-a716-446655440000', // UUID Válido
      calendarColor: '#FF5733',
      commissionPercent: 0.2,
      slotDurationMinutes: 30,
      bio: 'Soy un professionalo con 10 años de experiencia.',
      photoUrl: 'https://example.com/photo.jpg',
      isAdmin: false,
      isAvailable: true,
    };

    const errors = await validateDto(dto as any);

    const errorMessages = errors
      .map(
        (e) =>
          `${e.property}: ${Object.values(e.constraints || {}).join(', ')}`,
      )
      .join(' | ');

    expect(errorMessages).toBe('');
  });

  // --- CASOS DE FALLA ---

  it('debería fallar si el email es inválido', async () => {
    const dto = {
      email: 'esto-no-es-un-email',
      password: 'Password123',
      fullName: 'Joaco B',
      roles: [UserRole.PROFESSIONAL],
      businessId: '550e8400-e29b-41d4-a716-446655440000',
    };
    const errors = await validateDto(dto as any);

    expect(errors.some((e) => e.property === 'email')).toBe(true); //porque se espera que haya un error de validación en la propiedad 'email'
  });

  it('debería fallar si la contraseña es demasiado corta', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'short',
      fullName: 'Joaco B',
      roles: [UserRole.PROFESSIONAL],
      businessId: '550e8400-e29b-41d4-a716-446655440000',
    };
    const errors = await validateDto(dto as any);

    expect(errors.some((e) => e.property === 'password')).toBe(true); //porque se espera que haya un error de validación en la propiedad 'password'
  });

  it('debería fallar si el nombre completo es demasiado corto', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'Password123',
      fullName: 'Jo',
      roles: [UserRole.PROFESSIONAL],
      businessId: '550e8400-e29b-41d4-a716-446655440000',
    };
    const errors = await validateDto(dto as any);

    expect(errors.some((e) => e.property === 'fullName')).toBe(true); //porque se espera que haya un error de validación en la propiedad 'fullName'
  });

  it('debería fallar si el teléfono es inválido', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'Password123',
      fullName: 'Joaco B',
      phone: '12345',
      roles: [UserRole.PROFESSIONAL],
      businessId: '550e8400-e29b-41d4-a716-446655440000',
    };
    const errors = await validateDto(dto as any);

    expect(errors.some((e) => e.property === 'phone')).toBe(true); //porque se espera que haya un error de validación en la propiedad 'phone'
  });

  it('debería fallar si la comisión es mayor a 1 (100%)', async () => {
    const dto = {
      email: 'test@test.com',
      password: 'Password123',
      fullName: 'Joaquin Block',
      roles: [UserRole.PROFESSIONAL],
      businessId: '550e8400-e29b-41d4-a716-446655440000',
      commissionPercent: 1.5, // <--- 150% no debería estar permitido
    };
    const errors = await validateDto(dto as any);

    expect(errors.some((e) => e.property === 'commissionPercent')).toBe(true);
  });

  it('debería fallar si el color no es un Hexadecimal válido', async () => {
    const dto = {
      calendarColor: 'rojo-fuerte', // <--- Inválido
      businessId: '550e8400-e29b-41d4-a716-446655440000',
    };
    const errors = await validateDto(dto as any);

    expect(errors.some((e) => e.property === 'calendarColor')).toBe(true);
  });

  it('debería fallar si slotDurationMinutes no es un entero o es muy bajo', async () => {
    const dto = {
      slotDurationMinutes: 2, // Mínimo era 5
      businessId: '550e8400-e29b-41d4-a716-446655440000',
    };
    const errors = await validateDto(dto as any);

    expect(errors.some((e) => e.property === 'slotDurationMinutes')).toBe(true);
  });

  it('debería fallar si el businessId no es un UUID válido', async () => {
    const dto = {
      businessId: '12345-id-falso',
    };
    const errors = await validateDto(dto as any);

    expect(errors.some((e) => e.property === 'businessId')).toBe(true);
  });

  // --- PRUEBA DE TRANSFORMACIÓN ---

  it('debería transformar el email a minúsculas y limpiar espacios (Trim)', async () => {
    const dto = {
      email: '  JOACO@Gmail.COM  ',
      password: 'Password123',
      fullName: 'Joaquin Block',
      roles: [UserRole.PROFESSIONAL],
      businessId: '550e8400-e29b-41d4-a716-446655440000',
    };

    // Aquí usamos plainToInstance directamente para ver el cambio
    const instance = plainToInstance(CreateProfessionalDto, dto);

    expect(instance.email).toBe('joaco@gmail.com');
  });

  it('debería setear isAdmin en false por defecto si no se envía', async () => {
    const dto = {
      email: 'professionalo@test.com',
      password: 'Password123',
      fullName: 'Professionalo Pepe',
      roles: [UserRole.PROFESSIONAL],
      businessId: '550e8400-e29b-41d4-a716-446655440000',
    };

    const instance = plainToInstance(CreateProfessionalDto, dto);

    // Verificamos que aunque no lo mandamos, la clase le asigne false
    expect(instance.isAdmin).toBe(false);
  });

  it('debería fallar si faltan campos obligatorios (email, fullName, password, roles, businessId)', async () => {
  const dtoIncompleto = {
    bio: 'Soy un professionalo sin datos obligatorios'
  };

  const errors = await validateDto(dtoIncompleto as any);
  
  // Buscamos los campos que DEBERÍAN haber fallado
  const propertiesWithErrors = errors.map(e => e.property);
  
  expect(propertiesWithErrors).toContain('email');
  expect(propertiesWithErrors).toContain('fullName');
  expect(propertiesWithErrors).toContain('password');
  expect(propertiesWithErrors).toContain('roles');
  expect(propertiesWithErrors).toContain('businessId');
});
});
