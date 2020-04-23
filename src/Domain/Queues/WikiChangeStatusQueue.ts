import {ProducersSingletonInstance, QueuesSingletonInstance} from "@Domain/Job/Queue/QueuesSingleton";
import {WikiStatusSubscriber} from "@Domain/Wiki/WikiChangeStatusSubscriber";
import {WikiChangeStatusTask} from "@Domain/Wiki/WikiChangeStatusTask";
import {Job} from "@Domain/Job/Job/Job";

export class WikiChangeStatusQueue {
    constructor() {
        // from presenter
        // const reqObj: IJobReq = {
        //     scheduledTo: '2020-04-20 14:17:02',
        //     params: {
        //         id: 17685,
        //         userId: 16650,
        //         teamId: 1,
        //     }
        // };

        //from db
        // const fromDb: IJobRaw = {
        //     scheduledTo: '2020-04-19 14:37:02',
        //     scheduledAt: '2020-04-19 14:37:02',
        //     params: {
        //         id: 17685,
        //         userId: 16650,
        //         teamId: 1,
        //     }
        // }

        // instanciar filas singleton no event loop
        const wikiStatusQueue = QueuesSingletonInstance.create('wikiActivationQueue');

        const wikiStatusQueueInstance = QueuesSingletonInstance.getById('wikiActivationQueue')

        const qSub = new WikiStatusSubscriber();
        qSub.subscribe(wikiStatusQueueInstance);
        // wikiStatusQueueInstance.subscribe(qSub)

        const task1 = new WikiChangeStatusTask('task1');
        const task2 = new WikiChangeStatusTask('task2');
        const task3 = new WikiChangeStatusTask('task3');

        const wikiProducer = ProducersSingletonInstance.create(
            'wikiActivationProducer',
            // { value: 3, unity: 'minutes' },
            { value: 10, unity: 'seconds' },
            wikiStatusQueueInstance,
            [task1, task2, task3]
        )

        // wikiProducer.avoidWatchNullCollection = false;

        wikiProducer.init();

        // const wikiProducer = ProducersSingletonInstance.getById('wikiActivationProducer')

        async function addJobFake(date: string) {

            const params = {
                id: 17685,
                userId: 16650,
                teamId: 1,
            }

            const job = Job.create(date, params)
            job.tasks = [task1, task2, task3]
            const jobAdded1 = await wikiProducer.addJob(job);
        }
        // Simulando Request Http no Presenter
        setTimeout(async function () {
            addJobFake('2020-04-23 11:14:01');
        }, 1000)

        setTimeout(async function () {
            // wikiProducer.avoidWatchNullCollection = false;
            addJobFake('2020-04-23 13:28:01');
        }, 6000)
    }
}