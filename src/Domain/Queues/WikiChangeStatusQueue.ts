import {Job} from "@Domain/Job/Job/Job";
import {IHttpRequest} from "@Presentation/Contracts/Http";
import {MongoQueue} from "@Domain/Job/Queue/MongoQueue";

export class RemoveFromQueueUseCase {
    constructor(
        private req: IHttpRequest,
        // private producer: Producer
        private queue: MongoQueue
    ) {

    }

    async handle() {
        try{
            let job = await this.queue.removeJobById(this.req.body.id)
            // console.log('Finding to REMOVE'.red.bold);
            // console.log(job);
            // console.log(this.queue);
        } catch (e) {
            console.log('Error while remove job'.red);
            console.log(e);
        }
    }
}

export class AddToQueueUseCase {
    constructor(
        private queue: MongoQueue
    ) {

    }

    async addJobFake(date: string) {
        const params = {
            id: 17685,
            userId: 16650,
            teamId: 1,
        }

        const job = Job.create(date, params)
        const jobAdded1 = await this.queue.addJob(job);

        return jobAdded1;
    }

    async handle() {
        // Simulando Request Http no Presenter
        setTimeout(async () => {
            const jobAdded = await this.addJobFake('2020-04-23 11:14:01');
            this.cancelFake(jobAdded);
        }, 1000)

        // setTimeout(async () => {
        //     // wikiProducer.avoidWatchNullCollection = false;
        //     this.addJobFake('2020-04-23 13:28:01');
        // }, 6000)
    }

    cancelFake(job: Job) {
        setTimeout(() => {
            this.queue.removeJobById(job.id);
        }, 9000)
        // this.queue
    }
}
