import {ITimeSpec} from "@Domain/Job/Job/Contracts";
import {TimeSpecParser} from "@Domain/Job/Utils/TimeSpecParser";
import {Queue} from "@Domain/Job/Queue/Queue";
import {JobRepository} from "@Domain/Job/Job/Repositories/JobRepository";
import {Job} from "@Domain/Job/Job/Job";
import Timeout = NodeJS.Timeout;
import {TaskEntity} from "@Domain/Job/Task/TaskEntity";
import {JobModel} from "@Data/Source/Jobs/JobModel";
import {MongoJob} from "@Data/Source/Mongo/Mongo";

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
        protected name: string,
        protected refreshTime: ITimeSpec, //qto tempo para a proxima consulta no banco
        protected queue: Queue,
        protected tasks: Array<TaskEntity> = []
    ) {
        this._refreshTimeParsed = TimeSpecParser.toMilliseconds(this.refreshTime);
        // this._repo = new JobRepository(new JobModel());
        this._repo = new JobRepository(new MongoJob(name));
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
        this.queue.addJob(jobs, this.tasks);
    }

    public async addJob(job: Job): Promise<any> {
        if (this.validateJobTime(job)) {
            this.queue.addJob(job, this.tasks);
            await Promise.resolve();
        } else {
            //add na queue ou store
            return this.store(job);
        }
    }

    private validateJobTime(job: Job) {
        // todo
        console.log('validating JOB time')
        console.log(job.delay());
        console.log(this._timeOut);
        return true;
    }

    /**
     * Facilita a logica de inserção no banco e validação do tempo da job
     * @param job
     */
    private async store(job: Job) {
        // todo - se o job ainda não estiver vencido, porem estiver dentro do timeout do producer, tambem deve ser adicionado a fila
        if (job.delay() < 0) {
            console.log('Job vencido!'.bgRed.white.bold)
            // this.queue.addJob(job, this.jobs);
        } else {
            console.log('Job com prazo ok'.green.bold);
        }

        return this._repo.store(job);
    }
}
