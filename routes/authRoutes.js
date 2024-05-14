import { login, refresh } from '../controllers/authControllers.js'
import { Router } from 'express'

const router = Router()

router.post('/login', login)

router.post('/refresh', refresh)

export default router

