# tools


[WBash - Web enabled bash terminal](#wbash)


<a id="wbash">

# WBash
- Web Console for most operating systems.

- Microsoft Windows : Runs the windows cmds.
- Unix and all Flavors of linux : Runs the bash shell
- Mac OS : Runs the bash shell.

<a id="installation">

# Installation

```
npm install -g wbash

```
<a id="Running">

# Running the webconsole

```
wbash

```
<a id="Using the webconsole">

# Using

On a web browser on this machine

```
https://localhost:8888/

```
You will see a warning 'Your connection is not private' because the default certificates supplied with wbash are self-signed. You should configure wbash to use the certificates you own by using the -c command explained below, for production use


If accessing this web console from a remote machine

- make sure that the port  8888 is open for access

```
https://`<machinename>`:8888/

```
# Customization
There various config values that you can modify.
wbash -h will list out the options available
| Command     | Description |
| ----------- | ----------- |
| wbash      | without any command line arguments runs the webconsole       |
| wbash -l   | lists all the properties of the wbash service config        |
| wbash -c \<certpath>   | When using this in production, you may want to get and use your own certificate and key files. If you specify the path to where the certificate is found. Note the path should include the name of file name of the .crt and .key without extension       |
| wbash -p \<port>   | If you want to use a different port from the default port 8888, you can use this        |
| wbash -r \<protocol>   | This option takes only two values - https or http. It's not advisable to set this to http.      |
| wbash -n \<hostname>   | If you are using a hostname differnt from localhost, use this to set the hostname        |
| wbash -d   | sets the config to default values        |


 

# About
The sourcecode for this project is available at  <a href="http://www.github.com/purplecheerio/wbash">Github Wbash Project</a>

The work is powered by npm package <a href="https://www.npmjs.com/package/purplecheerio-wave">Purplecheerio-wave</a>



