import User from '../models/UserModel.js'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    if(!username || !password) {
        return res.sendStatus(400)
    }

    const user = await  User.findOne({ username }).lean()

    if(!user) {
        return res.status(401).json({ message: 'Incorect login credentials'})
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match) {
        return res.status(401).json({ message: 'Incorect login credentials'})
    }

    try {
        const { password, ...data } = user

        const accessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m'})

        const refreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d'})

        res.cookie('token', refreshToken, {
            httpOnly: true, secure: false
        })
        res.status(200).json({ user: data, token: accessToken })
    } catch(error) {
        res.status(400).json({ message: error.message })
    }

})


export const refresh = asyncHandler(async (req, res) => {
    const { token } = req.cookies

    if(!token) {
        return res.sendStatus(401)
    }

    try {
        const { _id } = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(_id).select('-password').lean()

        const newAccessToken = jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m'})

        res.status(200).json({ user, token: newAccessToken })
    } catch(error) {
        res.status(401).json({ message: error.message })
    }

})


export const logout = (req, res) => {
    res.clearCookie('token')
    res.status(200).json({ message: 'cookie cleared!'})
}