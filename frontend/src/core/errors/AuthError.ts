import { AppError } from "./AppError";

export class AuthError extends AppError {
    constructor(message: string, statusCode: number = 401) {
        super(message, statusCode);
        this.name = "AuthError";

        // Esto es necesario para que `instanceof AuthError` funcione correctamente, ya que estamos extendiendo de Error.
        Object.setPrototypeOf(this, AuthError.prototype);
    }
}