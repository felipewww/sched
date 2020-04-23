import {TaskEntity} from "@Domain/Job/Task/TaskEntity";
import {Job} from "@Domain/Job/Job/Job";

export class WikiChangeStatusTask extends TaskEntity {

    constructor(
        private name: string,
        private withError: boolean = false
    ) {
        super();
    }

    execute(job: Job) {
        console.log('Executing task '+this.name)
    }
}