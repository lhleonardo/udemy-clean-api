import { EmailValidator } from '../../protocols/email-validator'
import { CompareFieldsValidation } from './compare-fields-validation'
import { EmailValidation } from './email-validation'
import { RequiredFieldValidation } from './required-field-validation'
import { ValidationComposite } from './validation-composite'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: ValidationComposite
}

const makeSut = (): SutTypes => {
  const requiredFieldStub = new RequiredFieldValidation('anyField')
  const compareFieldsStub = new CompareFieldsValidation('anyField', 'fieldToCompare')
  const mailFieldStub = new EmailValidation('mailField', makeEmailValidator())

  const sut = new ValidationComposite([requiredFieldStub, compareFieldsStub, mailFieldStub])

  return {
    sut
  }
}

describe('Validation Composite', () => {
  test('Should return error if some validation fails', () => {
    const { sut } = makeSut()

    const validationResponse = sut.validate({
      anyField: 'some_value',
      fieldToCompare: 'wrong_value',
      mailField: 'some_mail@mail.com'
    })

    expect(validationResponse).toBeTruthy()
  })

  test('Should not returns if all validations succeeds', () => {
    const { sut } = makeSut()

    const validationResponse = sut.validate({
      anyField: 'correct_value',
      fieldToCompare: 'correct_value',
      mailField: 'some_mail@mail.com'
    })

    expect(validationResponse).toBeFalsy()
  })
})
