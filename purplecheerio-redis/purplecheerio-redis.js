const fs = require('fs')
const path = require('path')

var redisclient = require(__dirname+'/redis.js'); 

var history = []
var lastCmdRes = {}

function RenderForm(req, res) {
  var pathtoread = path.join(__dirname, '/redisform.template')
  var str = fs.readFileSync(pathtoread, 'UTF8')
  var strRes = ''
  var strCmds = ''
  // var strCmdValue = ''
  if (history.length) {
    // strCmdValue = 'value="' + history[history.length - 1].cmd + '"'
    strRes += "<li class='list-group-item list-group-item-info'>"
    // strRes += "<dl  class='dl-horizontal vcenter'>"
    for (var i = history.length - 1; i >= 0; i--) {
      strCmds +=
        "<li class='list-group-item' style='width:230px'><a href='#" +
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
    // strRes += '</dl>'
    strRes += '</li>'
  }
  str = str
    .replace(/REPLResults/g, strRes)
    .replace(
      /<li class="list-group-item active" style="width:230px">Commands<\/li>/,
      '<li class="list-group-item active" style="width:230px">Commands</li>' +
        strCmds
    )
  //  .replace(/REPLCmdValue/g, strCmdValue)

  res.status(200).send(str)
}
function AppendResult(ns, key, value, result) {
  var o = {
    cmd: cmd,
    result: result.toString()
  }
  history.push(o)
}
exports.RouteGetForm = function(req, res) {
  RenderForm(req, res)
}
function ForEachKeyValues(arr, res, query, cb)
{
  redisclient.keys(query, function(err, resRedis)
  {
      if(err)
          res.status(404).send(err.message);
      else
      {
       if(resRedis.length === 0)
        {
          res.json({"data":"no elements"})
          return;
        }
        //for(var i in res)
        resRedis.forEach(function(key)
        {
            // redisclient.AddRef();
            redisclient.get(key, function(err1, value)
            {
              cb(arr, resRedis.length, res, key, value);
              // redisclient.ReleaseRef();
            });
        });
        //redisclient.ReleaseRef();
      }
  });

}
function ComposeKey(namespace, key)
{
  return namespace+":"+key;
}
function DecomposeKey(compkey)
{
  var arr = compkey.split(':');
  return {"namespace":arr[0],"key":arr[1]}

}
function CallBackGetNamespaces(o, maxLength, res, key, value)
{
  var oo = DecomposeKey(key);
  o.count++;
  if(!o.namespaces[oo.namespace])
    o.namespaces[oo.namespace] = 1;
  if(o.count == maxLength)
  {
    var arrNS = [];
    for(var ns in o.namespaces)
      arrNS.push(ns);
    res.json(arrNS);
  }
}

exports.RouteGetNamespaces = function(req, res)
{
  var o = {
    count:0,
    namespaces:[]
  };
  
  ForEachKeyValues(o, res, "*", CallBackGetNamespaces);
  
}
function CallBackGetkeys(arr, maxLength, res, key, value)
{
  var oo = DecomposeKey(key);
  arr.push(oo);
  if(arr.length == maxLength)
    res.json(arr);
}
exports.RouteGetKeys = function(req, res)
{
  var arr = [];

  ForEachKeyValues(arr, res, req.params.namespace+":*", CallBackGetkeys);
}
function CallBackGetKeyValues(arr, maxLength, res, key, value)
{
  var oo = DecomposeKey(key);
  oo.value = value;
  arr.push(oo);
  if(arr.length == maxLength)
    res.json(arr);
}
exports.RouteGetKeyValues = function(req, res)
{
  var arr = [];

  ForEachKeyValues(arr, res, req.params.namespace+":*", CallBackGetKeyValues);
}

exports.RouteGetKey = function(req, res)
{
  var arr = [];
  
  ForEachKeyValues(arr, res, req.params.namespace+":"+req.params.key, CallBackGetKeyValues);
  
}
function CallBackSetKeyValue(res, namespace, key, value)
{
  var oo = [{"namespace":namespace,"key":key, "value":value}];
  res.json(oo);
}
function SetKeyValues(res, namespace, keyI, value, cb)
{
  redisclient.set(namespace+":"+keyI, value, function(err, resRedis){
      cb(res, namespace, keyI, value)
      // redisclient.ReleaseRef();
  });

}

exports.RoutePutKeys = function(req, res)
{
  SetKeyValues(res, req.params.namespace, req.params.key, req.body.value, CallBackSetKeyValue);
}

function DeleteKeys(arr, res, namespace, keyI, cb)
{
  redisclient.keys(namespace, function(err, resRedis)
  {
      if(err)
          res.status(404).send(err.message);
      else
      {
        if(keyI)
        {
          redisclient.del(ComposeKey(namespace, keyI), function(err1, value)
          {
            cb(arr, 1, res, ComposeKey(namespace, keyI), value)
            // redisclient.ReleaseRef();
          });
          return;      
        }
        //for(var i in res)
        resRedis.forEach(function(key)
        {
            // redisclient.AddRef();
            redisclient.del(key, function(err1, value)
            {
              cb(arr, resRedis.length, res, key, "<Deleted>");
              // redisclient.ReleaseRef();
            });
        });
        //redisclient.ReleaseRef();
      }
  });

}

function CallBackDeleteKeyValues(arr, maxLength, res, key, value)
{
  var oo = DecomposeKey(key);
  oo.value = "deleted "+value+" key-value pairs";
  arr.push(oo);
  if(arr.length == maxLength)
    res.json(arr);
}

exports.RouteDeleteKey = function(req, res)
{
  var arr = [];
  
  DeleteKeys(arr, res, req.params.namespace, req.params.key, CallBackDeleteKeyValues);
  
}
exports.RouteDeleteNamespace = function(req, res)
{
  var arr = [];
  
  DeleteKeys(arr, res, req.params.namespace+":*", null, CallBackDeleteKeyValues);
  
}

