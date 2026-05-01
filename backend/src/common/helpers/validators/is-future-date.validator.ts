import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator, ValidationOptions } from 'class-validator';

@ValidatorConstraint({ name: 'isFutureDate', async: false })
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    if (!value) return false;
    
    // Se convierte el string 'YYYY-MM-DD' a un objeto Date 
    const [year, month, day] = value.split('-').map(Number);
    const inputDate = new Date(year, month - 1, day);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear horas para comparar solo días
    
    return inputDate >= today;
  }

  defaultMessage(args: ValidationArguments) {
    return `La fecha ${args.value} no puede ser anterior a hoy`;
  }
}

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFutureDateConstraint,
    });
  };
}