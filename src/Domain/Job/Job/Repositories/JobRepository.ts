import {Job} from "@Domain/Job/Job/Job";
import {IJobRaw} from "@Data/Source/Jobs/Contracts";
import {MongoJob} from "@Data/Source/Mongo/MongoJob";

export class JobRepository {
    constructor(
        private model: MongoJob
    ) {

    }

    async store(job: Job): Promise<Job> {

        return new Promise((resolve, reject) => {
            const toRaw: IJobRaw = {
                _id: null,
                scheduledTo: job.scheduledTo.toISOString(),
                scheduledAt: job.scheduledAt.toISOString(),
                params: job.params,
            }


            this.model.store(toRaw)
                .then(result => {
                    const jobRaw = result.ops[0];
                    const job = Job.parse(
                        jobRaw.scheduledTo,
                        jobRaw.scheduledAt,
                        jobRaw.params,
                        jobRaw._id
                    )

                    resolve(job);
                })
        })
    }


    async findNext(): Promise<Array<Job>> {

        // const jobRaw: Array<IJobRaw> = await this.model.findNext();
        const jobRaw: Array<IJobRaw> = [];

        let result: Array<Job> = [];

        jobRaw.map(jobRaw => {
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