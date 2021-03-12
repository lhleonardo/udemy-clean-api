import { Authentication, AuthenticationModel, HashComparer, LoadAccountByEmailRepository, TokenGenerator, UpdateAccessTokenRepository } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmail: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (hashComparer: HashComparer, loadAccountByEmail: LoadAccountByEmailRepository, tokenGenerator: TokenGenerator, updateAccessTokenRepository: UpdateAccessTokenRepository) {
    this.hashComparer = hashComparer
    this.loadAccountByEmail = loadAccountByEmail
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (credentials: AuthenticationModel): Promise<string> {
    const user = await this.loadAccountByEmail.load(credentials.email)

    if (user) {
      const isValid = await this.hashComparer.compare(credentials.password, user.password)

      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(user.id)
        await this.updateAccessTokenRepository.update(user.id, accessToken)

        return accessToken
      }
    }

    return null
  }
}
