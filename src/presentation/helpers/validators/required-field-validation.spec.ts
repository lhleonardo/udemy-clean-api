import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

interface SutTypes {
  sut: RequiredFieldValidation
}

const makeSut = (): SutTypes => {
  const sut = new RequiredFieldValidation('any_field')

  return {
    sut
  }
}

describe('RequiredFields Validation', () => {
  test('Should return InvalidParamError when validation fails', () => {
    const { sut } = makeSut()
    const validationResponse = sut.validate({})
    expect(validationResponse).toEqual(new MissingParamError('any_field'))
  })

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()

    const validationResult = sut.validate({ any_field: 'any_value' })

    expect(validationResult).toBeFalsy()
  })
})
