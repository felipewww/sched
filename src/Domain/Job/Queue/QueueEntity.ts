import {JobEntity} from "@Domain/Job/Job/JobEntity";
import {TaskEntity} from "@Domain/Job/Task/TaskEntity";
import {Subscriber} from "@Domain/Job/Queue/Subscriber";

export class QueueEntity {

    private readonly _scheduledJobs: Array<JobEntity> = []
    private subscribers: Array<Subscriber<any>> = []

    // todo - allowJobsWithoutProducer - colocar uma opção para a fila sem producer, permitindo qualquer um adicionar Jobs

    addJob(job: JobEntity|Array<JobEntity>, tasks: Array<TaskEntity>) {
        if (Array.isArray(job)) {
            job.forEach(job => {
                this.__addJob(job, tasks);
            })
        } else {
            this.__addJob(job, tasks);
        }
    }

    private __addJob(job: JobEntity, tasks: Array<TaskEntity>) {
        job.tasks = tasks;
        job.schedule(this);
        this._scheduledJobs.push(job);
    }

    jobExecuted(job: JobEntity) {

        this.subscribers.forEach(sub => {
            sub.call(job);
        })

        /**
         * todo - remover a task de _scheduledJobs
         * todo - verificar o status, se falhou, agendar de novo, se deu certo, emitir um evento de finalização
         * todo - emitir um evento que a tarefa terminou para listeners da fila
         */
    }

    subscribe(subscriber: Subscriber<any>) {
        this.subscribers.push(subscriber);
    }
}