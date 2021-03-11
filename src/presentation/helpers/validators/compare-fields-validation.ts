import { InvalidParamError } from '../../errors'
import { Validation } from '../../protocols/validation'

export class CompareFieldsValidation implements Validation {
  private readonly source: string
  private readonly target: string

  constructor (source: string, target: string) {
    this.source = source
    this.target = target
  }

  public validate (input: any): Error {
    const sourceValue = input[this.source]
    const targetValue = input[this.target]

    if (sourceValue !== targetValue) {
      return new InvalidParamError(this.target)
    }

    return null
  }
}
