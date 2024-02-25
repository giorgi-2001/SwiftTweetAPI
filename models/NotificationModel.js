import { Schema, model } from 'mongoose'

const notificationSchema =  new Schema({
    user: {
        type: String,
        required: true
    },

    notification: {
        type: String,
        required: true
    },

    chatId: {
        type: String,
        required: true
    },

    seen: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

export default model('Notification', notificationSchema)