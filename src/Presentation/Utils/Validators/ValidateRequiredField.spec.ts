import {ValidateRequiredField} from "@Presentation/Utils/Validators/ValidateRequiredField";

const sut = new ValidateRequiredField('reqField')

describe('RequiredFieldValidator', () => {
    test('Should return error if required field not sent', () => {
        let error = sut.validate({ otherField: 'value' })
        expect(error).toBeInstanceOf(Error);
    })

    test('should return nothing if valid filed was sent', () => {
        let noError = sut.validate({ reqField: 'value' })
        expect(noError).toBeUndefined()
    })
})