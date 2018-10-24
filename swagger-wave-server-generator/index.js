fs = require("fs");

var getFromBetween = {
    results:[],
    string:"",
    getFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var SP = this.string.indexOf(sub1)+sub1.length;
        var string1 = this.string.substr(0,SP);
        var string2 = this.string.substr(SP);
        var TP = string1.length + string2.indexOf(sub2);
        return this.string.substring(SP,TP);
    },
    removeFromBetween:function (sub1,sub2) {
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
        var removal = sub1+this.getFromBetween(sub1,sub2)+sub2;
        this.string = this.string.replace(removal,"");
    },
    getAllResults:function (sub1,sub2) {
        // first check to see if we do have both substrings
        if(this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

        // find one result
        var result = this.getFromBetween(sub1,sub2);
        // push it to the results array
        this.results.push(result);
        // remove the most recently found one from the string
        this.removeFromBetween(sub1,sub2);

        // if there's more substrings
        if(this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
            this.getAllResults(sub1,sub2);
        }
        else return;
    },
    get:function (string,sub1,sub2) {
        this.results = [];
        this.string = string;
        this.getAllResults(sub1,sub2);
        return this.results;
    }
};
function writewavefile(filename,filecontent)
{

}
function generate_appconfig(swaggerjson)
{
    var appconfig = {};
    appconfig.servicename = swaggerjson.info.title.replace(/[^a-zA-Z]/g, "");
    appconfig.routes = [];
    for (var path in  swaggerjson.paths){
        var currentpath = swaggerjson.paths[path];
        for (var method in currentpath ) {
            currentmethod = currentpath[method];
            var route = {}
            route = currentmethod;
            var urlParams = getFromBetween.get(path,"{","}");
            //console.log(result);
            route.route = path.replace(/}/g, "");
            route.route = route.route.replace(/{/g, ":");
            route.type = method;
            route.configured = true;
            route.routeclass = "./" + appconfig.servicename + "_service.js";
            route.routefunction  = currentmethod.operationId;
            route.description1 = currentmethod.summary;
            
            if (urlParams !== undefined && urlParams.length != 0) {
               route.paramschema = {}
               route.paramschema.required = []
               route.paramschema.properties = {};
               for (var key in  currentmethod.parameters)
               {    
                   var currentparameter = currentmethod.parameters[key];
                   route.paramschema.required.push(currentparameter.name);
                   route.paramschema.properties[currentparameter.name] = {};
                   route.paramschema.properties[currentparameter.name].type = currentparameter.schema.type;
               }
            }
            appconfig.routes.push(route);
        }

    }

   fs.writeFile(appconfig.servicename + "_appconfig.json", JSON.stringify(appconfig, null, 2) , 'utf-8');
   return appconfig;


}
function generate_appserviceconfig(appconfig,description)
{
    var appserviceconfig = {};
    appserviceconfig.services = {};
    appserviceconfig.services[appconfig.servicename] = {};
    appserviceconfig.services[appconfig.servicename].protocol = "http";
    appserviceconfig.services[appconfig.servicename].port = 9999 ;
    appserviceconfig.services[appconfig.servicename].hostname = "localhost";
    appserviceconfig.services[appconfig.servicename].configfilepath = "./" + appconfig.servicename + "_appconfig.json";
    appserviceconfig.services[appconfig.servicename].security = "nokey";
    appserviceconfig.services[appconfig.servicename].description1 = description;

    fs.writeFile(appconfig.servicename + "_appserviceconfig.json", JSON.stringify(appserviceconfig, null, 2) , 'utf-8');
   


}
function generate_index(appconfig)
{

    var indexjs = "var app = require(\'purplecheerio-wave\') \n";
    indexjs += "app.startservice(\'" ;
    indexjs += appconfig.servicename + "\', __dirname, \'./" ;
    indexjs += appconfig.servicename + "_appserviceconfig.json\')" ;
    
    var beautify = require('js-beautify').js;
    fs.writeFile(appconfig.servicename+"_index.js",beautify(indexjs, { indent_size: 2, space_in_empty_paren: true }));


}
function generate_servicestub(appconfig)
{

    var servicejs = "";
    for (var route in appconfig.routes)
    {
        currentroute = appconfig.routes[route];
        var functionstring = "exports."+currentroute.routefunction + " = function (req,res) { \n" ;
        functionstring += "res.status(200).json({\"params=\":req.params,\"body\":req.body, \"query\":req.query})";
        functionstring += "}";
        servicejs += functionstring + "\n" ; 
    }
    var beautify = require('js-beautify').js;
    fs.writeFile(appconfig.servicename+"_service.js",beautify(servicejs, { indent_size: 2, space_in_empty_paren: true }));


}

function main()
{
    
    var swaggerjson = require("./examples/openapi.json");

    var appconfig = generate_appconfig(swaggerjson);
    generate_appserviceconfig(appconfig,swaggerjson.info.description);
    generate_servicestub(appconfig);
    generate_index(appconfig);
    

}


main();