import { LoadAccountByEmailRepository, Authentication, AuthenticationModel, HashComparer, TokenGenerator } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmail: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator

  constructor (hashComparer: HashComparer, loadAccountByEmail: LoadAccountByEmailRepository, tokenGenerator: TokenGenerator) {
    this.hashComparer = hashComparer
    this.loadAccountByEmail = loadAccountByEmail
    this.tokenGenerator = tokenGenerator
  }

  async auth (credentials: AuthenticationModel): Promise<string> {
    const user = await this.loadAccountByEmail.load(credentials.email)

    if (user) {
      const compareResult = await this.hashComparer.compare(credentials.password, user.password)

      if (compareResult) {
        await this.tokenGenerator.generate(user.id)
      }
    }

    return null
  }
}
