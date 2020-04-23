import './Main/module-aliases'
import '@Main/config'
import '@Main/Framework/Express'
import {JobDebugger} from "@Domain/Job/Queue/QueuesSingleton";

// instance all queues

// import "@Domain/Job/Queue/QueuesSingleton";
JobDebugger.active = true;
import '@Domain/Queues/Queues'
