export class ArticleEntity {
    constructor(
        public readonly id: number,
        public readonly scheduledTo: Date
    ) {

    }
}