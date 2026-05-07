import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetBarber = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.barber; // Devuelve el objeto barber que fue inyectado por el BarberGuard
  },
);
