import { LoadAccountByEmailRepository } from './db-authentication-protocols'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      public async load (email: string): Promise<AccountModel> {
        return await new Promise(resolve => resolve({
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password'
        }))
      }
    }

    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    await sut.auth({ email: 'any_email@mail.com', password: 'any_password' })
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
