import {Db, MongoClient} from "mongodb";

export abstract class Mongo {

    protected connection: MongoClient;

    protected abstract dbUser: string;
    protected abstract dbPass: string;
    protected abstract dbName: string;
    protected abstract dbHost: string;
    protected abstract dbPort: string;

    protected connectionURL: string;

    public connectionSettings(
        dbUser: string,
        dbPass: string,
        dbName: string,
        dbHost: string,
        dbPort: string,
    ) {
        this.dbUser = dbUser;
        this.dbPass = dbPass;
        this.dbName = dbName;
        this.dbHost = dbHost;
        this.dbPort = dbPort;

        return this;
    }

    protected async db(): Promise<Db> {
        const user = encodeURIComponent(this.dbUser);
        const pass = encodeURIComponent(this.dbPass);

        this.connectionURL = `mongodb://${user}:${pass}@${this.dbHost}:${this.dbPort}`;

        const client = new MongoClient(this.connectionURL, { useUnifiedTopology: true });
        this.connection = await client.connect();

        return this.connection.db(this.dbName)
    }

    protected async exec(query: Promise<any>): Promise<any> {
        return new Promise((resolve, reject) => {
            query
                .then(res => {
                    resolve(res);
                })
                .catch(res => {
                    reject(res);
                })
                .finally(() => {
                    this.connection.close();
                })
        })
    }
}
