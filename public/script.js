const socket = io('/')

socket.emit('join room', roomId, user)

socket.on('user connected', userId => {
    console.log('user connected:', userId)
})

socket.on('chat message', msg => {
    const chat = document.querySelector('.chat')
    const item = document.createElement('span')
    item.textContent = msg
    chat.append(item)

})
// socket.on('chat message', function(msg) {
//     var item = document.createElement('li');
//     item.textContent = msg;
//     messages.appendChild(item);
//     window.scrollTo(0, document.body.scrollHeight);
// });

document.querySelector('.sendMsg').addEventListener('click', () => {
    let msg = document.querySelector('.message').value
    socket.emit('chat message', msg)
})

if (flvjs.isSupported()) {
    var videoElement = document.getElementById('videoElement');
    var flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: `http://${location.hostname}:3000/live/${roomId}.flv`,
        audio: true
    });
    flvPlayer.attachMediaElement(videoElement);
    flvPlayer.load();
}