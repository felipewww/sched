export interface IHttpRequest {
    body?: any;
    params?: any;
    headers?: any;
}

export abstract class HttpResponse {
    public error?: Error;
    public data?: any;

    protected constructor(
        protected statusCode: 200|201|204|400|403|401|404|500|501
    ) {

    }

    getStatusCode() {
        return this.statusCode;
    }

    logError(e: Error) {
        console.log('error'.bgRed.white.bold);
        console.log(this.statusCode.toString().red.bold)
        console.log(e);
    }
}
