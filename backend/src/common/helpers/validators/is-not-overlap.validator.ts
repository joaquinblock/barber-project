import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { TimeIntervalDto } from '@/modules/availabilities/dto/time-interval.dto';

@ValidatorConstraint({ name: 'isNotOverlap', async: false })
export class IsNotOverlapConstraint implements ValidatorConstraintInterface {
  validate(intervals: TimeIntervalDto[]) {
    if (!Array.isArray(intervals) || intervals.length <= 1) return true;

    // 1. Los ordenamos por hora de inicio para comparar secuencialmente
    const sorted = [...intervals].sort((a, b) => a.startTime.localeCompare(b.startTime));

    // 2. Comparamos cada uno con el siguiente
    for (let i = 0; i < sorted.length - 1; i++) {
      const currentEnd = sorted[i].endTime;
      const nextStart = sorted[i + 1].startTime;

      // Si el próximo empieza antes de que termine el actual, hay solapamiento
      if (nextStart < currentEnd) {
        return false;
      }
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Los horarios no pueden solaparse entre sí';
  }
}

export function IsNotOverlap(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotOverlapConstraint,
    });
  };
}