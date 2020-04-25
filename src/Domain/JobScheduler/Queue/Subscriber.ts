import {Job} from "@Domain/JobScheduler/Job/Job";
import {EQueueEventType, Queue} from "@Domain/JobScheduler/Queue/Queue";

export abstract class Subscriber {

    /**
     * When job finished, call a subscriber passing de finished job as a parameter
     * @param job
     * @param event
     */
    public abstract call(job: Job, event: EQueueEventType): void;

    // /**
    //  * Subscribe to a queue for watch all jobs finished events
    //  * @param queue
    //  */
    // public subscribe(queue: Queue<Subscriber>): void {
    //     queue.subscribe(this);
    // };
}

export abstract class SubscriberMongo extends Subscriber {
    public abstract onMove(job: Job, err?: any): void;
}
