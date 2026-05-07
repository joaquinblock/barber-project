import { HttpError } from "@/shared/errors";
import type { AvailErrorCode } from "./avail.error.types";

export class AvailError extends HttpError {
    public readonly code: AvailErrorCode;

    constructor(status: number, code: AvailErrorCode, message?: string) {
        super(status, message || code);
        this.name = 'AvailError';
        this.code = code;
    }
}