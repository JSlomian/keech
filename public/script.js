const socket = io('/')

socket.emit('join room', roomId, userId)

socket.on('user connected', userId => {
    console.log('user connected:', userId)
})

socket.on('chat message', (msg, userName, roomId) => {
    const chat = document.querySelector('.chat')
    const item = document.createElement('span')
    item.setAttribute('class', 'block')

    if (parseInt(userId) !== 0) {
        const colors = ['red', 'green', 'blue', 'yellow', 'purple']
        let random = Math.floor(Math.random()*colors.length)
        const userLink = document.createElement('a')
        userLink.setAttribute('href', `/watch/${userName}`)
        userLink.setAttribute('style', `color: ${colors[random]}`)
        userLink.textContent = userName
        item.appendChild(userLink)
        const messageText = document.createTextNode(': ' + msg)
        item.appendChild(messageText)
    } else {
        const messageText = document.createTextNode(`${userName}: ${msg}`)
        item.appendChild(messageText)
    }

    chat.appendChild(item)
    if (chat.scrollHeight > chat.clientHeight) {
        // Smooth scroll to the target element within the div
        item.scrollIntoView({behavior: 'smooth'})
    }
    const input = document.querySelector('.message')
    input.focus()
})

function sendMessage() {
    const input = document.querySelector('.message')
    let msg = input.value
    if (msg !== '') {
        socket.emit('chat message', msg, userName, roomId)
        input.value = ''
    }
}

document.querySelector('.sendMsg').addEventListener('click', sendMessage)

document.querySelector('.message').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage()
    }
})


if (flvjs.isSupported()) {
    var videoElement = document.getElementById('videoElement');
    var flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: `https://${location.hostname}:8443/live/${roomId}.flv`,
        audio: true
    });
    flvPlayer.attachMediaElement(videoElement);
    flvPlayer.load();
}