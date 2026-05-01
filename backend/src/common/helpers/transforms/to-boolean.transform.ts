//Uso transforms para el ValidationPipe global en main.ts, como deshabilité la conversión implícita, necesito un transform específico para convertir ciertos campos a booleanos.

import { Transform } from 'class-transformer';

export const ToBoolean = () =>
  Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  });