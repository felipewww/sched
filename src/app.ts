import './Main/module-aliases'
import '@Main/config'
import '@Main/Framework/Express'
import {JobDebugger, QueuesSingletonInstance} from "@Domain/JobScheduler/Queue/QueuesSingleton";
import '@Domain/Wiki/Queues/Queues'

// import {AddToQueueUseCase, RemoveFromQueueUseCase} from "@Domain/Queues/WikiChangeStatusQueue";
import {MongoQueue} from "@Domain/JobScheduler/Queue/MongoQueue";
import {RemoveFromQueue} from "@Domain/Wiki/UseCases/ScheduleStatus/Activate/RemoveFromQueue";
import {AddToQueue} from "@Domain/Wiki/UseCases/ScheduleStatus/Activate/AddToQueue";

JobDebugger.active = true;

const removeFrom = new RemoveFromQueue(
    <MongoQueue>QueuesSingletonInstance.getById('wikiActivationMongo'),
    '5ea31298c6b42c04f0100777'
)

// removeFrom.handle();

const addTo = new AddToQueue(
    <MongoQueue>QueuesSingletonInstance.getById('wikiActivationMongo')
)

//aguardar o inicio para receber "requests"
setTimeout(() => {
    // addTo.handle();
    // addTo.teste3();
    addTo.teste6();
}, 1000)
