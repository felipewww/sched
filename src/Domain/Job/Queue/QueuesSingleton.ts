import {QueueEntity} from "@Domain/Job/Queue/QueueEntity";

class QueuesSingleton {
    private queues: { [key:string]: QueueEntity } = {};

    private add(queueEntity: QueueEntity, id: string) {
        this.queues[id] = queueEntity;
    }

    getById(id: string) {
        return this.queues[id];
    }

    getAll() {
        return this.queues
    }

    create(queueName: string): QueueEntity {
        let queue = new QueueEntity();
        this.add(queue, queueName)

        return queue;
    }
}

const QueuesSingletonInstance = new QueuesSingleton();

export {
    QueuesSingletonInstance
}