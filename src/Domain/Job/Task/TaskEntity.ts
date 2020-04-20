import {JobEntity} from "@Domain/Job/Job/JobEntity";

export abstract class TaskEntity {
    public abstract doTask(job: JobEntity): any;
}