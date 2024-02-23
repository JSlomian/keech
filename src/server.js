import express from "express"
import * as http from "http"
import https from "https"
import {Server} from "socket.io"
import NodeMediaServer from 'node-media-server'
import bodyParser from "body-parser";
import authRoutes from "../routes/authRoutes.js";
import nmsConfig from "../configs/nms.config.js";
import cookieParser from 'cookie-parser'
import fs from 'fs'
import path from 'path'
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const nms = new NodeMediaServer(nmsConfig)
nms.run()
const app = express()
const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, '../', 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../', 'cert', 'cert.pem'))
}, app)
// const httpserver = http.createServer(app)
const io = new Server(server)
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
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
app.use(authRoutes)

app.get('/setc', (req, res) => {
    // res.setHeader('Set-Cookie', 'newUser=true')

    res.send('cookies')
})

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
server.listen(3443)