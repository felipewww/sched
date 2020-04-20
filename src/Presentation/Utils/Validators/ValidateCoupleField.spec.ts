import {ValidateCoupleField} from "@Presentation/Utils/Validators/ValidateCoupleField";

const sut = new ValidateCoupleField('coupleConfig', 'fieldOne', 'fieldTwo')

function makeReqBody() {
    return  {
        coupleConfig: {
            fieldOne: 1,
            fieldTwo: 1,
        }
    };
}

describe('FieldTypeValidator', () => {
    test('Should return null if all fields are NOT provided', () => {
        const reqBody = makeReqBody();
        delete reqBody.coupleConfig;

        let error = sut.validate(reqBody);

        expect(error).toBeUndefined();
    })

    test('Should return null if fields are provided', () => {
        let error = sut.validate(makeReqBody());
        expect(error).toBeUndefined();
    })

    test('Should return error if field TWO was not provided', () => {
        const reqBody = makeReqBody();
        delete reqBody.coupleConfig.fieldTwo;

        let error = sut.validate(reqBody);

        expect(error).toBeInstanceOf(Error);
    })

    test('Should return error if field ONE was not provided', () => {
        const reqBody = makeReqBody();
        delete reqBody.coupleConfig.fieldOne;

        let error = sut.validate(reqBody);

        expect(error).toBeInstanceOf(Error);
    })
})