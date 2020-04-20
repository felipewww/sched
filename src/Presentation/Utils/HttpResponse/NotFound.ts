import {HttpResponse} from "@Presentation/Contracts/Http";

export class NotFound extends HttpResponse {

    constructor() {
        super(404);
    }
}