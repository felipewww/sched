import {Subscriber} from "@Domain/Job/Queue/Subscriber";
import {EJobStatus, JobEntity} from "@Domain/Job/Job/JobEntity";

export class WikiStatusSubscriber extends Subscriber<any> {
    call(job: JobEntity): any {
        console.log('Subscriber message: '.bgGreen.black.bold)
        console.log(`Job ${job.id} finished with status ${job.status}`)
        if ( job.status === EJobStatus.Failed ) {
            console.log(job.error);
        }
        console.log('\n')
    }
}