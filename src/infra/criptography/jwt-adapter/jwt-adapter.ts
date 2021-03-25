import { Encrypter } from '../../../data/protocols/criptography/encrypter'

import jwt from 'jsonwebtoken'
export class JwtAdapter implements Encrypter {
  private readonly secret: string

  constructor (secret: string) {
    this.secret = secret
  }

  public async encrypt (value: string): Promise<string> {
    jwt.sign(value, this.secret)

    return 'teste'
  }
}
