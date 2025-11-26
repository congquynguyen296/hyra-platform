import { Response } from 'express'
import { ApiResponse } from '~/types/response.types'

const sendResponse = <T>(res: Response, result: ApiResponse<T>) => {
  res.status(result.code).json(result)
}

export default sendResponse
