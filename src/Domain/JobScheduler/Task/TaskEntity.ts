import {Job} from "@Domain/JobScheduler/Job/Job";

export abstract class TaskEntity {
    public abstract execute(job: Job): any;
}