import {Job} from "@Domain/JobScheduler/Job/Job";
import {MongoJob} from "@Data/Source/Mongo/MongoJob";
import {EJobStatus, IJobRaw} from "@Domain/JobScheduler/Job/Contracts";

export class JobRepository {
    constructor(
        private model: MongoJob
    ) {

    }

    async store(job: Job): Promise<Job> {
        return new Promise((resolve) => {
            const toRaw: IJobRaw = {
                _id: null,
                scheduledTo: job.scheduledTo,
                scheduledAt: job.scheduledAt,
                params: job.params,
            }


            this.model.store(toRaw)
                .then(result => {
                    const jobParsed = Job.parse(result.ops[0]);
                    resolve(jobParsed);
                })
        })
    }

    async findById(id: string): Promise<Job> {
        let job: Job;
        let jobRaw = await this.model.findById(id);

        job = Job.parse(jobRaw);

        return job;
    }

    async findNext(maxDate: Date): Promise<Array<Job>> {

        const jobRaw: Array<IJobRaw> = await this.model.findNext(maxDate);

        let result: Array<Job> = [];

        jobRaw.map(jobRaw => {
            const job = Job.parse(jobRaw);
            result.push(job);
        })

        return result;
    }

    async finish(jobId: any, as: EJobStatus) {
        return this.model.finish(jobId, as);
    }

    // async cancel(jobId: any) {
    //     // return this.model.finish(jobId, 'cancelled');
    //     return this.model.cancel(jobId);
    // }

    // async finishAsSucceed(jobId: any) {
    //
    // }
}