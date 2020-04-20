import {IValidator} from "@Presentation/Utils/Validators/ValidatorComposite";
import {InvalidParamError} from "@Presentation/Utils/Errors/InvalidParamError";

export class ValidateFieldValueMatch implements IValidator {
    constructor(private field: any, private requiredValues: Array<string|number>) {

    }

    validate(input: any): Error {
        const fieldValue = input[this.field];
        let found = false;

        this.requiredValues.forEach(reqValue => {
            if (fieldValue === reqValue) {
                found = true;
            }
        });

        if (!found) {
            return new InvalidParamError(this.field, 'should be a number');
        }
    }
}