import {Db, MongoClient} from "mongodb";
import {IJobRaw} from "@Data/Source/Jobs/Contracts";

export abstract class Mongo {

    protected client: MongoClient;

    constructor() {
        const user = encodeURIComponent(process.env.MONGO_USER);
        const pass = encodeURIComponent(process.env.MONGO_PASS);

        const url = `mongodb://${user}:${pass}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;
        // const url = `mongodb://root:${pass}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;

        this.client = new MongoClient(url);
    }

    protected async db(): Promise<Db> {
        return (await this.client.connect()).db('tasks')
    }

    protected async _db(): Promise<Db> {
        return new Promise((resolve, reject) => {

            this.client.connect()
                .then((client) => {
                    resolve(client.db('tasks'));
                })
                .catch(err => {
                    console.log('Erro while connect to Mongodb ON CATCH!'.bgRed.white.bold)
                    console.log(err);
                    reject();
                })
        })
    }

    protected async exec(query: Promise<any>): Promise<any> {
        return new Promise((resolve, reject) => {
            // resolve();

            query
                .then(res => {
                    resolve(res);
                    this.client.close();
                })
                .catch(error => {
                    reject(error)
                    this.client.close();
                })
        })
    }
}

export abstract class MongoJob extends Mongo {

    // protected abstract collectionPrefix: string;
    //
    // protected collection: any = {
    //     jobs: { name: '' },
    //     failed: {name: '' },
    //     finished: {name: '' },
    // }

    constructor() {
        super();
        // console.log(this.collectionPrefix);
    }

    async store(data: IJobRaw) {
        const conn = await this.db();
        const q =
            conn.collection('wiki:tasks').insertOne(data)

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