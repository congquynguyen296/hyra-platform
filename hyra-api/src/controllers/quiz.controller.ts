/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import {
  getAllQuizByFileId,
  getQuizByIdService,
  getAllQuestionByQuiz as getAllQuestionByQuizService,
  SubmitQuizRequest,
  submitQuiz,
  getAllQuizzes as getAllQuizByUserId
} from '../services/quiz.service'

import { createQuiz } from '../services/quiz.service'
import sendResponse from '../dto/response/send-response'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/middleware/ApiError'
import { Quiz } from '~/models/quiz.model'
import { Question } from '~/models/question.model'
import { FileModel } from '~/models/file.model'

export const handleGenerateQuiz = async (req: Request, res: Response) => {
  try {
    const numQuestions = req.data.numQuestions ?? 5
    const difficulty = req.data.difficulty ?? 'medium'

    const questions = await createQuiz(req.data.id, numQuestions, difficulty)
    sendResponse(res, {
      code: 200,
      message: 'Quiz generated successfully',
      result: { questions }
    })
  } catch (err: any) {
    console.error(err)
  }
}

export const getQuizByFileId = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.fileId as string

    if (!fileId) {
      return res.status(400).json({ message: 'fileId is required' })
    }

    const quizzes = await getAllQuizByFileId(fileId)

    res.json({
      success: true,
      data: quizzes,
      count: quizzes.length
    })
  } catch (err: any) {
    console.log(`Error when load quiz for file ${req.params.fileId}: ${err}`)
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
}

export const getQuizById = async (req: Request, res: Response) => {
  try {
    const quizId: string = req.params.quizId
    if (!quizId) {
      throw new Error('quiId invalid')
    }

    const quiz = await getQuizByIdService(quizId)

    res.json({
      success: true,
      data: quiz
    })
  } catch (err: any) {
    console.log(`Error when load quiz: ${err}`)
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
}

export const getAllQuestionByQuiz = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.quizId as string
    const isReview = req.query.review === 'true' || req.query.review === '1'

    if (!quizId) {
      return res.status(400).json({ message: 'quizId is required' })
    }

    const questions = await getAllQuestionByQuizService(quizId)

    // Kiểm tra questions có tồn tại và là array không
    if (!questions || !Array.isArray(questions)) {
      return res.json({
        success: true,
        data: [],
        count: 0,
        isReview
      })
    }

    // Field explain luôn được trả về trong response
    // Frontend sẽ quyết định khi nào hiển thị explain dựa trên flag isReview
    // Khi isReview = true: hiển thị explain cho tất cả câu trả lời
    // Khi isReview = false: có thể ẩn explain hoặc chỉ hiển thị khi user chọn xem đáp án
    const responseData = questions.map((question) => ({
      ...question,
      answers: (question.answers || []).map((answer) => ({
        _id: answer._id,
        content: answer.content,
        isCorrect: answer.isCorrect,
        explain: answer.explain || '' // Luôn trả về explain để frontend có thể sử dụng
      }))
    }))

    res.json({
      success: true,
      data: responseData,
      count: questions.length,
      isReview // Thêm flag để frontend biết đang ở chế độ review
    })
  } catch (err: any) {
    console.log(`Error when load question for quiz ${req.params.quizId}: ${err}`)
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
}

export const submitQuizAnswers = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.quizId as string

    if (!quizId) {
      return res.status(400).json({ message: 'quizId is required' })
    }

    const submitData: SubmitQuizRequest = req.body

    // Validate request body
    if (!submitData.answers || !Array.isArray(submitData.answers)) {
      return res.status(400).json({ message: 'answers array is required' })
    }

    if (submitData.answers.length === 0) {
      return res.status(400).json({ message: 'answers array cannot be empty' })
    }

    // Validate each answer
    for (const answer of submitData.answers) {
      if (!answer.questionId) {
        return res.status(400).json({ message: 'questionId is required for each answer' })
      }
      if (typeof answer.selectedAnswer !== 'number' || answer.selectedAnswer < 0) {
        return res.status(400).json({
          message: 'selectedAnswer must be a non-negative number (index)'
        })
      }
    }

    const result = await submitQuiz(quizId, submitData)

    res.json({
      success: true,
      data: result
    })
  } catch (err: any) {
    console.log(`Error when submit quiz ${req.params.quizId}: ${err}`)
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
}

export const getAllQuizzes = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId as string

    if (!userId) {
      return res.status(403).json({ message: 'userId invalid - unauthorized' })
    }

    const quizzes = await getAllQuizByUserId(userId)

    if (!quizzes) {
      console.log(`Error when get all quizzes - no data returned`)
      return res.json({
        success: true,
        data: [],
        count: 0
      })
    }

    return res.json({
      success: true,
      data: quizzes,
      count: quizzes.length
    })
  } catch (err: any) {
    console.log(`Error when get all quizzes ${err}`)
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
}

/**
 * POST /files/:fileId/import-questions
 * Import an array of questions (from request body) and persist as a new Quiz + Questions
 */
export const importQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId
    const { fileId } = req.params

    if (!userId) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Bạn cần đăng nhập để thực hiện thao tác này')
    }

    const payload = req.body?.questions ?? req.body
    if (!Array.isArray(payload) || payload.length === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Payload questions không hợp lệ')
    }

    // optional name and level
    const quizName = (req.body?.name as string) || `Imported Quiz - ${new Date().toISOString()}`
    const level = (req.body?.level as string) || 'ez'

    // create quiz
    const createdQuiz = await Quiz.create({ name: quizName, fileId, level })

    const arr = payload as Array<Record<string, unknown>>
    const questionDocs = arr.map((q, idx: number) => {
      const opts = (q.options ?? {}) as Record<string, unknown>
      const getOpt = (k: string) => String(opts[k] ?? '')
      const answerRaw = String(q.answer ?? '').toUpperCase()
      const answers = [
        { content: getOpt('A'), isCorrect: answerRaw === 'A' },
        { content: getOpt('B'), isCorrect: answerRaw === 'B' },
        { content: getOpt('C'), isCorrect: answerRaw === 'C' },
        { content: getOpt('D'), isCorrect: answerRaw === 'D' }
      ]
      return {
        name: `Câu ${idx + 1}`,
        question: String(q.question ?? ''),
        quizId: createdQuiz._id,
        answers
      }
    })

    await Question.insertMany(questionDocs)

    // increment quizCount on file
    try {
      await FileModel.findByIdAndUpdate(fileId, { $inc: { quizCount: 1 } })
    } catch (e) {
      console.warn('Failed to update file quizCount', e)
    }

    sendResponse(res, {
      code: StatusCodes.CREATED,
      message: 'Imported questions successfully',
      result: { quizId: (createdQuiz._id as unknown as import('mongoose').Types.ObjectId).toString() }
    })
  } catch (error) {
    next(error)
  }
}
