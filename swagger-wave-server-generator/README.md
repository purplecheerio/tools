# tools


[swagger-wave-server-generator](#swagger-wave)


<a id="swagger-wave">

# swagger-wave-server-generator

- Takes the open API 3.0 JSON for swagger.io and generates the Server side code stubs.

<a id="installation">

# Installation

```
npm install -g swagger-wave-server-generator

```
<a id="Running">

# Generate the Code Stubs

Download the JSON  OpenAPI 3.0 version of your project definition from the Swagger Website. The file downloaded may have the name.
```
openapi_petstore.json

```
Copy this file into the project directory where you want to create and run this project.

```
swagger-wave-server-generator openapi_petstore.json

```
<a id="Using the webconsole">

# Using

On a web browser on this machine

```
http://localhost:9999/documentation

or 

http://localhost:9999/test

```



The sourcecode for this project is available at  <a href="http://www.github.com/purplecheerio/tools">Github  Project</a>

The work is powered by npm package <a href="https://www.npmjs.com/package/purplecheerio-wave">Purplecheerio-wave</a>



