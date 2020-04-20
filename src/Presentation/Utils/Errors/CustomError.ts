export class CustomError extends Error {
    constructor(private code?: number) {
        super();
        this.name = this.constructor.name;
    }
}