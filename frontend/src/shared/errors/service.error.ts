export class ServiceError extends Error {
  public errorCode: string;
  
  constructor(errorCode: string, message: string) {
    super(message);
    this.errorCode = errorCode;
    this.name = 'ServiceError';
  }
}
