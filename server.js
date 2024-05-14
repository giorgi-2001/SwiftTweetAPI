import express from 'express'
import dotenv from 'dotenv/config'
import mongoose from 'mongoose'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import authRoutes from './routes/authRoutes.js'
import notificationRoutes from './routes/NotificationRoutes.js'
import corsOptions from './config/corsOptions.js'
import { Server } from 'socket.io'

const PORT = process.env.PORT || 3500


const app = express()

app.use(cors(corsOptions))

app.use(express.json())

app.use((req, res, next) => {
    console.log(req.method, req.path)
    next()
})

app.use('/user', userRoutes)

app.use('/message', messageRoutes)

app.use('/chat', chatRoutes)

app.use('/auth', authRoutes)

app.use('/notif', notificationRoutes)


const server = app.listen(PORT,
    console.log(`Server started on port - ${PORT}\nConnected to MongoDB`))

const io = new Server(server, {
    cors: 'https://swifttweet.onrender.com',
})

let activeUsers = []

io.on('connection', (socket) => {
    console.log('connected to Socket')

    socket.on('login', (user) => {
        console.log(`User ${user.username} has connected`)
        socket.join(user._id)
        activeUsers.push({ ...user, socketId: socket.id })
        io.emit('activeUsers', activeUsers)
    }),

        socket.on('logout', (user) => {
            console.log(`User ${user.username} has disconnected`)
            socket.leave(user._id)
            activeUsers = activeUsers.filter(us => us._id !== user._id)
            io.emit('activeUsers', activeUsers)
        })

    socket.on('disconnect', () => {
        activeUsers = activeUsers.filter(us => us.socketId !== socket.id)
        io.emit('activeUsers', activeUsers)
    })


    socket.on('chatJoined', (chatId) => {
        socket.join(chatId)
    })

    socket.on('chatLeft', (chatId) => {
        socket.leave(chatId)
    })

    socket.on('messageSent', (message) => {
        socket.to(message.chat).emit('messageRecieved', message)
    })

    socket.on('typingStarted', (chatId) => {
        socket.to(chatId).emit('typing')
    })

    socket.on('typingStopped', (chatId) => {
        socket.to(chatId).emit('notTyping')
    })

    socket.on('notificationSent', ({ sender, reciever, chatId }) => {
        const notification = `${sender.username} sent you a new message`
        socket.to(reciever._id).emit('notificationRecieved', {
            sender, notification, chatId
        })
    })

})

mongoose.connect(process.env.MONGO_URI).then(() => {
    server
})





