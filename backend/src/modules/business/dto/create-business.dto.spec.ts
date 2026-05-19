import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateBusinessDto } from './create-business.dto';
import { expect, describe, it } from '@jest/globals';

describe('CreateBusinessDto', () => {
  const validateDto = async (dto: any) => {
    const instance = plainToInstance(CreateBusinessDto, dto);
    return await validate(instance);
  };

  const getErrorMessages = (errors: any[]) => {
    return errors
      .map(e => `${e.property}: ${Object.values(e.constraints || {}).join(', ')}`)
      .join(' | ');
  };

  it('debería validar una Professionalía válida con todos los campos', async () => {
    const dto = {
      name: 'La Professionalía de Joaco',
      address: 'Calle Falsa 123, Olavarría',
      phone: '2284 23 53 13',
      isActive: true,
      photoUrl: 'https://example.com/business.jpg'
    };

    const errors = await validateDto(dto);
    expect(getErrorMessages(errors)).toBe('');
  });

  it('debería validar solo con el nombre (otros campos son opcionales)', async () => {
    const dto = { name: 'Professional Shop' };
    const errors = await validateDto(dto);
    expect(errors.length).toBe(0);
  });

  // --- CASOS DE FALLA ---

  it('debería fallar si el nombre es muy corto', async () => {
    const dto = { name: 'Ab' }; // Mínimo 3
    const errors = await validateDto(dto);
    expect(errors.some(e => e.property === 'name')).toBe(true);
  });

  it('debería fallar si el nombre supera los 100 caracteres', async () => {
    const dto = { name: 'a'.repeat(101) };
    const errors = await validateDto(dto);
    expect(errors.some(e => e.property === 'name')).toBe(true);
  });

  it('debería fallar si el teléfono no es válido para Argentina', async () => {
    const dto = { 
      name: 'Professionalía Test',
      phone: '12345' // Muy corto/inválido
    };
    const errors = await validateDto(dto);
    expect(errors.some(e => e.property === 'phone')).toBe(true);
  });

  it('debería fallar si isActive no es un booleano', async () => {
    const dto = { 
      name: 'Professionalía Test',
      isActive: 'si' // Debería ser true/false
    };
    const errors = await validateDto(dto as any);
    expect(errors.some(e => e.property === 'isActive')).toBe(true);
  });

  // --- PRUEBAS DE TRANSFORMACIÓN ---

  it('debería aplicar Trim al nombre y dirección', async () => {
    const dto = { 
      name: '   Professionalía VIP   ',
      address: '   Av. Colón 456   '
    };
    const instance = plainToInstance(CreateBusinessDto, dto);
    expect(instance.name).toBe('Professionalía VIP');
    expect(instance.address).toBe('Av. Colón 456');
  });

  it('debería transformar y limpiar el teléfono de Argentina', async () => {
    const dto = { 
      name: 'Professionalía Test',
      phone: ' 2284 21-4618 ' // Con espacios y guiones
    };
    const instance = plainToInstance(CreateBusinessDto, dto);
    
    // El transformador debería limpiar el string antes de que llegue al validador
    // Verificamos que pase la validación después de la transformación
    const errors = await validate(instance);
    expect(errors.length).toBe(0);
  });
});