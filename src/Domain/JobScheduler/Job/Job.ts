import {IJobReq} from "@Domain/JobScheduler/Job/Contracts";
import Timeout = NodeJS.Timeout;
import {Queue} from "@Domain/JobScheduler/Queue/Queue";
import {TaskEntity} from "@Domain/JobScheduler/Task/TaskEntity";
import {IJobRaw} from "@Data/Source/Jobs/Contracts";
import {Subscriber} from "@Domain/JobScheduler/Queue/Subscriber";
import {JobDebugger} from "@Domain/JobScheduler/Queue/QueuesSingleton";

export enum EJobStatus {
    Success = 0,
    Created = 1,
    Failed = 2,
    Running = 3,
    Scheduled = 4,
    Canceled = 5,
}

export class Job {

    public tasks: Array<TaskEntity> = [];

    private _timeOut: Timeout;
    private _status: EJobStatus = EJobStatus.Created;
    private _error: Error;

    private tries: { max: number, count: number } = {
        max: 3,
        count: 0
    }

    protected constructor(
        protected _scheduledTo: Date,
        protected _scheduledAt: Date,
        protected _params: { [key:string]: any }, // todo, tipar o objeto corretamente
        protected _id: any
    ) {

    }

    /**
     * Create from Request Object
     * @param reqObj
     */
    public static _create(reqObj: IJobReq, _scheduledAt?: string, id?: any) {
        let scheduledAt: Date;
        if (!_scheduledAt) {
            scheduledAt = new Date();
        } else {
            scheduledAt = new Date(_scheduledAt);
        }

        return new Job(
            new Date(reqObj.scheduledTo),
            new Date(scheduledAt),
            reqObj.params,
            id
        );
    }

    /**
     * Creates a new Job Entity, without DB reference
     * @param _scheduledTo
     * @param params
     */
    public static create(_scheduledTo: string, params: { [key:string]: any }) {
        return new Job(
            new Date(_scheduledTo),
            new Date(),
            params,
            null
        );
    }

    // todo - definir overload method passando outro tipo de parametro para create (podendo se rum objeto de data)

    /**
     * Parses Job from Mongo result
     * @param jobRaw
     */
    public static parse(jobRaw: IJobRaw) {
        return new Job(
            jobRaw.scheduledTo,
            jobRaw.scheduledAt,
            jobRaw.params,
            jobRaw._id
        );
    }

    public delay(): number {
        const now = new Date();
        let delay = this._scheduledTo.getTime() - now.getTime();

        return delay;
    }

    async execute(): Promise<boolean> {
        try {
            this._status = EJobStatus.Running;

            this.tasks.forEach((task: TaskEntity) => {
                task.execute(this);
            })

            this._status = EJobStatus.Success;

            JobDebugger.log(`job executed with success`.green.bold)
            JobDebugger.log(this)
        } catch (e) {

            JobDebugger.log(`job executed with error`.red.bold)
            JobDebugger.log(this)

            if (this.tries.count < this.tries.max) {
                this.tries.count++;
                return this.execute()
            }

            this._error = e;
            this._status = EJobStatus.Failed;
        }

        return true;
    }

    /**
     * Only a Queue can schedule a Job
     */
    public schedule(queue: Queue<Subscriber>) {
        this._status = EJobStatus.Scheduled
        this._timeOut = setTimeout(async () => {
            await this.execute()
            queue.jobExecuted(this);
        }, this.delay())
    }

    public cancel(): boolean {
        clearTimeout(this._timeOut);
        this._status = EJobStatus.Canceled;

        return true;
    }

    get id() {
        return this._id
    }

    get scheduledTo(): Date {
        return this._scheduledTo;
    }

    get scheduledAt(): Date {
        return this._scheduledAt;
    }

    get params() {
        return this._params;
    }

    get status(): EJobStatus {
        return this._status;
    }

    get error() {
        return this._error;
    }
}