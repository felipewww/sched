import {Job} from "@Domain/JobScheduler/Job/Job";
import {Queue} from "@Domain/JobScheduler/Queue/Queue";
import {EQueueEventType} from "@Domain/JobScheduler/Queue/Contracts";

export abstract class Subscriber {

    /**
     * When job finished, call a subscriber passing de finished job as a parameter
     * @param job
     * @param event
     */
    public abstract call(job: Job, event: EQueueEventType): void;
}

export abstract class SubscriberMongo extends Subscriber {
    public abstract onMove(job: Job, err?: any): void;
}
