import { MissingParamError } from '../../errors'
import { Validation } from './validation'

export class RequiredFieldValidation implements Validation {
  private readonly field: string

  constructor (field: string) {
    this.field = field
  }

  public validate (input: any): Error {
    const hasField = input[this.field]

    if (!hasField) {
      return new MissingParamError(this.field)
    }

    return null
  }
}
