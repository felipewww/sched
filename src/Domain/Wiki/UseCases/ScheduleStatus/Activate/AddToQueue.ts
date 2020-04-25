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
        // this.addTest();
    }

    /**
     * teste 1
     */
    async addTest() {
        await this.addJobFake('2020-04-25 13:19:01')
        // this.queue.addJob();
    }

    /**
     * teste 2
     */
    cancelTest() {
        setTimeout(async () => {
            const jobAdded = await this.addJobFake('2020-04-25 18:00:01');

            setTimeout(() => {
                this.queue.cancelJobById(jobAdded.id);
            }, 9000)

        }, 1000)

        setTimeout(async () => {
            const jobAdded = await this.addJobFake('2020-04-25 22:00:01');

            setTimeout(() => {
                this.queue.cancelJobById(jobAdded.id);
            }, 9000)

        }, 6000)
    }

    async teste3() {
        const jobAdded = await this.addJobFake('2020-04-25 13:48:01');

        // cancelar 5 segundos após add
        setTimeout(() => {
            this.queue.cancelJobById(jobAdded.id);
        }, 5000)
    }

    async teste6() {
        const jobAdded = await this.addJobFake('2020-04-25 11:48:01');

        // cancelar 5 segundos após add
        setTimeout(() => {
            this.queue.cancelJobById(jobAdded.id);
        }, 5000)
    }
}