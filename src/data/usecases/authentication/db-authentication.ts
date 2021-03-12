import { LoadAccountByEmailRepository, Authentication, AuthenticationModel } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmail: LoadAccountByEmailRepository

  constructor (loadAccountByEmail: LoadAccountByEmailRepository) {
    this.loadAccountByEmail = loadAccountByEmail
  }

  async auth (credentials: AuthenticationModel): Promise<string> {
    const user = await this.loadAccountByEmail.load(credentials.email)

    if (!user) {
      return null
    }
  }
}
