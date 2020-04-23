import {Job} from "@Domain/Job/Job/Job";
import {TaskEntity} from "@Domain/Job/Task/TaskEntity";
import {Subscriber} from "@Domain/Job/Queue/Subscriber";

export class Queue {

    private readonly _scheduledJobs: Array<Job> = []
    protected subscribers: Array<Subscriber<any>> = [];

    addJob(job: Job|Array<Job>) {
        if (Array.isArray(job)) {
            job.forEach(job => {
                this.__addJob(job);
            })
        } else {
            this.__addJob(job);
        }
    }

    private __addJob(job: Job) {
        job.schedule(this);
        this._scheduledJobs.push(job);
    }

    jobExecuted(job: Job) {

        this.subscribers.forEach(subscriber => {
            subscriber.call(job);
        })

        /**
         * todo - remover a task de _scheduledJobs
         * todo - verificar o status, se falhou, agendar de novo, se deu certo, emitir um evento de finalização
         */
    }

    subscribe(subscriber: Subscriber<any>) {
        this.subscribers.push(subscriber);
    }
}
