import './Main/module-aliases'
import '@Main/config'
import '@Main/Framework/Express'
import {JobDebugger, QueuesSingletonInstance} from "@Domain/JobScheduler/Queue/QueuesSingleton";
import '@Domain/Wiki/Queues/Queues'

// import {AddToQueueUseCase, RemoveFromQueueUseCase} from "@Domain/Queues/WikiChangeStatusQueue";
import {MongoQueue} from "@Domain/JobScheduler/Queue/MongoQueue";

JobDebugger.active = true;

// const removeFrom = new RemoveFromQueueUseCase(
//     {
//         body: {
//             id: '5ea31298c6b42c04f0100777'
//         }
//     },
//
//     <MongoQueue>QueuesSingletonInstance.getById('wikiActivationMongo')
//
// );
//
// // removeFrom.handle();
//
// const addTo = new AddToQueueUseCase(
//     <MongoQueue>QueuesSingletonInstance.getById('wikiActivationMongo')
// );

// addTo.handle();
