import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsValidInterval(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidInterval', // nombre único del validador
      target: object.constructor, // la clase donde se aplica (AvailabilityDto)
      propertyName, // la propiedad donde se aplica ("endTime")
      options: validationOptions, // mensaje de error, groups, etc.
      validator: {
        validate(_: any, args: ValidationArguments) {
          const obj = args.object as { startTime: string; endTime: string };
          if (!obj.startTime || !obj.endTime) return true;
          return obj.endTime > obj.startTime;
        },
        defaultMessage() {
          return 'endTime debe ser mayor que startTime';
        },
      },
    });
  };
}