export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        // Esto es necesario para que `instanceof AppError` funcione correctamente, ya que estamos extendiendo de Error.
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
