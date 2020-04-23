import {ITimeSpec} from "@Domain/Job/Job/Contracts";
import {TimeSpecParser} from "@Domain/Job/Utils/TimeSpecParser";
import {Queue} from "@Domain/Job/Queue/Queue";
import {JobRepository} from "@Domain/Job/Job/Repositories/JobRepository";
import {Job} from "@Domain/Job/Job/Job";
import Timeout = NodeJS.Timeout;
import {TaskEntity} from "@Domain/Job/Task/TaskEntity";
import {MongoJob} from "@Data/Source/Mongo/MongoJob";
// import {MongoJob} from "@Data/Source/Mongo/Mongo";

/**
 * Responsavel por administrar Jobs com suas devidas Tasks no DB
 * , junto com o Repositório e designar para uma Queue especifica
 *
 * @see Job
 * @see JobRepository
 * @see Queue
 * @see TaskEntity
 */
export class Producer {

    protected _timeOut: Timeout;
    protected _refreshTimeParsed = TimeSpecParser.toMilliseconds(this.refreshTime);
    protected _repo: JobRepository;
    protected _nextTick: number;

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

    public init() {
        this.findJobs();
        this.setTimeout();

        return this;
    }

    private setTimeout() {
        this._timeOut = setTimeout(() => {
            this.findJobs();
            // this.setTimeout();
            // todo - um tratamento para se retornar 0 resultados, definir timeout somente quando acontecer uma inserção no banco
            // todo - para não ficar procurando sem necessidade
        }, this._refreshTimeParsed);
    }

    private async findJobs() {
        const jobs: Array<Job> = await this._repo.findNext();
        jobs.forEach(job => {
            job.tasks = this.tasks;
            this.queue.addJob(job);
        })

        // this.queue.addJob(jobs, this.tasks);
    }

    /**
     * Salva o Job no banco. Se estiver dentro do horário de executar, atribui suas Tasks e manda para a fila de agendamento
     * @param job
     */
    public async addJob(job: Job): Promise<Job> {
        const jobStored: Job = await this._repo.store(job);

        if (this.isWithinCurrentTick(job)) {
            jobStored.tasks = this.tasks;
            // this.queue.addJob(jobStored, this.tasks);
            this.queue.addJob(jobStored);
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
