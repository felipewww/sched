export abstract class Entity<T> {
    protected id: number;
    protected props: T;

    protected constructor (props: T, id?: number) {
        this.id = id;
        this.props = props;
    }

    // getProps(): T {
    //     return this.props;
    // }
}