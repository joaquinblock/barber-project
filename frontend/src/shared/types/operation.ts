
export type ErrorCode = 
  | 'INVALID_RANGE'
  | 'REQUIRED_FIELDS'
  | 'SERVER_ERROR'
  | 'BARBER_NOT_FOUND'
  | 'BARBERSHOP_NOT_FOUND'
  | 'INVALID_TIME_FORMAT';

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

//Es solo para capas de servicios, es solo para lo que llama a la api
export type OperationResult<T = unknown, E extends string = never> = 
  | Success<T> 
  | Failure<E>;

//T  = uknown, E = never, es decir, por defecto no se espera ningún error específico, solo los genéricos de ErrorCode.