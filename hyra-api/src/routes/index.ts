import express, { Router } from 'express'
import authRoutes from '~/routes/auth.route'
import cloudinaryRoutes from '~/routes/cloudinary.route'
import userRoutes from '~/routes/user.route'
import fileRoutes from '~/routes/file.route'
import summarizeRoutes from '~/routes/summarize.route'
import quizRoute from './quiz.route'
import auth from '~/middleware/authen.middleware'
import subjectRoute from './subject.route'

const IndexRouter: Router = express.Router()

IndexRouter.use('/auth', authRoutes)

// Public Cloudinary proxy (must be before auth middleware so it's accessible without auth)
IndexRouter.use('/cloudinary', cloudinaryRoutes)

IndexRouter.use(auth)

IndexRouter.use('/subjects', subjectRoute)

IndexRouter.use('/users', userRoutes)

IndexRouter.use('/quizzes', quizRoute)

IndexRouter.use('/files', fileRoutes)

IndexRouter.use('/summarizes', summarizeRoutes)

export default IndexRouter
