export class HttpError extends Error {
  public status: number;
  public data?: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}
