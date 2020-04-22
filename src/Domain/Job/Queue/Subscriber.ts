import {Job} from "@Domain/Job/Job/Job";
import {Queue} from "@Domain/Job/Queue/Queue";

export abstract class Subscriber<T> {
    public abstract call(job: Job): T

    public subscribe(queue: Queue): void {
        queue.subscribe(this);
    };
}