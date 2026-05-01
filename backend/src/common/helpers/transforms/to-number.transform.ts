import { Transform } from "class-transformer";


export const ToNumber = () =>
  Transform(({ value }) => {
    const num = Number(value);
    return isNaN(num) ? value : num;
});