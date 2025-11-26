import { Router } from 'express'
import subjectController from '~/controllers/subject.controller'
const router = Router()

/**
 * GET /debug/users → xem danh sách user
 */
router.get('', subjectController.getAllSubject)
router.post('', subjectController.createSubject)
router.put('', subjectController.updateSubject)
export default router
