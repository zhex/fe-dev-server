# FE Dev Server

FE Dev Server target to help frontend web developers create view template, styles and js easily. It try the best to simulate real server environment which can help you to make you job done. 

## Features

1. Various template engines and view data is allowed by just adding a simple json file.
2. Simulate urls and then you don't need to change your page urls when you merge your code into backend server.
3. Mock data can be provided with a simple json file.
4. Auto restart the server if any configuration changed.

The server is built on `express` and `nodemon`, so it will restart automatically when your file changes.

## How to run

Install it as a command line tool with the following step.


** Install module globally **

```
$ npm install -g fe-dev-server
```

** create project folder and get into the folder **

```
$ mkdir workdir && cd workdir
```

** initial the project folder **

```
$ fds init
```

** start up server **

```
$ fds
```

Also, it can be integrated into your own project as a node module.

```js
var fds = require('fe-dev-server');

fds({
	basePath: __dirname,
	mockFolder: 'data',
	port: 8001	
});
```

## Routes

Routes is stored in `routes.js` as key/value pairs by default.

Sample:

```js
module.exports = {
	'/test':         		'test.html',
	'GET::/books':   		'books.jade',
	'POST::/api/books':  	'mock::books.json'
};
```
the rule is `'[method]::[route_url]': '[template_file]'`.

Allowed method: `GET`, `POST`, `PUT`, `PATCH`, `DETELE`

`GET` will be used if it is not specified.

If you want to setup an ajax api url, you can set the template to a json file. The server will look for the json file in view folder and send back it as a json object. the data in the view folder sounds not make sense. So if you want put the json file in the mock folder, then you can add a `mock::` prefix in the template path, then the server will look for the file in mock folder.

## embedded template engines

- jade
- haml
- ejs


## Configuration

You can custom your configuration in `fds-config.js` file.

### basePath

The base path of the project, all other folder settings are related to base path.

### viewFolder

default: 'views'

Where you can put your view template files.

### mockFolder

default: 'mocks'

Save you mock data into this folder. each view template will have a matched json data file will be loaded automatcially. 

For example: we have a `${viewFolder}/projects/index.html` template, then data in `${viewFolder}/projects/index.json` file will be auto loaded into the template.

### publicFolder

default: 'public'

Where you can put your image, style and js files here. This folder is set by `express.static()`

### routeFile

default: 'routes.js'

routes mapping file

### port

default: 3000

express server port
