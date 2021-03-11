import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'
import { EmailValidation } from './email-validation'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()

  const sut = new EmailValidation('mail', emailValidatorStub)

  return {
    emailValidatorStub,
    sut
  }
}

describe('Email Validation', () => {
  test('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)

    expect(sut.validate).toThrow()
  })

  test('Should call EmailValidator with correct values', () => {
    const { sut, emailValidatorStub } = makeSut()

    const validateSpy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.validate({ mail: 'valid@mail.com' })

    expect(validateSpy).toHaveBeenCalledWith('valid@mail.com')
  })

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })

    expect(sut.validate).toThrow()
  })

  test('Should return InvalidParamError if validation fails', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const validationResponse = sut.validate({ mail: 'invalid_mail' })

    expect(validationResponse).toEqual(new InvalidParamError('mail'))
  })

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()

    const validationResult = sut.validate({ mail: 'valid@mail.com' })

    expect(validationResult).toBeFalsy()
  })
})
