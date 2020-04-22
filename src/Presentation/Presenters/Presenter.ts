import {HttpResponse, IHttpRequest} from "@Presentation/Contracts/Http";

export abstract class Presenter {

    protected constructor(
        protected request: IHttpRequest,
    ) {

    }

    public abstract async handle(): Promise<HttpResponse>;
}
