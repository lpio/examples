var express = require('express')
var bodyParser = require('body-parser')
var LpServer = require('lpio-server-node')
var promptly = require('promptly')

var lpServer = new LpServer()
  .on('error', console.log)

express()
  .use(bodyParser.json())
  .all('/lpio', function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    if (req.method === 'OPTIONS') return res.end()

    lpServer
      .open(req.body)
      .on('message', function(message) {
        console.log('Message:', message)
      })
      .on('data', function(data) {
        console.log('Data:', data)
      })
      .once('close', function(data) {
        res.json(data)
      })
      .once('error', console.log)
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
