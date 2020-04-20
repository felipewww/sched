import {HttpResponse} from "@Presentation/Contracts/Http";

export class BadRequest extends HttpResponse {
    constructor(e: Error) {
        super(400);
        this.error = e;
    }
}