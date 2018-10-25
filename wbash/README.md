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
You will see a warning 'Your connection is not private' because the default certificates supplied with wbash are self-signed. These certificates are located in wbash/security directory. Replace the default certificates with your company owned certificates to eliminate the error.

If accessing this web console from a remote machine

- make sure that the port  8888 is open for access

```
https://`<machinename>`:8888/

```


The sourcecode for this project is available at  <a href="http://www.github.com/purplecheerio/tools">Github Wbash Project</a>

The work is powered by npm package <a href="https://www.npmjs.com/package/purplecheerio-wave">Purplecheerio-wave</a>



