import {QueryBuilder} from "knex";

export abstract class Filterable {
    abstract apply(query: QueryBuilder): void;

    constructor(
        protected key: string, //alias
        protected values: any
    ) {

    }
}