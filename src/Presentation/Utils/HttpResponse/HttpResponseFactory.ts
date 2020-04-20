import {InternalServerError} from "@Presentation/Utils/HttpResponse/InternalServerError";
import {HttpResponse} from "@Presentation/Contracts/Http";
import {NotFound} from "@Presentation/Utils/HttpResponse/NotFound";
import {Success} from "@Presentation/Utils/HttpResponse/Success";
import {BadRequest} from "@Presentation/Utils/HttpResponse/BadRequest";
import {Unauthorized} from "@Presentation/Utils/HttpResponse/Unauthorized";

export class HttpResponseFactory {

    public static Success(data: any, code: 200|201|204 = 200): HttpResponse {
        return new Success(data, code)
    }

    public static NotFound(): HttpResponse {
        return new NotFound();
    }

    public static InternalServerError(e: Error): HttpResponse {
        return new InternalServerError(e);
    }

    public static BadRequest(e: Error): HttpResponse {
        return new BadRequest(e);
    }

    public static Unauthorized(): HttpResponse {
        return new Unauthorized();
    }
}