const commander = require('commander')
const path = require('path')
const fs = require('fs')


var command = commander
  .version('1.0')
  .option('-c, --certpath <certpath>', 'certpath')
  .option('-n, --hostname <hostname>', 'hostname')
  .option('-p, --port <port>', 'port')
  .option('-r, --protocol <protocol>', 'protocol')
  .option('-l, --list', 'list')
  .option('-d, --default', 'default')
  .parse(process.argv)

function SaveDefaultConfig() {
  if (asc.defaults) return
  asc.defaults = {}
  var wb = asc.services["purplecheerio-redis"]
  for (var c in wb) {
    asc.defaults[c] = wb[c]
  }
}
function RestoreDefaultConfig() {
  if (!asc.defaults) return
  for (var c in asc.defaults) {
    asc.services["purplecheerio-redis"][c] = asc.defaults[c]
  }
  delete asc.defaults
}
if (process.argv.length === 2) {
  var app = require('purplecheerio-wave')
  app.startservice('purplecheerio-redis', __dirname, './appserviceconfig.json')
} else {
  const spath = path.resolve(__dirname, 'appserviceconfig.json')
  var asc = require(spath)
  if (command.default) {
    RestoreDefaultConfig()
    try {
      fs.writeFileSync(spath, JSON.stringify(asc, 0, 2))
    } catch (e) {
      console.error(e.message)
    }
    process.exit(0)
  }
  SaveDefaultConfig()
  if (command.list) {
    console.log(JSON.stringify(asc.services["purplecheerio-redis"], 0, 2))
    process.exit(0)
  }
  if (command.certpath) {
    asc.services["purplecheerio-redis"].certPath = command.certpath
  }
  if (command.hostname) {
    asc.services["purplecheerio-redis"].hostname = command.hostname
  }
  if (command.port) {
    var port = parseInt(command.port)
    if (isNaN(port)) {
      console.error('port has to be an integer')
      process.exit(1)
    }
    asc.services["purplecheerio-redis"].port = port
  }
  if (command.protocol) {
    if (command.protocol !== 'https' && command.protocol !== 'http') {
      console.error('protocol has to be either https or http')
      process.exit(1)
    }
    asc.services["purplecheerio-redis"].protocol = command.protocol
  }
  try {
    fs.writeFileSync(spath, JSON.stringify(asc, 0, 2))
  } catch (e) {
    console.error(e.message)
  }
}
