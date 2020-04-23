import {Job} from "@Domain/Job/Job/Job";
import {Queue} from "@Domain/Job/Queue/Queue";

export abstract class Subscriber<T> {

    /**
     * When job finished, call a subscriber passing de finished job as a parameter
     * @param job
     */
    public abstract call(job: Job): T

    /**
     * Subscribe to a queue for watch all jobs finished events
     * @param queue
     */
    public subscribe(queue: Queue): void {
        queue.subscribe(this);
    };
}