import {ITimeSpec} from "@Domain/Job/Job/Contracts";
import {TimeSpecParser} from "@Domain/Job/Utils/TimeSpecParser";
import {Queue} from "@Domain/Job/Queue/Queue";
import {JobRepository} from "@Domain/Job/Job/Repositories/JobRepository";
import {Job} from "@Domain/Job/Job/Job";
import Timeout = NodeJS.Timeout;
import {TaskEntity} from "@Domain/Job/Task/TaskEntity";
import {MongoJob} from "@Data/Source/Mongo/MongoJob";
import {JobDebugger} from "@Domain/Job/Queue/QueuesSingleton";

/**
 * Responsavel por administrar Jobs com suas devidas Tasks no DB
 * , junto com o Repositório e designar para uma Queue especifica
 *
 * Nunca faça o insert de um Job diretamente no banco
 *
 * @see Job
 * @see JobRepository
 * @see Queue
 * @see TaskEntity
 */
export class Producer {

    private _initialized: boolean = false;

    protected _timeOut: Timeout;
    protected _refreshTimeParsed = TimeSpecParser.toMilliseconds(this.refreshTime);
    protected _repo: JobRepository;

    public avoidWatchNullCollection: boolean = true;

    constructor(
        protected collectionPrefix: string,
        protected refreshTime: ITimeSpec, //qto tempo para a proxima consulta no banco
        protected queue: Queue,
        protected tasks: Array<TaskEntity> = []
    ) {
        this._refreshTimeParsed = TimeSpecParser.toMilliseconds(this.refreshTime);

        const model = new MongoJob(collectionPrefix);
        this._repo = new JobRepository(model);
    }

    public async init() {
        if (!this._initialized) {
            this._initialized = true;
            await this.findJobs();
        }
        
        return this;
    }

    private setTimeout() {
        this._timeOut = setTimeout(() => {
            this.findJobs();
        }, this._refreshTimeParsed);
    }

    private async findJobs() {
        const jobs: Array<Job> = await this._repo.findNext();

        if (this.avoidWatchNullCollection) {
            if (!jobs.length) {
                JobDebugger.log('findJobs - nenhum job no banco, aguardar o addJob do producer'.yellow.bold)
                clearTimeout(this._timeOut);
                return;
            } else {
                JobDebugger.log('findJobs - haviam jobs na fila, agendar proxima consulta ao banco'.green.bold)
                this.setTimeout();
            }
        } else {
            JobDebugger.log('findJobs - redefinir timeout independente se houver ou não resultados no banco!!!'.magenta.bold)
            this.setTimeout();
        }

        jobs.forEach(job => {
            job.tasks = this.tasks;
            this.queue.addJob(job);
        })
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
            this.queue.addJob(jobStored);
        } else {

            JobDebugger.log('addJob - o job será salvo no banco e executado mais tarde'.yellow.bold)
            if (!this._timeOut) {
                JobDebugger.log('addJob - não havia timeout pois estava sem resultados no banco, definir novamente!'.cyan.bold)
                this.setTimeout();
            }
        }

        return jobStored;
    }

    /**
     * Validate if job added should be added to a queue timeOut or database to execute later (next producer ticks)
     * @param job
     */
    private isWithinCurrentTick(job: Job) {
        return job.delay() < this._refreshTimeParsed
    }
}
