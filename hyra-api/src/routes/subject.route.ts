import { Router } from 'express'
import subjectController from '~/controllers/subject.controller'
import fileController from '~/controllers/file.controller'
import authenticate from '~/middleware/authen.middleware'

const subjectRoute = Router()

subjectRoute.get('/all', subjectController.getAllSubject)

subjectRoute.post('/new', subjectController.createSubject)

subjectRoute.put('/:subjectId', subjectController.updateSubject)

subjectRoute.get('/:subjectId', subjectController.getSubjectById)

subjectRoute.get('/:subjectId/files', authenticate, fileController.getFilesBySubjectId)

export default subjectRoute
