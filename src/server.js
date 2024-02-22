import express from "express"
import * as http from "http"
import {Server} from "socket.io"
import NodeMediaServer from 'node-media-server'
import sqlite3 from 'sqlite3'
import bodyParser from "body-parser";
import userController from "../routes/user.js";
import nmsConfig from "../nms.config.js";

const db = new sqlite3.Database('./main.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.log(err.message)
    }
})

const nms = new NodeMediaServer(nmsConfig)
nms.run()
const app = express()
const server = http.createServer(app)
const io = new Server(server)
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "twig")
app.set("twig options", {
    allowAsync: true,
    strict_variables: false
})

app.get('/', (req, res) => {
    res.render("main")
})

app.get('/watch/:room', (req, res) => {
    res.render('room', {roomId: req.params.room, user: 'asd'})
})

app.get('/message/:room', (req, res) => {

})

app.use('/user', userController)

io.on('connection', async(socket) => {
    console.log('user connected')

    // join room event
    socket.on('join room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user connected', userId)
    })

    socket.on('chat message', msg => {
        // socket.join(roomId)
        // socket.to(roomId).emit('message new', userId, msg)
        io.emit('chat message', msg)
    })

    //offer event
    socket.on('offer', (offer, roomId) => {
        socket.to(roomId).emit('offer', offer)
        console.log('sent offer to room', roomId)
    })

    // ICE candidate event
    socket.on('ice candidate', (candidate, roomId) => {
        socket.to(roomId).emit('ice candidate', candidate)
        console.log('Sent ICE candidate to room:', roomId)
    });

    // Disconnect event
    socket.on('disconnect', () => {
        console.log('A user disconnected.')
    });
})
server.listen(3000)