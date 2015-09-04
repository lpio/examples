import Client from 'lpio-client'

function create(user) {
  let client = new Client({
    id: `client-${user}`,
    user: user,
    url: 'http://localhost:3000/lpio'
  })

  let channel = client.connect()

  channel.on('connected', () => {
    console.log('connected')
  })
  channel.on('disconnected', () => {
    console.log('disconnected')
  })
  channel.on('error', err => {
    console.log('error', err)
  })
  channel.on('message', message => {
    console.log('message', message)
  })
  channel.on('data', data => {
    console.log('data', data)
  })

  return client
}

let client
let text = document.querySelector('#text')
let user = document.querySelector('#user')
let recipient = document.querySelector('#recipient')

document.querySelector('#connect').addEventListener('submit', function(e) {
  e.preventDefault()
  if (client) client.disconnect()
  client = create(user.value)
})

document.querySelector('#disconnect').addEventListener('click', function(e) {
  e.preventDefault()
  client.disconnect()
})

document.querySelector('#send').addEventListener('submit', function(e) {
  e.preventDefault()
  let message = {
    data: text.value,
    recipient: recipient.value
  }
  client.send(message, function(err) {
    if (err) return console.log(err)
    console.log('Sent:', message)
    text.value = ''
  })
})
