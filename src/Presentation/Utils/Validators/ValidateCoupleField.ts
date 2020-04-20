import {IValidator} from "@Presentation/Utils/Validators/ValidatorComposite";
import {InvalidParamError} from "@Presentation/Utils/Errors/InvalidParamError";
import {MissingParamError} from "@Presentation/Utils/Errors/MissingParamError";

/**
 * If has one field, should have your pair
 */
export class ValidateCoupleField implements IValidator {
    constructor(private field: any, private fieldOne: string, private fieldTwo: string) {

    }

    validate(req: any): Error {

        const config = req[this.field];
        if (!config) {
            return;
        }

        const fieldOne = config[this.fieldOne];
        const fieldTwo = config[this.fieldTwo];

        if ( !fieldOne || fieldOne === '' ) {
            return new MissingParamError(this.fieldOne);
        }

        if ( !fieldTwo || fieldTwo === '' ) {
            return new MissingParamError(this.fieldTwo);
        }

        return;
    }
}