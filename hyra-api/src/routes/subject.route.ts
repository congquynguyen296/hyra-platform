import { Router } from 'express'
import subjectController from '~/controllers/subject.controller'
import fileController from '~/controllers/file.controller'
import authenticate from '~/middleware/authen.middleware'

const subjectRoute = Router()

subjectRoute.get('/all', authenticate, subjectController.getAllSubject)

subjectRoute.post('/new', authenticate, subjectController.createSubject)

subjectRoute.put('/:subjectId', authenticate, subjectController.updateSubject)

subjectRoute.get('/:subjectId', authenticate, subjectController.getSubjectById)

subjectRoute.get('/:subjectId/files', authenticate, fileController.getFilesBySubjectId)

subjectRoute.delete('/:subjectId', authenticate, subjectController.deleteSubject)

export default subjectRoute
