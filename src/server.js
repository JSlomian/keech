import express from "express"
import https from "https"
import {Server} from "socket.io"
import NodeMediaServer from 'node-media-server'
import bodyParser from "body-parser";
import authRoutes from "../routes/authRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import nmsConfig from "../configs/nms.config.js";
import cookieParser from 'cookie-parser'
import fs from 'fs'
import path from 'path'
import * as url from 'url';
import {checkUser, requireAuth} from "../middleware/authMiddleware.js";
import {db, dbGet} from "./database.js";
import * as http from "http";
import livereload from 'livereload'


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


let activeStreams = {}
const nms = new NodeMediaServer(nmsConfig)
nms.run()
const app = express()
const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, process.env.KEY || '../cert/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, process.env.CERT || '../cert/cert.pem'))
}, app)
// const server = http.createServer(app)
const io = new Server(server)
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development'
}
if (process.env.NODE_ENV !== 'production') {
    const liveserver = livereload.createServer({
        extraExts: ['twig']
    })
    liveserver.watch(path.join(__dirname,'../views'),path.join(__dirname,'../public'))
}
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(checkUser)
app.use((req, res, next) => {
    res.locals.env = process.env.NODE_ENV || 'development'
    next()
})
app.set("view engine", "twig")
app.set("twig options", {
    allowAsync: true,
    strict_variables: false
})

app.get('/', (req, res) => {
    res.render("main", {activeStreams, activeStreamsJson: JSON.stringify(activeStreams)})
})

app.get('/clear', (req, res) => {
    db.run(`DELETE FROM user`)
    res.sendStatus(200)
})

app.get('/watch/:user', async (req, res) => {
    const roomExists = await dbGet(`SELECT username FROM user WHERE username = ?`, [req.params.user])
    if (roomExists) {
        res.render('room', {roomId: req.params.user})
    }
    res.render('noroom')
})
app.use(authRoutes)
app.use('/user', requireAuth, userRoutes)


nms.on('prePublish', (id, streamPath, args) => {
    console.log(`stream starting ${streamPath}`)
    activeStreams[streamPath] = {id, streamPath}
})

nms.on('donePublish', (id, streamPath, args) => {
    console.log(`Stream ended: ${streamPath}`);
    delete activeStreams[streamPath];
})
io.on('connection', async (socket) => {
    console.log('user connected')

    // join room event
    socket.on('join room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user connected', userId)
    })

    socket.on('chat message', (msg, username, roomId) => {
        socket.join(roomId)
        io.to(roomId).emit('chat message', msg, username, roomId)
    })

    // Disconnect event
    socket.on('disconnect', () => {
        console.log('A user disconnected.')
    });
})
server.listen(3443)