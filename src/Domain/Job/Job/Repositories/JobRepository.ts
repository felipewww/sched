import {Mongo, MongoJob} from "@Data/Source/Mongo/Mongo";
import {Job} from "@Domain/Job/Job/Job";
import {IJobRaw} from "@Data/Source/Jobs/Contracts";

export class JobRepository {
    constructor(
        private model: MongoJob
    ) {

    }

    async store(job: Job) {
        const toRaw: IJobRaw = {
            scheduledTo: job.scheduledTo.toISOString(),
            scheduledAt: job.scheduledAt.toISOString(),
            params: job.params,
        }

        return this.model.store(toRaw);
    }


    async findNext(): Promise<Array<Job>> {

        const jobRaw: Array<IJobRaw> = await this.model.findNext();

        let result: Array<Job> = [];

        jobRaw.map(jobRaw => {

            // let job: Job = Job.create({
            //     scheduledTo: jobRaw.scheduledTo,
            //     params: jobRaw.params
            // }, jobRaw.scheduledAt, jobRaw._id);
            const job = Job.parse(
                jobRaw.scheduledTo,
                jobRaw.scheduledAt,
                jobRaw.params,
                jobRaw._id
            )

            result.push(job);
        })

        return result;
    }
}