const socket = io('/')

socket.emit('join room', roomId, userId)

socket.on('user connected', userId => {
    console.log('user connected:', userId)
})

socket.on('chat message', (msg, userName, roomId) => {
    const chat = document.querySelector('.chat');
    const item = document.createElement('span');

    if (parseInt(userId) !== 0) {
        const userLink = document.createElement('a');
        userLink.setAttribute('href', `/user/profile/${userName}`);
        userLink.textContent = userName + ": "; // Add a colon and space to separate the username from the message
        item.appendChild(userLink);
        const messageText = document.createTextNode(msg); // Create a text node for the message
        item.appendChild(messageText);
    } else {
        const messageText = document.createTextNode(`${userName}: ${msg}`); // Create a text node for the message
        item.appendChild(messageText);
    }

    chat.appendChild(item);

})
// socket.on('chat message', function(msg) {
//     var item = document.createElement('li');
//     item.textContent = msg;
//     messages.appendChild(item);
//     window.scrollTo(0, document.body.scrollHeight);
// });


document.querySelector('.sendMsg').addEventListener('click', () => {
    const input = document.querySelector('.message')
    let msg = input.value
    socket.emit('chat message', msg, userName, roomId)
    input.value = ''
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