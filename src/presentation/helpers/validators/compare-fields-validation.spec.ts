import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

interface SutTypes {
  sut: CompareFieldsValidation
}

const makeSut = (): SutTypes => {
  const sut = new CompareFieldsValidation('any_source', 'any_target')

  return {
    sut
  }
}

describe('CompareFields Validation', () => {
  test('Should return InvalidParamError when validation fails', () => {
    const { sut } = makeSut()
    const validationResponse = sut.validate({ any_source: 'value', any_target: 'different_value' })
    expect(validationResponse).toEqual(new InvalidParamError('any_target'))
  })

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()

    const validationResult = sut.validate({ any_source: 'any_value', any_target: 'any_value' })

    expect(validationResult).toBeFalsy()
  })
})
