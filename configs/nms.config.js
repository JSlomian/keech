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
    auth: {
        api : true,
        api_user: 'admin',
        api_pass: 'asdqwe',
        play: false,
        publish: true,
        secret: 'nodemedia2017privatekey'
    },
}