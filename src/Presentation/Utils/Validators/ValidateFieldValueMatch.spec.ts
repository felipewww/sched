import {ValidateFieldValueMatch} from "@Presentation/Utils/Validators/ValidateFieldValueMatch";

const sut = new ValidateFieldValueMatch('teste', [0,1,2,3])

describe('RequiredFieldValidator', () => {
    test('Should return error if field value no matches reuqired values', () => {
        let error = sut.validate({ teste: 4 })
        expect(error).toBeInstanceOf(Error);
    })
})