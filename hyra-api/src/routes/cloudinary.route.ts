import express, { Router } from 'express'
import cloudinaryController from '~/controllers/cloudinary.controller'

const cloudinaryRoutes: Router = express.Router()

cloudinaryRoutes.get('/cloudinary-file', cloudinaryController.getCloudinaryFile)

export default cloudinaryRoutes
