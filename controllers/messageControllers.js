import Message from '../models/MessageModel.js'
import asynchandler from 'express-async-handler'

export const getMessages = asynchandler(async (req, res) => {
    const { chat } = req.query

    const page = req.query.page || 1
    const itemsPerPage = 30
    const skipValue = (page - 1) * itemsPerPage

    if(!chat) {
        return res.sendStatus(400)
    }

    try {
        const messages = await Message.find({ chat })
            .sort({ createdAt: -1 })
            .populate('sender', '-password')
            .skip(skipValue)
            .limit(itemsPerPage)
            .lean()
            
        res.status(200).json(messages)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

export const sendMessage = asynchandler(async (req, res) => {
    const { _id: sender } = req.user
    const { chat, text } = req.body

    if(!chat || !sender || !text) {
        return res.sendStatus(400)
    }

    try {
        const message = await Message.create({ chat, sender, text })
        const populatedMessage = await message.populate('sender', '-password')
        res.status(200).json(populatedMessage)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})