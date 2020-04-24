import {Job} from "@Domain/Job/Job/Job";
import {IJobRaw} from "@Data/Source/Jobs/Contracts";
import {MongoJob} from "@Data/Source/Mongo/MongoJob";

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

    async cancel(jobId: any) {
        return this.model.cancel(jobId);
    }
}