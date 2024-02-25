import multer from 'multer'

const storage = multer.memoryStorage()

const upload = multer({ storage })

const singleFileUpload = upload.single('file')

export default singleFileUpload