var fs = require('fs')
var program = require('commander')

var getFromBetween = {
  results: [],
  string: '',
  getFromBetween: function(sub1, sub2) {
    if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0)
      return false
    var SP = this.string.indexOf(sub1) + sub1.length
    var string1 = this.string.substr(0, SP)
    var string2 = this.string.substr(SP)
    var TP = string1.length + string2.indexOf(sub2)
    return this.string.substring(SP, TP)
  },
  removeFromBetween: function(sub1, sub2) {
    if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0)
      return false
    var removal = sub1 + this.getFromBetween(sub1, sub2) + sub2
    this.string = this.string.replace(removal, '')
  },
  getAllResults: function(sub1, sub2) {
    // first check to see if we do have both substrings
    if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return

    // find one result
    var result = this.getFromBetween(sub1, sub2)
    // push it to the results array
    this.results.push(result)
    // remove the most recently found one from the string
    this.removeFromBetween(sub1, sub2)

    // if there's more substrings
    if (this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
      this.getAllResults(sub1, sub2)
    } // else return
  },
  get: function(string, sub1, sub2) {
    this.results = []
    this.string = string
    this.getAllResults(sub1, sub2)
    return this.results
  }
}
function generateAppconfig(swaggerjson) {
  var appconfig = {}
  appconfig.servicename = swaggerjson.info.title.replace(/[^a-zA-Z]/g, '')
  appconfig.routes = []
  for (var path in swaggerjson.paths) {
    var currentpath = swaggerjson.paths[path]
    for (var method in currentpath) {
      var currentmethod = currentpath[method]
      var route = {}
      route = currentmethod
      var urlParams = getFromBetween.get(path, '{', '}')
      // console.log(result);
      route.route = path.replace(/}/g, '')
      route.route = route.route.replace(/{/g, ':')
      route.type = method
      route.configured = true
      route.routeclass = './' + appconfig.servicename + '_service.js'
      route.routefunction = currentmethod.operationId
      route.description = currentmethod.summary

      if (urlParams !== undefined && urlParams.length !== 0) {
        route.paramschema = {}
        route.paramschema.required = []
        route.paramschema.properties = {}
        for (var key in currentmethod.parameters) {
          var currentparameter = currentmethod.parameters[key]
          route.paramschema.required.push(currentparameter.name)
          route.paramschema.properties[currentparameter.name] = {}
          route.paramschema.properties[currentparameter.name].type =
            currentparameter.schema.type
        }
      }
      appconfig.routes.push(route)
    }
  }

  fs.writeFileSync(
    appconfig.servicename + '_appconfig.json',
    JSON.stringify(appconfig, null, 2),
    'utf-8'
  )
  return appconfig
}
function generateAppserviceconfig(appconfig, description) {
  var appserviceconfig = {}
  appserviceconfig.services = {}
  appserviceconfig.services[appconfig.servicename] = {}
  appserviceconfig.services[appconfig.servicename].protocol = 'http'
  appserviceconfig.services[appconfig.servicename].port = 9999
  appserviceconfig.services[appconfig.servicename].hostname = 'localhost'
  appserviceconfig.services[appconfig.servicename].configfilepath =
    './' + appconfig.servicename + '_appconfig.json'
  appserviceconfig.services[appconfig.servicename].security = 'nokey'
  appserviceconfig.services[appconfig.servicename].description = description

  fs.writeFileSync(
    appconfig.servicename + '_appserviceconfig.json',
    JSON.stringify(appserviceconfig, null, 2),
    'utf-8'
  )
}
function generateIndex(appconfig) {
  var indexjs = "var app = require('purplecheerio-wave') \n"
  indexjs += "app.startservice('"
  indexjs += appconfig.servicename + "', __dirname, './"
  indexjs += appconfig.servicename + "_appserviceconfig.json')"

  var beautify = require('js-beautify').js
  fs.writeFileSync(
    appconfig.servicename + '_index.js',
    beautify(indexjs, { indent_size: 2, space_in_empty_paren: true })
  )
}
function generateServicestub(appconfig) {
  var servicejs = ''
  for (var route in appconfig.routes) {
    var currentroute = appconfig.routes[route]
    var functionstring =
      'exports.' + currentroute.routefunction + ' = function (req,res) { \n'
    functionstring +=
      'res.status(200).json({"params=":req.params,"body":req.body, "query":req.query})'
    functionstring += '}'
    servicejs += functionstring + '\n'
  }
  var beautify = require('js-beautify').js
  fs.writeFileSync(
    appconfig.servicename + '_service.js',
    beautify(servicejs, { indent_size: 2, space_in_empty_paren: true })
  )
}

function main() {
  var swaggerjson

  program
    .version('1.0')
    .option('-s, --source <path>', 'source')
    .option('-h, --help', 'Help')
    .parse(process.argv)

  if (!process.argv.slice(2).length) {
    program.outputHelp()
    return
  }

  if (program.source) {
    // Delay because the sensor systemd function is executed too soon on boot.
    // console.log(program.source);
    swaggerjson = require(program.source)
    var appconfig = generateAppconfig(swaggerjson)
    generateAppserviceconfig(appconfig, swaggerjson.info.description)
    generateServicestub(appconfig)
    generateIndex(appconfig)
  } else program.outputHelp()
}

main()
