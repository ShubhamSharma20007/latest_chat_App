const env = require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const dbConnection = require('./config/dbConnection');
const routes = require('./routes/userRoute');
const messageroute = require('./routes/messageRoute');
const soket = require('socket.io');
dbConnection()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))


app.use('/api/v1/auth', routes)
app.use('/api/v1/message', messageroute)


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

const io = soket(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }

})

global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id)
    })
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.message)
        }
    })
})