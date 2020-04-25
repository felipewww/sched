import {TaskEntity} from "@Domain/JobScheduler/Task/TaskEntity";
import {Job} from "@Domain/JobScheduler/Job/Job";

export class WikiChangeStatusTask extends TaskEntity {

    constructor(
        private name: string,
        private withError: boolean = false
    ) {
        super();
    }

    execute(job: Job) {
        console.log(`Exec task ${this.name}`.random)
        if (this.withError) {
            console.log('TASK ERROR!'.bgRed.white.bold)
            throw new Error('Fake error')
        }
    }
}