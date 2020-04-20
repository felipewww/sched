import {HttpResponse} from "@Presentation/Contracts/Http";

export class Unauthorized extends HttpResponse {

    constructor() {
        super(401);
    }
}