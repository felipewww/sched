import {Queue} from "@Domain/Job/Queue/Queue";
import {ITimeSpec} from "@Domain/Job/Job/Contracts";
import {TaskEntity} from "@Domain/Job/Task/TaskEntity";
import {MongoQueue} from "@Domain/Job/Queue/MongoQueue";

class QueuesSingleton extends Queue {
    private queues: { [key:string]: Queue } = {};

    private add(queueEntity: Queue, id: string) {
        this.queues[id] = queueEntity;
    }

    getById(id: string): Queue {
        return this.queues[id];
    }

    getAll() {
        return this.queues
    }

    create(queueName: string): Queue {
        let queue = new Queue();
        this.add(queue, queueName)

        return queue;
    }

    createMongo(
        // queueName: string,
        collectionPrefix: string,
        refreshTime: ITimeSpec, //qto tempo para a proxima consulta no banco
        tasks: Array<TaskEntity> = []
    ): MongoQueue {
        let queue = new MongoQueue(collectionPrefix, refreshTime, tasks);
        this.add(queue, collectionPrefix)

        return queue;
    }
}

// class ProducersSingleton {
//     private producers: { [key:string]: Producer } = {};
//
//     private add(producer: Producer, id: string) {
//         this.producers[id] = producer;
//     }
//
//     create(
//         producerName: string,
//         refreshTime: ITimeSpec, //qto tempo para a proxima consulta no banco
//         // queue: Queue,
//         tasks: Array<TaskEntity> = []
//     ): Producer {
//         let producer = new Producer(
//             producerName,
//             refreshTime,
//             // queue,
//             tasks
//         );
//
//         this.add(producer, producerName)
//
//         return producer;
//     }
//
//     getById(id: string) {
//         return this.producers[id];
//     }
//
//     getAll() {
//         return this.producers
//     }
// }

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
// const ProducersSingletonInstance = new ProducersSingleton();
const JobDebugger = new JOBDevTracker();

export {
    QueuesSingletonInstance,
    // ProducersSingletonInstance,
    JobDebugger
}