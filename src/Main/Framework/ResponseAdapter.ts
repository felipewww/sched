import {Response} from "express";
import {HttpResponse, IHttpRequest} from "@Presentation/Contracts/Http";
import {Presenter} from "@Presentation/Presenters/Presenter";
import {CustomError} from "@Presentation/Utils/Errors/CustomError";

export class ResponseAdapter {

    private presenter: Presenter;

    constructor(
        private presenterFactory: Function,
        private request: IHttpRequest,
        private response: Response)
    {
        if( this.tryInstancePresenter() ) {
            this.handlePresenter();
        }
    }

    private tryInstancePresenter() {
        try {
            this.presenter = this.presenterFactory(this.request, this.response.locals.session)
            // this.presenter.setSession(this.response.locals.session);
        } catch (e) {

            let status = 500;

            if (e instanceof CustomError) {
                status = 400;
            } else {
                if (e.message === 'NotImplemented') {
                    status = 501
                }
            }

            if (status === 500 || status === 501) {
                return ResponseAdapter.unexpectedError(this.response, status, e)
            }

            this.response.json(e);

            return false;
        }

        return true;
    }

    private handlePresenter() {
        this.presenter.handle()
            .then((result: HttpResponse) => {
                let jsonResponse: any = {};

                this.response.status(result.getStatusCode());

                if (result.getStatusCode() === 200) {
                    jsonResponse.data = result.data;
                } else {
                    jsonResponse.error = result.error;
                }

                this.response.json(jsonResponse);
            })
            .catch((err: any) => {
                ResponseAdapter.unexpectedError(this.response, 500, err)
            })
    }

    public static adapt(presenterFactory: Function, request: IHttpRequest, response: Response) {
        new ResponseAdapter(presenterFactory, request, response);
    }

    public static forbidden(response: Response) {
        response.sendStatus(403);
    }

    public static unexpectedError(response: Response, code: 500|501, err: Error) {
        if (process.env.NODE_ENV === 'dev') {
            console.log('handlePresenter'.bgRed.white)
            console.log(err)
        }

        response.sendStatus(code);
    }

}