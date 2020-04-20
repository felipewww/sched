export interface IJobReq {
    scheduledTo: string;
    params: { [key:string]: any }, // todo, tipar o objeto corretamente para cada tipo de request
}

export interface ITimeSpec {
    value: number;
    unity: "milliseconds"|"seconds"|"minutes"|"hours"|"days"
}