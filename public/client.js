const socket = io('https://lets-chat-35by.onrender.com/')

const form = document.getElementById('send-container')
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector('.container')

var audio = new Audio('ting.mp3')

const p = 3
const q = 11
const n = p * q //calculate n
var track
const phi = (p - 1) * (q - 1) //calculate phi

const encrypt = (message) => {
  //public key
  //e stands for encrypt
  const e = 7

  var newmsg = []

  for (var i = 0; i < message.length; i++) {
    if (message[i] != ' ') {
      const x = message[i]
      var ascii_code = x.charCodeAt(x)
      ascii_code = ascii_code - 97
      var c = Math.pow(ascii_code, e)
      c = c % n
      newmsg.push(c)
    } else {
      newmsg.push('-1')
    }
  }

  return newmsg
}

const decrypt = (message) => {
  var newmsg = []
  const d = 3

  for (var i = 0; i < message.length; i++) {
    if (message[i] != '-1') {
      var p = Math.pow(message[i], d)
      p = p % n

      newmsg.push(p)
    } else {
      newmsg.push(' ')
    }
  }

  let str = ''

  for (var i = 0; i < newmsg.length; i++) {
    if (newmsg[i] === ' ') {
      str += ' '
    } else {
      const val = newmsg[i] + 97
      const char = String.fromCharCode(val)
      //  console.log(char);
      str += char
    }
  }

  return str
}

const append = (message, position) => {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageElement.classList.add('message')
  messageElement.classList.add(position)
  messageContainer.append(messageElement)

  if (position == 'left') {
    audio.play()
  }
}

// Ask new user for his her name nad let other know
const name = prompt('Enter your name to join')
socket.emit('new-user-joined', name)

//If a new user joined recieve his her name from server
socket.on('user-joined', (data) => {
  append(`${data} joined the chat`, 'right')
})

// If server send a message recieve it
socket.on('recieve', (data) => {
  const decmsg = decrypt(data.message)
  console.log(decmsg)

  append(`${data.name}: ${decmsg}`, 'left')
})

// If a user leaves the chat append the info to the container
socket.on('left', (data) => {
  append(`${data} left the chat`, 'right')
})

// If the form get submitted, send server the message
form.addEventListener('submit', (e) => {
  e.preventDefault()
  const message = messageInput.value
  const encmsg = encrypt(message)
  append(`You:${message}`, 'right')
  console.log(encmsg)
  socket.emit('send', encmsg)
  messageInput.value = ''
})
