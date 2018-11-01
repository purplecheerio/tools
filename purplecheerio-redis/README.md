# tools


[PuprleCheerio-Redis](#purplecheerio-redis)


<a id="purplecheerio-redis">

# PuprleCheerio-Redis
- Interactive web console for redis database

<a id="installation">

# Installation

```
npm install -g purplecheerio-redis

```
<a id="Running">

# Running the webconsole

```
purplecheerio-redis

```
<a id="Using the webconsole">

# Using

On a web browser on this machine

```
https://localhost:8889/

```
You will see a warning 'Your connection is not private' because the default certificates supplied with purplecheerio-redis are self-signed. You should configure purplecheerio-redis to use the certificates you own by using the -c command explained below, for production use

- make sure that the port  8888 is open for access

```
https://`<machinename>`:8889/

```
# Customization
There various config values that you can modify.
purplecheerio-redis -h will list out the options available
| Command     | Description |
| ----------- | ----------- |
| purplecheerio-redis      | without any command line arguments runs the webconsole       |
| purplecheerio-redis -l   | lists all the properties of the purplecheerio-redis service config        |
| purplecheerio-redis -c \<certpath>   | When using this in production, you may want to get and use your own certificate and key files. If you specify the path to where the certificate is found. Note the path should include the name of file name of the .crt and .key without extension       |
| purplecheerio-redis -p \<port>   | If you want to use a different port from the default port 8888, you can use this        |
| purplecheerio-redis -r \<protocol>   | This option takes only two values - https or http. It's not advisable to set this to http.      |
| purplecheerio-redis -n \<hostname>   | If you are using a hostname differnt from localhost, use this to set the hostname        |
| purplecheerio-redis -d   | sets the config to default values        |


 

# About
The sourcecode for this project is available at  <a href="http://www.github.com/purplecheerio/purlecheerio-redis">Github purplecheerio-redis Project</a>

The work is powered by npm package <a href="https://www.npmjs.com/package/purplecheerio-wave">Purplecheerio-wave</a>



