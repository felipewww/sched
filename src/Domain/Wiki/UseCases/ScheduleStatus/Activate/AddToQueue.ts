import {MongoQueue} from "@Domain/JobScheduler/Queue/MongoQueue";
import {Job} from "@Domain/JobScheduler/Job/Job";

export class AddToQueue {
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
        return  await this.queue.addJob(job);
    }

    async handle() {
        // this.cancelTest();
        this.addTest();
    }

    async addTest() {
        await this.addJobFake('2020-04-25 12:40:01')
        // this.queue.addJob();
    }

    cancelTest() {
        setTimeout(async () => {
            const jobAdded = await this.addJobFake('2020-04-23 11:14:01');

            setTimeout(() => {
                this.queue.cancelJobById(jobAdded.id);
            }, 9000)

        }, 1000)

        setTimeout(async () => {
            const jobAdded = await this.addJobFake('2020-04-23 13:28:01');

            setTimeout(() => {
                this.queue.cancelJobById(jobAdded.id);
            }, 9000)

        }, 6000)
    }
}