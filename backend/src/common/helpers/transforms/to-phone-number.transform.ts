import { Transform } from "class-transformer";

export const ToPhoneNumber = () =>
  Transform(({ value }) => {
    if (typeof value === 'string') {
      // \D busca cualquier caracter que NO sea un dígito (0-9)
      // El flag 'g' (global) hace que reemplace todas las ocurrencias encontradas
      return value.replace(/\D/g, '');
    }
    return value;
});