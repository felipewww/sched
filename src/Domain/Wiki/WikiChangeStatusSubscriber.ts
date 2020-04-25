import {SubscriberMongo} from "@Domain/JobScheduler/Queue/Subscriber";
import {EJobStatus, Job} from "@Domain/JobScheduler/Job/Job";
import {EQueueEventType} from "@Domain/JobScheduler/Queue/Queue";

export class WikiStatusSubscriber extends SubscriberMongo {
    call(job: Job, eventType: EQueueEventType): void {
        console.log('Subscriber message: '.bgGreen.black.bold)
        console.log(`Job ${job.id} finished with status ${job.status}`)

        if ( job.status === EJobStatus.Failed ) {
            console.log(job.error);
        }

        console.log('\n')
    }

    onMove(job: Job, err: any): void {
        console.log('Job moved in DB'.green.bold)
        if (err) {
            console.log('moved with error!'.bgRed.white.bgRed)
        }

        console.log(job);
    }
}