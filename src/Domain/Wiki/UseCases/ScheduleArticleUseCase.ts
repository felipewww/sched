import {ArticleEntity} from "@Domain/Wiki/Entities/ArticleEntity";

export class ScheduleArticleUseCase {
    constructor(
        private article: ArticleEntity
    ) {
        this.handle();
    }

    handle() {

    }
}