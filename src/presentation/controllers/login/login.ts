import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Authentication, Controller, HttpRequest, HttpResponse, Validation } from './login-protocols'

export class LoginController implements Controller {
  private readonly validation: Validation
  private readonly authentication: Authentication

  constructor (validation: Validation, authentication: Authentication) {
    this.validation = validation
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)

      if (validationError) {
        return badRequest(validationError)
      }

      const { email, password } = httpRequest.body

      const authResult = await this.authentication.auth(email, password)

      return ok(authResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
