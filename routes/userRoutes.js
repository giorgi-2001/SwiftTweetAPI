import { Router } from 'express'
import requireAuth from '../middleware/requireAuth.js'
import singleFileUpload from '../middleware/multer.js'
import {
    getUser,
    createUser,
    updateUser,
    deleteUser,
    uploadImage
} from '../controllers/userControllers.js'

const router = Router()

router.post('/', createUser)

router.use(requireAuth)

router.route('/').get(getUser).patch(updateUser).delete(deleteUser)

router.patch('/avatar', singleFileUpload, uploadImage)


export default router