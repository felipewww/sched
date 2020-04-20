export interface IValidator {
    validate(input: any): Error;
}

export class ValidatorComposite implements IValidator {
    constructor(
        private readonly validators: Array<IValidator>
    ) {

    }

    validate(input: any): Error {
        let error: Error;

        this.validators.forEach((validator: IValidator) => {
            const validation = validator.validate(input)
            if (validation) {
                error = validation
            }
        });

        return error;
    }
}