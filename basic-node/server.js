var express = require('express')
var bodyParser = require('body-parser')
var LpServer = require('lpio-server-node')
var promptly = require('promptly')

var lpServer = new LpServer()

express()
  .use(bodyParser.json())
  .all('/lpio', function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    if (req.method === 'OPTIONS') return res.end()

    var channel = lpServer.open(req.body)

    channel.on('message', function(message) {
      console.log('Message:', message)
    })
    channel.on('data', function(data) {
      console.log('Data:', data)
    })
    channel.once('close', function(data) {
      res.json(data)
    })
    channel.once('error', console.log)

    req.once('close', function() {
      // Close internal object when user aborts request.
      lpServer.close(req.body.client)
    })
  })
  .listen(3000)


function prompt() {
  promptly.prompt('Type "user:message"', function(err, input) {
    input = input.trim()
    if (!input) return

    console.time('delivery time ' + input)

    var data = input.split(':')
    lpServer.send({
      recipient: data[0],
      data: data[1]
    }, function(err) {
      if (err) return console.log('Error', err)
      console.timeEnd('delivery time ' + input)
      prompt()
    })
  })
}

prompt()
