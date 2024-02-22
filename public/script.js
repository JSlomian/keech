const socket = io('/')

socket.emit('join room', roomId, 10)

socket.on('user connected', userId => {
    console.log('user connected:', userId)
})

if (flvjs.isSupported()) {
    var videoElement = document.getElementById('videoElement');
    var flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: 'http://localhost:3001/live/user.flv',
        audio: true
    });
    flvPlayer.attachMediaElement(videoElement);
    flvPlayer.load();
}
// const player = document.querySelector('#videoElement')
// player.addEventListener('click', () => {
//     flvPlayer.play();
// })