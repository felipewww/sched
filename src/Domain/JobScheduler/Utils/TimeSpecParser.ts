import {ITimeSpec} from "@Domain/JobScheduler/Job/Contracts";

export class TimeSpecParser {
    public static toMilliseconds(timeSpec: ITimeSpec): number {

        let ms = 0;

        const minute = 60000;

        switch (timeSpec.unity) {
            case "milliseconds":
                ms = timeSpec.value;
                break;

            case "seconds":
                ms = timeSpec.value * 1000;
                break;

            case "minutes":
                ms = minute * timeSpec.value;
                break;

            case "hours":
                // 1 hr = 3600000
                ms = (minute * 60) * timeSpec.value;
                break;
        }

        return ms;
    }
}