/**
 * Wiki activation queue
 */
import {QueuesSingletonInstance} from "@Domain/JobScheduler/Queue/QueuesSingleton";
import {WikiStatusSubscriber} from "@Domain/Wiki/WikiChangeStatusSubscriber";
import {WikiChangeStatusTask} from "@Domain/Wiki/WikiChangeStatusTask";

const wikiStatusQueue = QueuesSingletonInstance.create('wikiActivationQueue');

const mongoSub = new WikiStatusSubscriber();
wikiStatusQueue.subscribe(mongoSub);

const task1 = new WikiChangeStatusTask('task1');
const task2 = new WikiChangeStatusTask('task2');
const task3 = new WikiChangeStatusTask('task3');

const tasks = [task1, task2, task3];

const mongoQ = QueuesSingletonInstance.createMongo(
    'wikiActivationMongo',
    // { value: 10, unity: 'seconds' },
    { value: 2, unity: 'minutes' },
    tasks
).init();

mongoQ.then((mongoQInstance) => {
    mongoQInstance.subscribe(mongoSub);
})

// class CommonSub extends Subscriber {
//     call(job: Job, event: EQueueEventType): void {
//
//     }
// }
// const commonSub = new CommonSub();
// mongoQ.subscribe(commonSub) //deve ser um erro! common sub não pode ser inscrito em MongoQueue

