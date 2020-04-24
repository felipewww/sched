import {Presenter} from "@Presentation/Presenters/Presenter";
import {HttpResponse} from "@Presentation/Contracts/Http";
import {HttpResponseFactory} from "@Presentation/Utils/HttpResponse/HttpResponseFactory";
import {Job} from "@Domain/Job/Job/Job";
import {QueuesSingletonInstance} from "@Domain/Job/Queue/QueuesSingleton";

export class PostStatusChange extends Presenter {
    async handle(): Promise<HttpResponse> {
        // const wikiProducer = ProducersSingletonInstance.getById('wikiActivationProducer')
        const wikiProducer = QueuesSingletonInstance.getById('wikiActivationQueue')

        const params = {
            id: 17685,
            userId: 16650,
            teamId: 1,
        }

        const job = Job.create('2020-04-22 20:20', params)

        await wikiProducer.addJob(job);

        return HttpResponseFactory.Success({ status: true }, 200)
    }
}