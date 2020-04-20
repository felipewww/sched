import {IValidator} from "@Presentation/Utils/Validators/ValidatorComposite";
import {InvalidParamError} from "@Presentation/Utils/Errors/InvalidParamError";

export class ValidateFieldType implements IValidator {
    constructor(private field: any, type: 'string'|'number') {

    }

    validate(input: any): Error {

        // Dont try validate if field not exists
        if (!input[this.field]) {
            return;
        }

        if ( Number(input[this.field]).toString().toLowerCase() === 'nan' ) {
            return new InvalidParamError(this.field, 'should be a number');
        }
    }
}