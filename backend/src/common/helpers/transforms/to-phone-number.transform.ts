import { Transform } from "class-transformer";

export const ToPhoneNumber = () =>
  Transform(({ value }) => {
    if (typeof value === 'string') {
        // Elimina espacios en blanco tanto al inicio como al final y dentro del número
        return value.replace(/\s+/g, '');
    }
    return value;
});