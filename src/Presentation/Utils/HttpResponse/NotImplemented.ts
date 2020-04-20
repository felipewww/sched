import {HttpResponse} from "@Presentation/Contracts/Http";

export class NotImplemented extends HttpResponse {
    constructor() {
        super(501);
    }
}