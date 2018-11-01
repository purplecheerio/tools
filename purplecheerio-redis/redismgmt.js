var fs = require("fs");
var redisclient = require('./redis.js'); 
var stringArgv = require('string-argv');


const readline = require('readline');


function ReadCommandNow()
{
   //console.log("hello world");
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("command:", function(str)
    {
        //console.log("str="+str);
        var argv = stringArgv(str, 'node', process.argv[1]);
        //console.log(argv);
        ProcessCommand(argv);
        //redisclient.ReleaseRef();
        rl.close();
    });
}
function ReadCommand()
{
    setTimeout(ReadCommandNow, 100);
}
var commander = require('commander');

commander
.version('1.0')
;


function ProcessCommand(argv)
{
    var c = commander.command('redismgmt')
    .version('1.0')
    .option('-d, --del <string>', 'key to delete')
    .option('-f, --fetch <string>', 'key to get values')
    .option('-k, --keys <string>', 'get keys')
    .option('-v, --value <path>', 'value to add')
    .option('-w, --write <path>', 'write to file')
    .option('-r, --read <path>', 'read from file converting to lowercase to redis')
    .option('-R, --READ <path>', 'read from file to redis')
    //.option('-?, --help', '')
    .option('-q, --quit', '')
    .option('-e, --exit', '');
    var fValidCommand = false;



    var r = c.parse(argv);

    if(r.help)
    {
        r.outputHelp();
    }
    if(r.write)
    {
        var os = fs.openSync(r.write, "w");
        fs.closeSync(os);
    }

    if(r.del)
    {
        //redisclient.AddRef();
        redisclient.keys(r.del, function(err, res)
        {
            for(var i in res)
            {
                //redisclient.AddRef();
                redisclient.del(res[i], function(err1, res1){
                    console.log("delete response"+res1);
                    //redisclient.ReleaseRef();
                    ReadCommand();
                });
            }
            console.log("deleted "+res.length+" keys");
            //redisclient.ReleaseRef();
            redisclient.quit();
        });
        fValidCommand = true;
    }

    if(r.fetch)
    {
        if(r.value)
        {
            //redisclient.AddRef();
            console.log("f="+r.fetch+" v="+r.value);
            redisclient.set(r.fetch, r.value, function(err, res)
            {
            console.log(JSON.stringify(res));
            //redisclient.ReleaseRef();
            ReadCommand();
            });
        }
        else
        {
            debugger;
            //redisclient.AddRef();
            //r.fetch += '*';
            redisclient.keys(r.fetch, function(err, res)
            {
                if(err)
                    console.log(err.message);
                else
                {
                    //for(var i in res)
                    res.forEach(function(key)
                    {
                        //redisclient.AddRef();
                       redisclient.get(key, function(err1, value)
                        {
                            if(r.write)
                            {
                                fs.appendFileSync(r.write, key+'='+value+'\n', "utf8");
                            }
                            console.log(key+'='+value);
                            //redisclient.ReleaseRef();
                        });
                    });
                   console.log("Fetched "+res.length+" keys");
                    //redisclient.ReleaseRef();
                }
                ReadCommand();
            });
        }
        fValidCommand = true;
    }
    if(r.keys)
    {
            redisclient.keys(r.keys, function(err, res)
            {
                if(err)
                    console.log(err.message);
                else
                {
                    var iKey = 0;
                   res.forEach(function(key)
                    {
                       redisclient.get(key, function(err1, value)
                        {
                            if(r.write)
                            {
                                fs.appendFileSync(r.write, key+'='+value+'\n', "utf8");
                            }
                            iKey++;
                            console.log(iKey+"="+key);
                        });
                    });
               }
                ReadCommand();
            });
        fValidCommand = true;
    }
    if(r.read || r.READ)
    {
        var rPath
        if(r.read)
            rPath = r.read;
        else
            rPath = r.READ;
       var data = fs.readFileSync(rPath, "utf8");
       data = data.replace(/\n+/g, "\n");
       arData = data.split("\n");
       var ifecalls = 0;
       arData.forEach(function(line)
       {
            ifecalls++;
            if(line.length)
            {
                var nv = line.split("=");
                if(r.read)
                {
                    // convert key to lowercase.
                    nv[0] = nv[0].toLowerCase();
                }
                //console.log(nv[0]+'='+nv[1]);
               //
                redisclient.set(nv[0], nv[1], function(err, res)
                {
                    //console.log(JSON.stringify(res));
                    //redisclient.ReleaseRef();
                });
            }
            if(ifecalls >= arData.length)
            {
                ReadCommand();
            }
        });
        fValidCommand = true;
    }
    if(r.quit || r.exit)
    {
        redisclient.quit();
        process.exit(0);
    }
    if(!fValidCommand)
    {
       ReadCommand();
    }
}

function Main()
{
    ReadCommandNow();
    return;
    if (process.argv.length < 3)
    {
       ReadCommandNow();
    }
    else
    {
        ProcessCommand(process.argv);
    }
}
Main();


