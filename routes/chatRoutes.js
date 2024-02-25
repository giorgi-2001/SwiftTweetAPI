import { Router } from 'express'
import { connectToChat, getChats } from '../controllers/ChatController.js'
import requireAuth from '../middleware/requireAuth.js'

const router = Router()

router.use(requireAuth)

router.post('/', connectToChat)

router.get('/', getChats)

export default router