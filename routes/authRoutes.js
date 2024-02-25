import { login, refresh, logout } from '../controllers/authControllers.js'
import { Router} from 'express'

const router = Router()

router.post('/login', login)

router.get('/refresh', refresh)

router.post('/logout', logout)

export default router

