import {ITimeSpec} from "@Domain/Job/Job/Contracts";
import {TimeSpecParser} from "@Domain/Job/Utils/TimeSpecParser";
import {QueueEntity} from "@Domain/Job/Queue/QueueEntity";
import {JobRepository} from "@Domain/Job/Job/Repositories/JobRepository";
import {JobEntity} from "@Domain/Job/Job/JobEntity";
import Timeout = NodeJS.Timeout;
import {TaskEntity} from "@Domain/Job/Task/TaskEntity";

/**
 * Responsavel por administrar Jobs com suas devidas Tasks no DB
 * , junto com o Repositório e designar para uma Queue especifica
 *
 * @see JobEntity
 * @see JobRepository
 * @see QueueEntity
 * @see TaskEntity
 */
export class ProducerAdapter {
    private _timeOut: Timeout;

    constructor(
        private refreshTime: ITimeSpec, //qto tempo para a proxima consulta no banco
        private queue: QueueEntity,
        private repo: JobRepository,
        private tasks: Array<TaskEntity> = []
    ) {

    }

    public init() {
        const refreshTimeParsed = TimeSpecParser.toMilliseconds(this.refreshTime);

        this.findJobs();

        // agendar proxima consulta ao banco
        this._timeOut = setTimeout(() => {
            this.findJobs();
        }, refreshTimeParsed);

        return this;
    }

    private async findJobs() {
        const jobs: Array<JobEntity> = await this.repo.findNext();
        this.queue.addJob(jobs, this.tasks);
    }

    /**
     * Facilita a logica de inserção no banco e validação do tempo da job
     * @param job
     */
    async store(job: JobEntity) {
        // todo - se o job ainda não estiver vencido, porem estiver dentro do timeout do producer, tambem deve ser adicionado a fila
        if (job.delay() < 0) {
            console.log('Job vencido!'.bgRed.white.bold)
            this.queue.addJob(job, this.tasks);
        } else {
            console.log('Job com prazo ok'.green.bold);
        }

        return this.repo.store(job);
    }
}