import {Filterable} from "@Data/Utils/QueryFilters/Filterable";
import {QueryBuilder} from "knex";

export class FilterWhere extends Filterable {
    apply(query: QueryBuilder) {
        if (this.values === null) {
            query.whereNull(this.key)
        } else {
            if (typeof this.values === 'object') {
                query.whereIn(this.key, this.values);
            } else {
                query.where(this.key, this.values);
            }
        }

    }
}
