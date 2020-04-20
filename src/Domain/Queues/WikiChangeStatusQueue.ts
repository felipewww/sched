import {QueuesSingletonInstance} from "@Domain/Job/Queue/QueuesSingleton";
import {WikiStatusSubscriber} from "@Domain/Wiki/WikiChangeStatusSubscriber";
import {WikiChangeStatusTask} from "@Domain/Wiki/WikiChangeStatusTask";
import {JobRepository} from "@Domain/Job/Job/Repositories/JobRepository";
import {JobModel} from "@Data/Source/Jobs/JobModel";
import {ProducerAdapter} from "@Domain/Job/Adapters/ProducerAdapter";

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
        const wikiStatusQueue = QueuesSingletonInstance.create('wikiStatusQueue');
        console.log(QueuesSingletonInstance.getAll());

        const wikiStatusQueueInstance = QueuesSingletonInstance.getById('wikiStatusQueue')
        // console.log(wikiStatusQueueInstance);

        const qSub = new WikiStatusSubscriber();
        // qSub.subscribe(wikiStatusQueueInstance);
        wikiStatusQueueInstance.subscribe(qSub)

        const task1 = new WikiChangeStatusTask('task1');
        const task2 = new WikiChangeStatusTask('task2');
        const task3 = new WikiChangeStatusTask('task3');

        const repo = new JobRepository(new JobModel());
        const wikiProducer = new ProducerAdapter(
            { value: 60, unity: 'seconds' },
            wikiStatusQueueInstance,
            repo,
            [task1, task2, task3]
        )

        setTimeout(() => {
            wikiProducer.init();
        }, 3000)
    }
}