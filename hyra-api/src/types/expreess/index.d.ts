/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request } from 'express'
import { JwtPayloadDto } from '~/dto/request/auth.dto'

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayloadDto
    data?: any
  }
}
