import { LoadAccountByEmailRepository, AuthenticationModel, HashComparer, UpdateAccessTokenRepository, Encrypter } from './db-authentication-protocols'
import { DbAuthentication } from './db-authentication'
import { AccountModel } from '../add-account/db-add-account-protocols'

const makeLoadAccountByEmailStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    public async load (email: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'hashed_password'
      }))
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    public async update (userId: string, token: string): Promise<void> {
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, compare: string): Promise<boolean> {
      return true
    }
  }

  return new HashComparerStub()
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return 'any_token'
    }
  }

  return new EncrypterStub()
}

const makeFakeCredentials = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const hashComparerStub = makeHashComparerStub()
  const encrypterStub = makeEncrypterStub()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailStub()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub()
  const sut = new DbAuthentication(hashComparerStub, loadAccountByEmailRepositoryStub, encrypterStub, updateAccessTokenRepositoryStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

    await sut.auth(makeFakeCredentials())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throws if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeCredentials())

    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const accessToken = await sut.auth(makeFakeCredentials())

    expect(accessToken).toBeNull()
  })

  test('Should call HashComparer with correct password', async () => {
    const { sut, hashComparerStub } = makeSut()

    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    const credentials = makeFakeCredentials()
    await sut.auth(credentials)

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throws if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeCredentials())

    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()

    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve) => resolve(false)))

    const accessToken = await sut.auth(makeFakeCredentials())

    expect(accessToken).toBeNull()
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, encrypterStub } = makeSut()

    const compareSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.auth(makeFakeCredentials())

    expect(compareSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throws if TokenGenerator throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeCredentials())

    await expect(promise).rejects.toThrow()
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()

    const compareSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')

    await sut.auth(makeFakeCredentials())

    expect(compareSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('Should throws if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(makeFakeCredentials())

    await expect(promise).rejects.toThrow()
  })

  test('Should returns token if succeeds', async () => {
    const { sut } = makeSut()

    const accessToken = await sut.auth(makeFakeCredentials())

    expect(accessToken).toBe('any_token')
  })
})
