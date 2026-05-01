import { Transform } from "class-transformer";

export const ToFloat = () =>
  Transform(({ value }) => {
    const num = parseFloat(value);
    return isNaN(num) ? value : num;
});