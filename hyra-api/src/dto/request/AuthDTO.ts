import { IsEmail } from 'class-validator'

export class UpdateProfileDTO {
  name?: string

  @IsEmail()
  email?: string
}
