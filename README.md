# FE Dev Server ![build status](https://travis-ci.org/zhex/fe-dev-server.svg)

FE Dev Server target to help frontend web developers create view template, styles and js easily. It try the best to simulate real server environment which can help you to make you job done. 

## Features

1. Various template engines and embedded page data.
2. Url simulation
3. Mock data in file
4. Websocket
5. Proxy configuration

## How to run

Install it as a command line tool with the following step:


Install module globally

```
$ npm install -g fe-dev-server
```

create project folder and get into the folder

```
$ mkdir workdir && cd workdir
```

initial the project folder

```
$ fds init
```

start up server

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
	'POST::/api/books':  	'mock::books.json',
	'GET::/api/category':  	'mock::category.js'
};
```
the rule is `'[method]::[route_url]': '[template_file]'`.

Allowed method: `GET`, `POST`, `PUT`, `PATCH`, `DETELE`

`GET` will be used if it is not specified.

If you want to setup an ajax api url, you can set the template to a json file. The server will look for the json/js file in view folder and send back it as a json object. the data in the view folder sounds not make sense. So if you want put the json/js file in the mock folder, then you can add a `mock::` prefix in the template path, then the server will look for the file in mock folder.

If the mock file is a js file, then it is good to define as a module function:

```js
module.exports = function (params, utils) {
	return {
		name: params.name || 'hello world'
	};
};
```
The `params` is the query data from request url, so you can easily test your page with different api return.

`utils` provide some easy to use method to handle the data.

available method:

- utils.isObject(obj)
- utils.isArray(obj)
- utils.isFunc(obj)
- utils.contains(array, item)
- utils.assign() - which is [object-assign](https://www.npmjs.com/package/object-assign) library
- utils.moment() - which is [moment](http://momentjs.com/) library

## embedded template engines

- jade
- handlebars
- ejs


## Configuration

You can custom your configuration in `fds-config.js` file.

```js
defaultConfig = {
	basePath: path.resolve(__dirname, './example'),
	publicFolder: 'public',
	viewFolder: 'views',
	mockFolder: 'mocks',
	routeFile: 'routes.js',
	proxy: null,
	port: 3000
}
```

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


### proxy

default: null

During the test, we want to get the api data from the real backend server; then we can proxy the url to the backend server. And multiple proxies are allowed.

```js
proxy: {
	'/api': 'http://www.example.com/api'
}
```

### port

default: 3000

express server port

## Lisence

This projected is licensed under the terms of the MIT license.
