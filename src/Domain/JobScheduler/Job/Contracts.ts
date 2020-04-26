export interface IJobReq {
    scheduledTo: string;
    params: { [key:string]: any }, // todo, tipar o objeto corretamente para cada tipo de request
}

export interface ITimeSpec {
    value: number;
    unity: "milliseconds"|"seconds"|"minutes"|"hours"
}

export enum EJobStatus {
    Success = 0,
    Created = 1,
    Failed = 2,
    Running = 3,
    Scheduled = 4,
    Cancelled = 5,
}
