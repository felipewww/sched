import {Queue} from "@Domain/JobScheduler/Queue/Queue";
import {ITimeSpec} from "@Domain/JobScheduler/Job/Contracts";
import {TaskEntity} from "@Domain/JobScheduler/Task/TaskEntity";
import {MongoQueue} from "@Domain/JobScheduler/Queue/MongoQueue";
import {Subscriber} from "@Domain/JobScheduler/Queue/Subscriber";

class QueuesSingleton extends Queue<Subscriber> {
    private queues: { [key:string]: Queue<Subscriber> } = {};

    private add(queueEntity: Queue<Subscriber>, id: string) {
        this.queues[id] = queueEntity;
    }

    getById(id: string): Queue<Subscriber> {
        return this.queues[id];
    }

    getAll() {
        return this.queues
    }

    create(queueName: string): Queue<Subscriber> {
        let queue = new Queue();
        this.add(queue, queueName)

        return queue;
    }

    createMongo(
        collectionPrefix: string,
        refreshTime: ITimeSpec,
        tasks: Array<TaskEntity> = []
    ): MongoQueue {
        let queue = new MongoQueue(collectionPrefix, refreshTime, tasks);
        this.add(queue, collectionPrefix)

        return queue;
    }
}

export class JOBDevTracker {
    public active: boolean = false

    log(message: any) {
        if (this.active) {
            console.log('\n');
            console.log('   JobDebugger dev log   '.bgCyan.black.bold);
            console.log(message);
        }
    }
}

const QueuesSingletonInstance = new QueuesSingleton();
const JobDebugger = new JOBDevTracker();

export {
    QueuesSingletonInstance,
    JobDebugger
}