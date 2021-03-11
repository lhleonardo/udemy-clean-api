import { LoginController } from '../../../presentation/controllers/login/login'
import { Controller } from '../../../presentation/protocols'
import { makeLoginValidation } from './login-validation'

export function makeLoginController (): Controller {
  const loginControllerValidations = makeLoginValidation()

  return new LoginController(loginControllerValidations)
}
