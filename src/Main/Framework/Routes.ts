import {Express, Request, Response} from 'express';

import {NotFound} from "@Presentation/Utils/HttpResponse/NotFound";

export class Routes {
    constructor(private app: Express) {
    }

    setRoutes() {
        this.notFound();
    }

    private routes() {
        this.app.post('/api/v1/wiki/status-change')
    }

    private notFound() {
        this.app.use('/api/v1', (req: Request, res: Response) => {
            const notFoundResult = new NotFound();
            res.sendStatus(notFoundResult.getStatusCode());
        })
    }
}
