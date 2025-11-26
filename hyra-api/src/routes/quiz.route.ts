import {
  getAllQuestionByQuiz,
  getAllQuizzes,
  getQuizByFileId,
  getQuizById,
  submitQuizAnswers,
  handleGenerateQuiz
} from '~/controllers/quiz.controller'
import express, { Router } from 'express'
import authenticate from '~/middleware/authen.middleware'
import validator from '~/middleware/validate-dto.middleware'
import { GenerateQuizDTO } from '~/dto/request/QuizDTO'

const quizRoute: Router = express.Router()

quizRoute.get('/all', authenticate, getAllQuizzes)

quizRoute.post('/generate', authenticate, validator(GenerateQuizDTO), handleGenerateQuiz)

quizRoute.get('/file/:fileId', authenticate, getQuizByFileId)

quizRoute.get('/:quizId/questions', authenticate, getAllQuestionByQuiz)

quizRoute.get('/:quizId', authenticate, getQuizById)

quizRoute.post('/:quizId/submit', authenticate, submitQuizAnswers)

export default quizRoute
