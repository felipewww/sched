import './Main/module-aliases'
import '@Main/config'
import '@Main/Framework/Express'
import {JobDebugger, QueuesSingletonInstance} from "@Domain/Job/Queue/QueuesSingleton";
// import {ProducersSingletonInstance, QueuesSingletonInstance} from "@Domain/Job/Queue/QueuesSingleton";
import '@Domain/Queues/Queues'

import {AddToQueueUseCase, RemoveFromQueueUseCase} from "@Domain/Queues/WikiChangeStatusQueue";
import {MongoQueue} from "@Domain/Job/Queue/MongoQueue";

JobDebugger.active = true;

const removeFrom = new RemoveFromQueueUseCase(
    {
        body: {
            id: '5ea31298c6b42c04f0100777'
        }
    },
    // ProducersSingletonInstance.getById('wikiActivationProducer')
    <MongoQueue>QueuesSingletonInstance.getById('wikiActivationMongo')

);

removeFrom.handle();

const addTo = new AddToQueueUseCase(
    <MongoQueue>QueuesSingletonInstance.getById('wikiActivationMongo')
);

addTo.handle();
