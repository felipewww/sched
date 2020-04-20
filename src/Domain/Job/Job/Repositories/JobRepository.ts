import {Mongo, MongoJob} from "@Data/Source/Mongo/Mongo";
import {JobEntity} from "@Domain/Job/Job/JobEntity";
import {IJobRaw} from "@Data/Source/Jobs/Contracts";

export class JobRepository {
    constructor(
        private model: MongoJob
    ) {

    }

    async store(job: JobEntity) {
        const toRaw: IJobRaw = {
            scheduledTo: job.scheduledTo.toISOString(),
            scheduledAt: job.scheduledAt.toISOString(),
            params: job.params,
        }

        return this.model.store(toRaw);
    }


    async findNext(): Promise<Array<JobEntity>> {

        const jobRaw: Array<IJobRaw> = await this.model.findNext();

        let result: Array<JobEntity> = [];

        jobRaw.map(jobRaw => {

            let job: JobEntity = JobEntity.create({
                scheduledTo: jobRaw.scheduledTo,
                params: jobRaw.params
            }, jobRaw.scheduledAt, jobRaw._id);

            result.push(job);
        })

        return result;
    }
}