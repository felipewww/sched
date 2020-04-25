import {MongoQueue} from "@Domain/JobScheduler/Queue/MongoQueue";

export class RemoveFromQueue {
    constructor(
        private queue: MongoQueue,
        private id: string
    ) {

    }

    async handle() {
        try{
            let job = await this.queue.cancelJobById(this.id)
        } catch (e) {
            console.log('Error while remove job'.red);
            console.log(e);
        }
    }
}