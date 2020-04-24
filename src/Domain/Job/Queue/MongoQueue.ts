import {EQueueEventType, Queue} from "@Domain/Job/Queue/Queue";
import {TimeSpecParser} from "@Domain/Job/Utils/TimeSpecParser";
import {JobRepository} from "@Domain/Job/Job/Repositories/JobRepository";
import {ITimeSpec} from "@Domain/Job/Job/Contracts";
import {TaskEntity} from "@Domain/Job/Task/TaskEntity";
import {MongoJob} from "@Data/Source/Mongo/MongoJob";
import Timeout = NodeJS.Timeout;
import {Job} from "@Domain/Job/Job/Job";

export class MongoQueue extends Queue {
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

        if (this.avoidWatchNullCollection) {
            if (!jobs.length) {
                // // JobDebugger.log('findJobs - nenhum job no banco, aguardar o addJob do producer'.yellow.bold)
                clearTimeout(this._timeOut);
                return;
            } else {
                // JobDebugger.log('findJobs - haviam jobs na fila, agendar proxima consulta ao banco'.green.bold)
                this.setTimeout();
            }
        } else {
            // JobDebugger.log('findJobs - redefinir timeout independente se houver ou não resultados no banco!!!'.magenta.bold)
            this.setTimeout();
        }
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
            // JobDebugger.log('addJob - o job adicionado deverá ser executado dentro do timeout ja definido'.yellow.bold)
            jobStored.tasks = this.tasks;
            super.addJob(jobStored);
        } else {

            // JobDebugger.log('addJob - o job será salvo no banco e executado mais tarde'.yellow.bold)
            if (!this._timeOut) {
                // JobDebugger.log('addJob - não havia timeout pois estava sem resultados no banco, definir novamente!'.cyan.bold)
                this.setTimeout();
            }
        }

        return jobStored;
    }

    public async removeJobById(id: string): Promise<any> {
        let job = await this._repo.findById(id);

        super.removeJobById(id);

        return job;
    }

    /**
     * Validate if job added should be added to a queue timeOut or database to execute later (next producer ticks)
     * @param job
     */
    private isWithinCurrentTick(job: Job) {
        return job.delay() < this._refreshTimeParsed
    }

    // TODO - esse evento deve ser feito externamente, or subscriber??
    // talvez não, pode ter uma opção para armazenar jobs cancelados ou nao
    protected emit(job: Job, event: EQueueEventType) {

        switch (event) {
            case EQueueEventType.JobCancelled:
                // todo - inserir em cancelados
                console.log('CANCELLED!!!'.bgRed.white.bold);
                this._repo.cancel(job.id)
                    .then(res => {
                        console.log('success while delete'.green.bold)
                        console.log(res)
                    })
                    .catch(err => {
                        console.log('err while delete'.red.bold)
                        console.log(err)
                    })
                break;

            case EQueueEventType.JobExecuted:
                this.finishJob();
                break;
        }

        super.emit(job, event);
    }

    private finishJob() {

    }
}