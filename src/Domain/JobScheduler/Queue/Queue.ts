import {Job} from "@Domain/JobScheduler/Job/Job";
import {Subscriber} from "@Domain/JobScheduler/Queue/Subscriber";
import {EQueueEventType} from "@Domain/JobScheduler/Queue/Contracts";

export class Queue<S extends Subscriber> {

    private readonly _scheduledJobs: Array<Job> = []
    protected subscribers: Array<S> = [];

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

    cancelJobById(id :string) {
        for(let job of this._scheduledJobs) {
            if (job.id === id) {
                // todo - precisa fazer algo aqui?
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

    subscribe(subscriber: S) {
        this.subscribers.push(subscriber);
    }
}
