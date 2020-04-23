import {IJobRaw} from "@Data/Source/Jobs/Contracts";
import {InsertOneWriteOpResult} from "mongodb";
import {Mongo} from "@Data/Source/Mongo/Mongo";

export class MongoJob extends Mongo {
    protected dbUser = process.env.MONGO_USER;
    protected dbPass = process.env.MONGO_PASS;
    protected dbName = 'tasks';
    protected dbHost = process.env.MONGO_HOST;
    protected dbPort = process.env.MONGO_PORT;

    constructor(
        protected collectionPrefix: string
    ) {
        super();
    }

    async store(data: IJobRaw): Promise<InsertOneWriteOpResult<IJobRaw>> {
        const conn = await this.db();

        const q = conn
            .collection(`${this.collectionPrefix}:jobs`)
            .insertOne(data)

        return this.exec(q);
    }

    async findNext(): Promise<Array<IJobRaw>> {
        return [
            {
                _id: 1,
                scheduledTo: '2020-04-20 14:58:01',
                scheduledAt: '2020-04-20 11:37:01',
                params: {},
            },
            {
                _id: 2,
                scheduledTo: '2020-04-20 14:58:01',
                scheduledAt: '2020-04-20 11:37:01',
                params: {},
            },
            // {
            //     _id: 3,
            //     scheduledTo: '2020-04-20 14:58:01',
            //     scheduledAt: '2020-04-20 11:37:01',
            //     params: {},
            // },
            // {
            //     _id: 4,
            //     scheduledTo: '2020-04-20 14:58:01',
            //     scheduledAt: '2020-04-20 11:37:01',
            //     params: {},
            // },
            // {
            //     _id: 5,
            //     scheduledTo: '2020-04-20 14:58:01',
            //     scheduledAt: '2020-04-20 11:37:01',
            //     params: {},
            // },
        ]
    }
}