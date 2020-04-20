import {TaskEntity} from "@Domain/Job/Task/TaskEntity";
import {JobEntity} from "@Domain/Job/Job/JobEntity";

export class WikiChangeStatusTask extends TaskEntity {

    constructor(
        private name: string,
        private withError: boolean = false
    ) {
        super();
    }

    doTask(job: JobEntity) {
        console.log('Executing task '+this.name)
    }
}