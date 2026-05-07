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

  it('debería ser válido con startTime y endTime correctos', async () => {
    const dto = {
      dayOfWeek: DayOfWeek.TUE,
      startTime: '09:00',
      endTime: '13:00',
    };
    const errors = await validateDto(dto);
    expect(errors.length).toBe(0);
  });

  it('debería fallar si startTime tiene un formato incorrecto', async () => {
    const dto = {
      dayOfWeek: DayOfWeek.MON,
      startTime: '25:00', // Inválido
      endTime: '12:00',
    };
    const errors = await validateDto(dto);
    expect(errors.some((e) => e.property === 'startTime')).toBe(true);
  });

  it('debería fallar si startTime es mayor o igual a endTime (IsValidInterval)', async () => {
    const dto = {
      dayOfWeek: DayOfWeek.WED,
      startTime: '18:00',
      endTime: '09:00', // Error lógico
    };
    const errors = await validateDto(dto);
    const intervalError = findError(errors, 'endTime');
    expect(intervalError).not.toBeNull();
  });

  it('debería fallar si el día no coincide con el ENUM (MON, TUE, etc)', async () => {
    const dto = {
      dayOfWeek: 'LUNES', // Inválido, debe ser MON
      startTime: '09:00',
      endTime: '12:00',
    };
    const errors = await validateDto(dto as any);
    expect(errors.some((e) => e.property === 'dayOfWeek')).toBe(true);
  });
});
