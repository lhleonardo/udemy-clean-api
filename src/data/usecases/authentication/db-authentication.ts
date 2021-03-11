import { LoadAccountByEmailRepository, Authentication, AuthenticationModel } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmail: LoadAccountByEmailRepository

  constructor (loadAccountByEmail: LoadAccountByEmailRepository) {
    this.loadAccountByEmail = loadAccountByEmail
  }

  async auth (credentials: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmail.load(credentials.email)

    return ''
  }
}
