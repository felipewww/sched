export interface IJobRaw {
    _id: any;
    scheduledTo: Date,
    scheduledAt: Date,
    params: { [key: string]: any }
}