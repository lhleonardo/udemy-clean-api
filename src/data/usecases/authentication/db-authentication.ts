import { LoadAccountByEmailRepository, Authentication, AuthenticationModel, HashComparer } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmail: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer

  constructor (hashComparer: HashComparer, loadAccountByEmail: LoadAccountByEmailRepository) {
    this.hashComparer = hashComparer
    this.loadAccountByEmail = loadAccountByEmail
  }

  async auth (credentials: AuthenticationModel): Promise<string> {
    const user = await this.loadAccountByEmail.load(credentials.email)

    if (user) {
      const compareResult = await this.hashComparer.compare(credentials.password, user.password)

      if (compareResult) {
        return 'valid_token'
      }
    }

    return null
  }
}
