/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var redis = require('redis');
var redisclient = redis.createClient({
    retry_strategy: function (options) {
        //console.error(options);
        if (options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with a individual error
            return new Error('The server refused the connection');
            //console.error('Connection Not present');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands with a individual error
            return new Error('Retry time exhausted');
        }
        if (options.times_connected > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.max(options.attempt * 100, 3000);
    }
});

//redisclient.init = function (loglevel, logdirectory, logfilename, uniquename)
redisclient.init = function(loglevel)
{
}
redisclient.addKeyToRedis = function (key, value,cb)
{
    console.log("Entering addKeyToRedis key:" + key + "value: " + value);

    if ((value === 'undefined') || !value)
    {
        value = "";
    }
    redisclient.set(key, value, function (err, reply) {
        cb(reply);
        if (err) {
            console.error(err);
        } else
        {
            // console.log(key);
            console.log("Key add status: Key:" + key + "reply: " + reply);
        }


    });
    //console.log("added key " + key);
}
redisclient.getKeyFromRedis = function (key, value,cb)
{
    console.log("Entering getKeyToRedis key:" + key + "value: " + value);

    if ((value === 'undefined') || !value)
    {
        value = "";
    }
    redisclient.get(key, value, function (err, reply) {
        cb(reply);
        if (err) {
            console.error(err);
        } else
        {
            //console.log(key);
            console.log("Key get status: Key:" + key + "reply: " + reply);
        }


    });
    //console.log("added key " + key);
}

redisclient.checkIfKeyPresent = function (key, callback)
{
    console.log("Entering checkIfKeyPresent: " + key);
    //console.log(key);
    /*redisclient.exists(key, function(err, reply) {
     if (reply === 1) {
     console.log('key exists: ' + key + 'reply:' + reply);
     returnValue = reply;
     return reply
     } else {
     console.log('key doesn\'t exist Key: ' + key + 'reply: ' + reply);
     returnValue = reply;
     return reply
     }
     });*/
    redisclient.exists(key)
        .then(function (reply) {
            console.log(reply);
             callback(reply);
        })
        .catch(console.error)
        .lastly(function (reply){
            callback(reply);
        });
    console.log("Exiting checkIfKeyPresent" + key);
}


redisclient.deleteKeyFromRedis = function (key)
{
    console.log("Entering deleteKeyFromRedis " + key);
    console.log(key);
    redisclient.checkIfKeyPresent(key, function (reply) {

        if (reply === 1)
        {
            console.log("deleting key" + key);
            redisclient.del(key);
        } else
        {
           // console.log("key absent and no action taken: " + key);
        }

    });
    console.log("Exiting deleteKeyFromRedis " + key);

}
redisclient.cleanupRedis = function ()
{
    console.log("Entering cleanupRedis");
    redisclient.end(true); // No further commands will be processed
}
var g_cAsyncCallsPending = 0;

redisclient.AddRef = function()
{
    g_cAsyncCallsPending++;
    //console.log("AddRef pending="+g_cAsyncCallsPending);
}
redisclient.ReleaseRef = function()
{
    g_cAsyncCallsPending--;
    if(g_cAsyncCallsPending <= 0)
    {
        console.log("ReleaseRef Quitting="+g_cAsyncCallsPending);

        redisclient.quit();
    }
    //console.log("ReleaseRef pending="+g_cAsyncCallsPending);
}


/*redisclient.on("error", function (err) {
 console.log("Error " + err);
 });

 // syncho is giving error in 8.12.0 because the fibers library needs to be updated.
 // Resolve this if needed later -- phani

 var Sync = require('syncho');
 redisclient.sync = function(cb, o)
 {
    if(typeof cb !== 'function')
    {
        console.log("redisclient.Sync takes a callback function as parameter instead cb passed is "+cb);
        return;
    }
    Sync(function ()
    {
        try
        {
            cb(o); 
       }
        catch (e)
        {
        console.error(e);
        }
    });
}
 */

module.exports = redisclient;