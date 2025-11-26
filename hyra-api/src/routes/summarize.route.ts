import { Router } from 'express'
import multer from 'multer'
import { handleTranslateHTML } from '../controllers/translate.controller'
import { handleSummarize } from '../controllers/summarize.controller'

const router = Router()

const upload = multer({ dest: 'uploads/' })

router.post('/generation', upload.single('file'), handleSummarize)

router.post('/translation', handleTranslateHTML)

export default router
