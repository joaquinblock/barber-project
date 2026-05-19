import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetProfessional = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.professional; // Devuelve el objeto professional que fue inyectado por el ProfessionalGuard
  },
);
