import {IValidator} from "@Presentation/Utils/Validators/ValidatorComposite";
import {MissingParamError} from "@Presentation/Utils/Errors/MissingParamError";

export class ValidateRequiredField implements IValidator {
    constructor(private fieldName: string) {

    }

    validate(input: any): Error {
        if (!input[this.fieldName]) {
            return new MissingParamError(this.fieldName)
        }

        return;
    }
}