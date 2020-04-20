import {ITimeSpec} from "@Domain/Job/Job/Contracts";

export class TimeSpecParser {
    public static toMilliseconds(timeSpec: ITimeSpec): number {
        return 3600
    }
}