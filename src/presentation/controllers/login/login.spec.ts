import { Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { EmailValidation } from '../../helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../helpers/validators/required-field-validation'
import { ValidationComposite } from '../../helpers/validators/validation-composite'
import { HttpRequest, Validation } from './login-protocols'
import { LoginController } from './login'
import { EmailValidator } from '../../protocols/email-validator'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }

  return new AuthenticationStub()
}

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    public isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeValidationStub = (): Validation => {
  const emailValidator = makeEmailValidatorStub()

  return new ValidationComposite([new RequiredFieldValidation('email'),
    new RequiredFieldValidation('password'),
    new EmailValidation('password', emailValidator)])
}

interface SutTypes {
  sut: LoginController
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthenticationStub()

  const validation = makeValidationStub()
  const sut = new LoginController(validation, authenticationStub)

  return {
    sut,
    validationStub: validation,
    authenticationStub
  }
}

describe('Login Controller', () => {
  test('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()

    const returnError = new InvalidParamError('anyField')

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(returnError)

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(returnError))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeRequest())

    expect(authSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_password')
  })
})
