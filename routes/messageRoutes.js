import { Router } from 'express'
import { getMessages, sendMessage } from '../controllers/messageControllers.js'
import requireAuth from '../middleware/requireAuth.js'

const router = Router()

router.use(requireAuth)

router.route('/').get(getMessages).post(sendMessage)


export default router
