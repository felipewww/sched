import {Queue} from "@Domain/JobScheduler/Queue/Queue";
import {TimeSpecParser} from "@Domain/JobScheduler/Utils/TimeSpecParser";
import {JobRepository} from "@Domain/JobScheduler/Job/Repositories/JobRepository";
import {EJobStatus, ITimeSpec} from "@Domain/JobScheduler/Job/Contracts";
import {TaskEntity} from "@Domain/JobScheduler/Task/TaskEntity";
import {MongoJob} from "@Data/Source/Mongo/MongoJob";
import {Job} from "@Domain/JobScheduler/Job/Job";
import {SubscriberMongo} from "@Domain/JobScheduler/Queue/Subscriber";
import {JobDebugger} from "@Domain/JobScheduler/Queue/QueuesSingleton";
import Timeout = NodeJS.Timeout;
import {EQueueEventType} from "@Domain/JobScheduler/Queue/Contracts";

export class MongoQueue extends Queue<SubscriberMongo> {

    private _initialized: boolean = false;

    protected _timeOut: Timeout;
    protected _refreshTimeParsed = TimeSpecParser.toMilliseconds(this.refreshTime);
    protected _repo: JobRepository;

    /**
     * If last DB search retrieved no result and this option is true, this producer will clear timeout
     * avoiding unnecessary DB searches and timeouts.
     *
     * The timeout will recovered after addJob store some job in DB collection
     */
    public avoidWatchNullCollection: boolean = true;

    constructor(
        protected collectionPrefix: string,
        protected refreshTime: ITimeSpec,
        protected tasks: Array<TaskEntity> = []
    ) {
        super();
        this._refreshTimeParsed = TimeSpecParser.toMilliseconds(this.refreshTime);

        const model = new MongoJob(collectionPrefix);
        this._repo = new JobRepository(model);
    }

    /**
     * Start a producer for DB searches based on timeout and queue feed
     */
    public async init() {
        if (!this._initialized) {
            this._initialized = true;
            await this.findJobs();
        }

        return this;
    }

    /**
     * recursion in memory by
     */
    private setTimeout() {
        this._timeOut = setTimeout(() => {
            this.findJobs();
        }, this._refreshTimeParsed);
    }

    /**
     * Find Jobs in database, parse these jobs to code entities (Job with Task), feed the queue with these jobs
     * and set the recursion (timeout)
     */
    private async findJobs() {
        const jobs: Array<Job> = await this._repo.findNext(this.getNextTick());

        jobs.forEach(job => {
            job.tasks = this.tasks;
            super.addJob(job)
        })

        this.setTimeout();
    }

    /**
     * Retrieve Date object that represents next tick to search new jobs in database
     */
    private getNextTick(): Date {
        const now = new Date().getTime()
        const nextTick = now + this._refreshTimeParsed

        return new Date(nextTick);
    }

    /**
     * Salva o Job no banco. Se estiver dentro do horário de executar, atribui suas Tasks e manda para a fila de agendamento
     * @param job
     */
    public async addJob(job: Job): Promise<Job> {
        const jobStored: Job = await this._repo.store(job);

        if (this.isWithinCurrentTick(job)) {
            JobDebugger.log('addJob - o job adicionado deverá ser executado dentro do timeout ja definido'.yellow.bold)
            jobStored.tasks = this.tasks;
            super.addJob(jobStored);
        } else {

            JobDebugger.log('addJob - o job será salvo no banco e executado mais tarde'.yellow.bold)
            if (!this._timeOut) {
                JobDebugger.log('addJob - não havia timeout pois estava sem resultados no banco, definir novamente!'.cyan.bold)
                this.setTimeout();
            }
        }

        return jobStored;
    }

    public async cancelJobById(id: string): Promise<any> {
        console.log(`trying to cancel job ${id}`.red.bold)
        let job = await this._repo.findById(id);

        this.move(job, EJobStatus.Cancelled);

        super.cancelJobById(id);

        return job;
    }

    /**
     * Validate if job added should be added to a queue timeOut or database to execute later (next producer ticks)
     * @param job
     */
    private isWithinCurrentTick(job: Job) {
        return job.delay() < this._refreshTimeParsed
    }

    protected emit(job: Job, event: EQueueEventType) {

        switch (event) {
            case EQueueEventType.JobCancelled:
                this.move(job, EJobStatus.Cancelled);
                break;

            case EQueueEventType.JobExecuted:

                switch (job.status) {
                    case EJobStatus.Success:
                        this.move(job, EJobStatus.Success);
                        break;

                    case EJobStatus.Failed:
                        this.move(job, EJobStatus.Failed);
                        break;
                }

                break;
        }

        super.emit(job, event);
    }

    private move(job: Job, as: EJobStatus) {
        this._repo.finish(job.id, as)
            .then(() => {
                this.subscribers.forEach(subscriber => {
                    subscriber.onMove(job);
                })
            })
            .catch(err => {
                this.subscribers.forEach(subscriber => {
                    subscriber.onMove(job, err);
                })
            })
    }
}