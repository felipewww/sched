import {Job} from "@Domain/Job/Job/Job";
import {Subscriber} from "@Domain/Job/Queue/Subscriber";

export enum EQueueEventType {
    JobExecuted = 0,
    JobCancelled = 1,
}

export class Queue {

    private readonly _scheduledJobs: Array<Job> = []
    protected subscribers: Array<Subscriber<any>> = [];

    /**
     * Schedule a Job in memory using setTimeout
     * @param job
     */
    addJob(job: Job|Array<Job>) {
        if (Array.isArray(job)) {
            job.forEach(job => {
                this.__addJob(job);
            })
        } else {
            this.__addJob(job);
        }
    }

    removeJobById(id :string) {
        for(let job of this._scheduledJobs) {
            if (job.id === id) {
                job.cancel();
                this.emit(job, EQueueEventType.JobCancelled);
                break;
            }
        }
    }

    protected emit(job: Job, event: EQueueEventType) {
        this.subscribers.forEach(subscriber => {
            subscriber.call(job, event);
        })
    }

    private __addJob(job: Job) {
        job.schedule(this);
        this._scheduledJobs.push(job);
    }

    /**
     * Dispatch event to all Subscribers when Job finishes it's execution
     * @param job
     */
    jobExecuted(job: Job) {

        this.emit(job, EQueueEventType.JobExecuted);

        /**
         * todo - remover a task de _scheduledJobs
         * todo - verificar o status, se falhou, agendar de novo, se deu certo, emitir um evento de finalização
         */
    }

    subscribe(subscriber: Subscriber<any>) {
        this.subscribers.push(subscriber);
    }
}
