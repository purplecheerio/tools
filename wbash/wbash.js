const fs = require('fs')
const path = require('path')
var history = []
exports.RouteGetSomething = function(req, res) {
  var spawn = require('child_process').spawn
  // var child = spawn('ls -las', {
  var child = spawn('a=1 ; echo $a', {
    shell: true
  })
  child.stderr.on('data', function(data) {
    res.status(500).send(data.toString())
  })
  child.stdout.on('data', function(data) {
    res.status(200).send(data.toString())
  })
  child.on('exit', function(exitCode) {})
}
function RenderForm(req, res) {
  var pathtoread = path.join(__dirname, '/bashform.template')
  var str = fs.readFileSync(pathtoread, 'UTF8')
  var strRes = ''
  var strCmds = ''
  var strCmdValue = ''
  if (history.length) {
    strCmdValue = "value='" + history[history.length - 1].cmd + "'"
    strRes += "<li class='list-group-item list-group-item-info'>"
    // strRes += "<dl  class='dl-horizontal vcenter'>"
    for (var i = history.length - 1; i >= 0; i--) {
      strCmds +=
        "<li class='list-group-item'><a href='#" +
        i +
        "'>" +
        history[i].cmd +
        '</a></li>'
      strRes +=
        "<li class='list-group-item list-group-item-success' id='" +
        i +
        "'>" +
        history[i].cmd +
        '</li>'
      strRes +=
        "<li class='list-group-item'><pre>" + history[i].result + '</pre></li>'
    }
    strRes += '</dl>'
    strRes += '</li>'
  }
  str = str
    .replace(/REPLResults/g, strRes)
    .replace(/REPLCommands/g, strCmds)
    .replace(/REPLCmdValue/g, strCmdValue)

  res.status(200).send(str)
}
function AppendResult(cmd, result) {
  var o = {
    cmd: cmd,
    result: result.toString()
  }
  history.push(o)
}
exports.RouteGetSomethingForm = function(req, res) {
  RenderForm(req, res)
}
exports.RoutePostSomething = function(req, res) {
  var spawn = require('child_process').spawn
  var dataCum = []
  var child = spawn(req.body.cmd, {
    shell: true
  })

  child.stderr.on('data', function(data) {
    dataCum.push(data)
  })
  child.stdout.on('data', function(data) {
    dataCum.push(data)
  })
  child.on('exit', function(exitCode) {
    AppendResult(req.body.cmd, Buffer.concat(dataCum))
    RenderForm(req, res)
  })
}
