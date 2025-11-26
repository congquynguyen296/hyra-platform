import { Router } from 'express'
import userController from '~/controllers/user.controller'
import { UpdateProfileDTO } from '~/dto/request/AuthDTO'
import validateDto from '~/middleware/validate-dto.middleware'

const router = Router()

router.get('/profile', userController.getProfile)

router.get('/statistics', userController.getUserStatistics)

router.put('/profile', validateDto(UpdateProfileDTO), userController.updateProfile)

export default router
