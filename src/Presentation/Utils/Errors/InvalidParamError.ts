import {CustomError} from "@Presentation/Utils/Errors/CustomError";

export class InvalidParamError extends CustomError {
    constructor(param: string, message: string, code?: number) {
        super(code);
        this.message = `${param} ${message}`;
    }
}