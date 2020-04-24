import {Subscriber} from "@Domain/Job/Queue/Subscriber";
import {EJobStatus, Job} from "@Domain/Job/Job/Job";
import {EQueueEventType} from "@Domain/Job/Queue/Queue";

export class WikiStatusSubscriber extends Subscriber<any> {
    call(job: Job, eventType: EQueueEventType): any {
        console.log('Subscriber message: '.bgGreen.black.bold)
        console.log(`Job ${job.id} finished with status ${job.status}`)

        if ( job.status === EJobStatus.Failed ) {
            console.log(job.error);
        }

        console.log('\n')
    }
}