import {ValidateFieldType} from "@Presentation/Utils/Validators/ValidateFieldType";

const sut = new ValidateFieldType('id', 'number')

describe('FieldTypeValidator', () => {
    test('Should return null if field was provided', () => {
        let error = sut.validate({ ids: 10 })
        expect(error).toBeUndefined();
    })

    test('Should return error if data has an invalid type', () => {
        let error = sut.validate({ id: 'string' })
        expect(error).toBeInstanceOf(Error);
    })

    test('should return nothing if data has a valid type', () => {
        let noError = sut.validate({ id: 10 })
        expect(noError).toBeUndefined()
    })
})