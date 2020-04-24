/**
 * Wiki activation queue
 */
import {QueuesSingletonInstance} from "@Domain/Job/Queue/QueuesSingleton";
import {WikiStatusSubscriber} from "@Domain/Wiki/WikiChangeStatusSubscriber";
import {WikiChangeStatusTask} from "@Domain/Wiki/WikiChangeStatusTask";

// new WikiChangeStatusQueue();
const wikiStatusQueue = QueuesSingletonInstance.create('wikiActivationQueue');

const qSub = new WikiStatusSubscriber();
qSub.subscribe(wikiStatusQueue);

const task1 = new WikiChangeStatusTask('task1');
const task2 = new WikiChangeStatusTask('task2');
const task3 = new WikiChangeStatusTask('task3');

const tasks = [task1, task2, task3];

// ProducersSingletonInstance.create(
//     'wikiActivationProducer',
//     { value: 10, unity: 'seconds' },
//     // wikiStatusQueue,
//     tasks
// ).init();

const mongoQ = QueuesSingletonInstance.createMongo(
    'wikiActivationMongo', // old producer
    { value: 10, unity: 'seconds' },
    tasks
).init();