import { Transform } from "class-transformer";

export const ToISOString = () => Transform(({ value }) => 
  value instanceof Date ? value.toISOString() : value
);