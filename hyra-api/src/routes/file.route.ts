import express, { Router } from 'express'
import fileController from '~/controllers/file.controller'
import { importQuestions } from '~/controllers/quiz.controller'
import authenticate from '~/middleware/authen.middleware'
import { uploadFile } from '~/utils/cloudinaryUtil'

const fileRoutes: Router = express.Router()

fileRoutes.get('/all', authenticate, fileController.getAllFiles)

fileRoutes.get('/search', authenticate, fileController.searchFiles)

fileRoutes.post('/new', authenticate, uploadFile.single('file'), fileController.uploadFile)

fileRoutes.post('/:fileId/import-questions', authenticate, importQuestions)

fileRoutes.get('/:fileId', authenticate, fileController.getFileById)

fileRoutes.delete('/:fileId', authenticate, fileController.deleteFile)

export default fileRoutes
