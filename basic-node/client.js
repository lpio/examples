import Client from 'lpio-client-js'

function create(user) {
  let client = new Client({
    id: `client-${user}`,
    user: user,
    url: 'http://localhost:3000/lpio'
  })

  client.on('connected', () => {
    console.log('connected')
  })
  client.on('disconnected', () => {
    console.log('disconnected')
  })
  client.on('error', err => {
    console.log('error', err)
  })
  client.on('message', message => {
    console.log('message', message)
  })
  client.on('data', data => {
    console.log('data', data)
  })

  client.connect()

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
