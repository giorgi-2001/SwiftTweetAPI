import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const requireAuth = (req, res, next) => {
    const { authorization } = req.headers

    if(!authorization) {
        return res.sendStatus(401)
    }

    try {
        const token = authorization.split(' ')[1]
        const { _id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = { _id }
        next()
    } catch (error) {
        res.sendStatus(403)
    }

}

export default requireAuth