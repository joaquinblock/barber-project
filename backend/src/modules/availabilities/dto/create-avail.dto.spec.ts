import 'reflect-metadata'; // Necesario para class-transformer y class-validator con las validaciones anidadas
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateAvailDto } from './create-avail.dto';
import { DayOfWeek } from '@/common/enums/day-of-week.enum'; // MON, TUE, etc.
import { expect, describe, it } from '@jest/globals';

describe('CreateAvailDto', () => {
  const validateDto = async (dto: Partial<CreateAvailDto>) => {
    const instance = plainToInstance(CreateAvailDto, dto);
    return await validate(instance);
  };

  const findError = (errors: any[], property: string): any => {
    for (const err of errors) {
      if (err.property === property) return err;
      if (err.children && err.children.length > 0) {
        const childErr = findError(err.children, property);
        if (childErr) return childErr;
      }
    }
    return null;
  };

  it('debería ser válido si el barbero NO trabaja ese día (intervals null)', async () => {
    const dto = {
      dayOfWeek: DayOfWeek.MON,
      isWorking: false,
      barberId: '550e8400-e29b-41d4-a716-446655440000',
      barbershopId: '550e8400-e29b-41d4-a716-446655440001',
      // No mandamos intervals
    };
    const errors = await validateDto(dto);
    expect(errors.length).toBe(0);
  });

  it('debería ser válido con intervalos de trabajo correctos', async () => {
    const dto = {
      dayOfWeek: DayOfWeek.TUE,
      isWorking: true,
      intervals: [
        { startTime: '09:00', endTime: '13:00' },
        { startTime: '14:00', endTime: '18:00' },
      ],
      barberId: '550e8400-e29b-41d4-a716-446655440000',
      barbershopId: '550e8400-e29b-41d4-a716-446655440001',
    };
    const errors = await validateDto(dto);
    expect(errors.length).toBe(0);
  });

  it('debería fallar si isWorking es null o undefined', async () => {
    const dto = {
      dayOfWeek: DayOfWeek.MON,
      isWorking: null, // No se puede
      intervals: [{ startTime: '09:00', endTime: '12:00' }],
      barberId: '550e8400-e29b-41d4-a716-446655440000',
      barbershopId: '550e8400-e29b-41d4-a716-446655440001',
    };
    const errors = await validateDto(dto as any); // casteamos a any porque isWorking es obligatorio y no puede ser null, pero queremos probar esa validación
    expect(errors.some((e) => e.property === 'isWorking')).toBe(true);
  });

  it('debería limpiar intervals si isWorking es false (aunque se manden datos)', async () => {
    const dto = {
      dayOfWeek: DayOfWeek.TUE,
      isWorking: false,
      intervals: [{ startTime: '09:00', endTime: '12:00' }], // Esto debería ignorarse
      barberId: '550e8400-e29b-41d4-a716-446655440000',
      barbershopId: '550e8400-e29b-41d4-a716-446655440001',
    };

    const instance = plainToInstance(CreateAvailDto, dto);
    // El @Transform lo convierte en null
    expect(instance.intervals).toBeNull();

    const errors = await validate(instance);
    expect(errors.length).toBe(0); // Pasa porque al ser null no valida el contenido
  });

  it('debería fallar si startTime es mayor o igual a endTime (IsValidInterval)', async () => {
    const dto = {
      dayOfWeek: DayOfWeek.WED,
      isWorking: true,
      intervals: [{ startTime: '18:00', endTime: '09:00' }], // Error lógico
      barberId: '550e8400-e29b-41d4-a716-446655440000',
      barbershopId: '550e8400-e29b-41d4-a716-446655440001',
    };
    const errors = await validateDto(dto);
    // Buscamos el error dentro de los intervalos
    const intervalError = findError(errors, 'endTime');
    expect(intervalError).not.toBeNull();
  });

  it('debería fallar si hay solapamiento múltiple entre varios intervalos', async () => {
    const dto = {
      dayOfWeek: DayOfWeek.THU,
      isWorking: true,
      intervals: [
        { startTime: '09:00', endTime: '12:00' },
        { startTime: '14:00', endTime: '17:00' },
        { startTime: '11:00', endTime: '15:00' }, // Solapa con el primero y el segundo
      ],
      barberId: '550e8400-e29b-41d4-a716-446655440000',
      barbershopId: '550e8400-e29b-41d4-a716-446655440001',
    };
    const errors = await validateDto(dto);
    expect(errors.some((e) => e.property === 'intervals')).toBe(true);
  });

  it('debería fallar si el día no coincide con el ENUM (MON, TUE, etc)', async () => {
    const dto = {
      dayOfWeek: 'LUNES', // Inválido, debe ser MON
      isWorking: true,
      intervals: [{ startTime: '09:00', endTime: '12:00' }],
      barberId: '550e8400-e29b-41d4-a716-446655440000',
      barbershopId: '550e8400-e29b-41d4-a716-446655440001',
    };
    const errors = await validateDto(dto as any); // casteamos a any porque dayOfWeek es obligatorio y no puede ser un valor inválido, pero queremos probar esa validación
    expect(errors.some((e) => e.property === 'dayOfWeek')).toBe(true);
  });
});
