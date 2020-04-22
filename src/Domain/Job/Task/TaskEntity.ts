import {Job} from "@Domain/Job/Job/Job";

export abstract class TaskEntity {
    public abstract doTask(job: Job): any;
}