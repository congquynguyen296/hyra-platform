import { IsEmail } from 'class-validator'

export class UpdateProfile {
  name?: string

  @IsEmail()
  email?: string
}
