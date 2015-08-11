# FE Dev Server

This is a dev server for frontend developers to create template, style and js easily.

The server is built on `express` and `nodemon`, so it will restart automatically when your file changes.

## How to run

```
# install module globally
npm install -g fe-dev-server

# create project folder and get into the folder
mkdir workdir && cd workdir

# initial the project folder
fds init

# start up server
fds
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

Allowed method: `GET`, `POST`, `PUT`, `PATCH`, `DETELE`, `GET` will be used if it is not specified.

If you want to setup an ajax api url, you can set the template to a json file. The server will look for the json file in view folder and send back it as a json object. the data in the view folder sounds not make sense. So if you want put the json file in the mock folder, then you can add a `mock::` prefix in the template path, then the server will look for the file in mock folder.


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
