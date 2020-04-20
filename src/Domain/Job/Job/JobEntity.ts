import {IJobReq} from "@Domain/Job/Job/Contracts";
import Timeout = NodeJS.Timeout;
import {QueueEntity} from "@Domain/Job/Queue/QueueEntity";
import {TaskEntity} from "@Domain/Job/Task/TaskEntity";

export enum EJobStatus {
    Success = 0,
    Created = 1,
    Failed = 2,
    Running = 3,
    Scheduled = 4
}

export class JobEntity {

    // todo - retries no try catch alterando _status corretmaente
    private _timeOut: Timeout;
    private _status: EJobStatus = EJobStatus.Created;
    private _tasks: Array<TaskEntity> = [];
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
    public static create(reqObj: IJobReq, _scheduledAt?: string, id?: any) {
        let scheduledAt: Date;
        if (!_scheduledAt) {
            scheduledAt = new Date();
        } else {
            scheduledAt = new Date(_scheduledAt);
        }

        return new JobEntity(
            new Date(reqObj.scheduledTo),
            new Date(scheduledAt),
            reqObj.params,
            id
        );
    }

    public delay(): number {
        const now = new Date();
        let delay = this._scheduledTo.getTime() - now.getTime();

        return delay;
    }

    async execute(): Promise<boolean> {
        try {
            this._tasks.forEach((task: TaskEntity) => {
                task.doTask(this);
            })
            this._status = EJobStatus.Running;
            this._status = EJobStatus.Success;
        } catch (e) {

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
    public schedule(queue: QueueEntity) {
        this._status = EJobStatus.Scheduled
        this._timeOut = setTimeout(async () => {
            await this.execute()
            queue.jobExecuted(this);
        }, this.delay())
    }

    public cancel(queue: QueueEntity) {

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

    set tasks(tasks: Array<TaskEntity>) {
        this._tasks = tasks;
    }
}