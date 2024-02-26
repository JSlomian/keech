import fs from "fs";
import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    http: {
        port: 3000,
        allow_origin: '*'
    },
    https: {
        port: 8443,
        key: fs.readFileSync(path.join(__dirname, process.env.KEY || '../cert/key.pem')),
        cert: fs.readFileSync(path.join(__dirname, process.env.CERT || '../cert/cert.pem')),
    },
    auth: {
        api: true,
        api_user: 'admin',
        api_pass: 'asdqwe',
        play: false,
        publish: true,
        secret: 'nodemedia2017privatekey'
    },
}