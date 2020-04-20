export interface IJobRaw {
    _id?: any;
    scheduledTo: string,
    scheduledAt: string,
    params: { [key: string]: any }
}