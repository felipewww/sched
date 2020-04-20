import {HttpResponse} from "@Presentation/Contracts/Http";

export class Success extends HttpResponse {
    constructor(public data: any, code: 200|201|204 = 200) {
        super(code);
    }
}