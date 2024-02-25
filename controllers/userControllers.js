import User from '../models/UserModel.js'
import asyncHandler from 'express-async-handler'
import { isValidObjectId } from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'
import cloudinary from '../config/cloudinary.js'

export const createUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    if(!username || !password) {
        return res.sendStatus(400)
    }

    const exsists = await User.findOne({ username })

    if(exsists) {
        return res.status(409).json({ message: 'Username already in use'})
    }

    if(!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: 'Password is not strong enoug'})
    }

    const hash = await bcrypt.hash(password, 10)

    try {
        const user = await User.create({ username, password: hash })
        res.status(200).json({ message: `User ${user.username} has successfully been created`})
    } catch (error) {
        return res.status(400).json({ message: error.message})
    }

})


export const updateUser = asyncHandler(async (req, res) => {
    const { username, password, newPassword } = req.body
    const { _id } = req.user

    if(!_id || !isValidObjectId(_id)) {
        return res.status(400).json({ message: 'Invalid Object ID'})
    }

    const user = await User.findById(_id)

    if(password && newPassword) {

        const match = await bcrypt.compare(password, user.password)

        if(!match) {
            return res.status(401).json({ message: 'Incorect Password'})
        }

        if(!validator.isStrongPassword(newPassword)) {
            return res.status(400).json({ message: 'Password is not strong enough'})
        }

        if(password === newPassword) {
            return res.status(400).json({ message: 'New password is the same as the old one'})
        }

        const hash = await bcrypt.hash(newPassword, 10)

        user.password = hash
    }

    if(username) {

        const exists = await User.findOne({ username })

        if(exists) {
            return res.status(409).json({ message: 'Username already in use'})
        }
        
        user.username = username
    }

    try {
        await user.save()
        res.status(200).json({ message: `User ${user.username} has successfully been updated`})
    } catch (error) {
        return res.status(400).json({ message: error.message})
    }

})


export const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.user

    if(!_id || !isValidObjectId(_id)) {
        return res.status(400).json({ message: 'Invalid Object ID'})
    }

    try {
        const user = await User.findByIdAndDelete(_id)
        res.status(200).json({ message: `User ${user.username} has successfully been deleted`})
    } catch (error) {
        return res.status(400).json({ message: error.message})
    }
})


export const getUser = asyncHandler(async (req, res) => {

    const { username } = req.query

    if(!username) {
        res.sendStatus(400)
    }

    try {
        const user = await  User.find({ username: {
            $regex: username, $options: 'i'
        }, _id: {
            $not: { $eq: req.user._id }
        }}).select('-password').lean()
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})


export const uploadImage = asyncHandler(async (req, res) => {
    const buffer = req.file.buffer

    const result = await new Promise((resolve) => {
        cloudinary.uploader.upload_stream({
            folder: 'avatars'
        }, (error, uploadResult) => {
            if(error) console.log(error)
            return resolve(uploadResult)
        }).end(buffer);
    })

    const { _id } = req.user
    const avatar = result?.public_id

    if(avatar) {
        try {
            await User.findByIdAndUpdate(_id, { avatar })
            res.status(200).json({ avatar })
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }
})