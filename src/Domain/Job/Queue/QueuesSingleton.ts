import {Queue} from "@Domain/Job/Queue/Queue";
import {Producer} from "@Domain/Job/Adapters/Producer";
import {Subscriber} from "@Domain/Job/Queue/Subscriber";
import {ITimeSpec} from "@Domain/Job/Job/Contracts";
import {TaskEntity} from "@Domain/Job/Task/TaskEntity";

export interface IQueueFactoryOptions {
    queueName: string;
    producer: Producer,
    subscribers: Array<Subscriber<any>>
}

class QueuesSingleton extends Queue {
    private queues: { [key:string]: Queue } = {};

    private add(queueEntity: Queue, id: string) {
        this.queues[id] = queueEntity;
    }

    getById(id: string) {
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
}

class ProducersSingleton {
    private producers: { [key:string]: Producer } = {};

    private add(producer: Producer, id: string) {
        this.producers[id] = producer;
    }

    create(
        producerName: string,
        refreshTime: ITimeSpec, //qto tempo para a proxima consulta no banco
        queue: Queue,
        tasks: Array<TaskEntity> = []
    ): Producer {
        let producer = new Producer(producerName, refreshTime, queue, tasks);
        this.add(producer, producerName)

        return producer;
    }

    getById(id: string) {
        return this.producers[id];
    }

    getAll() {
        return this.producers
    }
}

const QueuesSingletonInstance = new QueuesSingleton();
const ProducersSingletonInstance = new ProducersSingleton();

export {
    QueuesSingletonInstance,
    ProducersSingletonInstance
}