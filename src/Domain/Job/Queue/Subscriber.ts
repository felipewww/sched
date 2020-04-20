import {JobEntity} from "@Domain/Job/Job/JobEntity";
import {QueueEntity} from "@Domain/Job/Queue/QueueEntity";

export abstract class Subscriber<T> {
    public abstract call(job: JobEntity): T

    public subscribe(queue: QueueEntity): void {
        queue.subscribe(this);
    };
}