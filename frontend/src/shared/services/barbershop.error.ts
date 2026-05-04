import { ServiceError } from "../errors";

export class BarbershopError extends ServiceError {
  constructor(errorCode: string, message: string) {
    super(errorCode, message);
    this.name = 'BarbershopError';
  }
}
