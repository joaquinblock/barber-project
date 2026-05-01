import { Transform } from 'class-transformer';

export const ToInt = () =>
  Transform(({ value }) => {
    const num = parseInt(value, 10);
    return isNaN(num) ? value : num;
});
