import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateOfferDto } from './create-offer.dto';
import { expect, describe, it } from '@jest/globals';

describe('CreateOfferDto', () => {
  const validateDto = async (dto: any) => {
    const instance = plainToInstance(CreateOfferDto, dto);
    return await validate(instance);
  };

  const getErrorMessages = (errors: any[]) => {
    return errors
      .map(e => `${e.property}: ${Object.values(e.constraints || {}).join(', ')}`)
      .join(' | ');
  };

  it('debería validar una Oferta válida', async () => {
    const dto = {
      title: 'Corte de Pelo + Barba',
      description: 'Un servicio completo para el caballero.',
      price: 1500.50,
      duration: 45,
      barberId: '550e8400-e29b-41d4-a716-446655440000',
      barbershopId: '550e8400-e29b-41d4-a716-446655440001'
    };

    const errors = await validateDto(dto);
    expect(getErrorMessages(errors)).toBe('');
  });

  // --- CASOS DE FALLA ---

  it('debería fallar si el precio es negativo', async () => {
    const dto = { price: -100 };
    const errors = await validateDto(dto);
    expect(errors.some(e => e.property === 'price')).toBe(true);
  });

  it('debería fallar si el precio tiene más de 2 decimales', async () => {
    const dto = { price: 100.555 }; // Max 2 decimales según tu DTO
    const errors = await validateDto(dto);
    expect(errors.some(e => e.property === 'price')).toBe(true);
  });

  it('debería fallar si la duración es menor a 1 minuto', async () => {
    const dto = { duration: 0 };
    const errors = await validateDto(dto);
    expect(errors.some(e => e.property === 'duration')).toBe(true);
  });

  it('debería fallar si el título está vacío o es muy largo', async () => {
    const dtoVacio = { title: '' };
    const dtoLargo = { title: 'a'.repeat(101) }; // Max 100

    const errVacio = await validateDto(dtoVacio);
    const errLargo = await validateDto(dtoLargo);

    expect(errVacio.some(e => e.property === 'title')).toBe(true);
    expect(errLargo.some(e => e.property === 'title')).toBe(true);
  });

  it('debería fallar si los IDs no son UUID válidos', async () => {
    const dto = { 
      barberId: '123-no-soy-uuid',
      barbershopId: 'abc-tampoco'
    };
    const errors = await validateDto(dto);
    expect(errors.some(e => e.property === 'barberId')).toBe(true);
    expect(errors.some(e => e.property === 'barbershopId')).toBe(true);
  });

  it('debería ser válido aunque no envíe la descripción (es opcional)', async () => {
    const dto = {
      title: 'Corte Solo',
      price: 1000,
      duration: 30,
      barberId: '550e8400-e29b-41d4-a716-446655440000',
      barbershopId: '550e8400-e29b-41d4-a716-446655440001'
    };
    // No incluimos description
    const errors = await validateDto(dto);
    expect(errors.length).toBe(0);
  });

  it('debería aplicar Trim al título', async () => {
    const dto = { title: '   Corte   ' };
    const instance = plainToInstance(CreateOfferDto, dto);
    expect(instance.title).toBe('Corte');
  });
});