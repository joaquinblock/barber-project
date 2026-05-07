import type { ErrorCode } from '@barber/shared/errors';

type Success<T> = {
  success: true;
  data: T;
};

type Failure<E extends string> = {
  success: false;
  error: {
    code: E | ErrorCode;
    message: string;
  };
};

// Es solo para capas de servicios, es solo para lo que llama a la api
export type OperationResult<T = unknown, E extends string = never> =
  | Success<T>
  | Failure<E>;

// T = unknown, E = never, es decir, por defecto no se espera ningún error específico, solo los genéricos de ErrorCode.