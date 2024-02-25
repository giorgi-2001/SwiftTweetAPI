import { model, Schema } from 'mongoose'

const chatSchema = new Schema({

    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    isGroupChat: {
        type: Boolean,
        default: false
    },

    admin: {
        type: String,
    }

}, {
    timestamps: true
})

export default model('Chat', chatSchema)