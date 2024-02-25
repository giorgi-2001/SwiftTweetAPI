import { Router } from 'express'
import requireAuth from '../middleware/requireAuth.js'
import { 
    sendNotification, getNotifications, seenNotification
} from "../controllers/NotificationsControllers.js"

const router = Router()

router.use(requireAuth)

router.get('/', getNotifications)

router.post('/', sendNotification)

router.patch('/:notifId', seenNotification)

export default router

