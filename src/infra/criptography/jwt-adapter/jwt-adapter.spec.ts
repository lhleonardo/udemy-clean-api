import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  async sign (payload: string, secret: string): Promise<string> {
    return 'encrypted'
  }
}))

const makeSut = (): JwtAdapter => new JwtAdapter('secret')

describe('JWT Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_value')

    expect(signSpy).toHaveBeenCalledWith('any_value', 'secret')
  })
})
