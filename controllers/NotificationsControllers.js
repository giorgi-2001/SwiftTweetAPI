import Notification from '../models/NotificationModel.js'
import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'

export const sendNotification = asyncHandler(async (req, res) => {
    const { user, notification, chatId } = req.body

    if(!user || !notification || !chatId) {
        return res.sendStatus(400)
    }

    try {
        const exists = await Notification.findOne({ chatId, user })
            .select('-user')

        if(exists) {
            exists.seen = false
            await exists.save()
            res.status(200).json(exists) 
        } else {   
            const notif = await Notification.create({
                user, notification, chatId
            })
            res.status(200).json(notif) 
        }
       
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

export  const seenNotification = asyncHandler(async (req, res) => {
    const { notifId } = req.params

    if(!mongoose.isValidObjectId(notifId)) {
        return res.sendStatus(400)
    }

    try {
        await Notification.findOneAndUpdate({ _id: notifId }, { seen: true })
        res.status(200).json({ message: 'notification has been seen'})
    } catch (error) {
        res.status(404).json({ message: error.message })
    }

})


export const getNotifications = asyncHandler(async (req, res) => {
    const { _id } =  req.user

    try {
        await Notification.deleteMany({ seen: 'true' })
        const notifs = await Notification.find({ user: _id })
            .sort({ createdAt: -1 })
            .select('notification chatId')
            .lean()

        res.status(200).json(notifs)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})