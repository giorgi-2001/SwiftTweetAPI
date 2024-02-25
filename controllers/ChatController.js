import asyncHandler from 'express-async-handler'
import Chat from '../models/ChatModel.js'


export const connectToChat = asyncHandler(async (req, res) => {

    const { users, isGroupChat } = req.body

    const { _id } = req.user

    if(!users || !Array.isArray(users) || users?.length < 2) {
        return res.sendStatus(400)
    }

    const exists = await Chat.findOne({
        users: {
            $all: users
        }
    })

    if(exists) {
        const chat = await exists.populate('users', '-password')
        return res.status(200).json(chat)
    } else {
        if(isGroupChat) {
            try {
                const chat = await Chat.create({ users, isGroupChat, admin: _id })
                const populatedChat = await chat.populate('users', '-password')
                res.status(200).json(populatedChat)
            } catch (error) {
                res.status(404).json({ message: error.message })
            }
        } else {
            try {
                const chat = await Chat.create({ users })
                const populatedChat = await chat.populate('users', '-password')
                res.status(200).json(populatedChat)
            } catch (error) {
                res.status(404).json({ message: error.message })
            }
        }
    }
})


export const getChats = asyncHandler(async (req, res) => {

    const { _id } = req.user

    try {
        const myChats = await Chat.find({ 
            users: { $in: [ _id ]}
        }).sort({ createdAt: -1 }).populate('users', '-password')
        res.status(200).json(myChats)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})