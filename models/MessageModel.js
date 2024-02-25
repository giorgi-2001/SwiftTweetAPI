import { Schema, model } from 'mongoose'

const messageSchema = new Schema({

    chat: {
        type: String,
        required: true
    },

    text: {
        type: String,
        required: true
    },

    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

}, {
    timestamps: true
})

export default model('Message', messageSchema)