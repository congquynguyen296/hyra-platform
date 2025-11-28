import { StatusCodes } from 'http-status-codes'

export interface ApiResponse<T> {
  code: StatusCodes
  message: string
  result: T
}
