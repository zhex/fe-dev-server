# FE Dev Server ![build status](https://travis-ci.org/zhex/fe-dev-server.svg)

FE Dev Server target to help frontend web developers create view template, styles and js easily. It try the best to simulate real server environment which can help you to make you job done. 

## Features

1. Various template engines and embedded page data.
2. Url simulation
3. Mock data in file
4. Proxy configuration

## Quick start

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

start up server & open browser

```
$ fds -o
```

Also, it can be integrated into your own project as a node module.

```js
var fds = require('fe-dev-server');

var app = fds({
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
    // set /test route to test.html page, default http method is GET
    '/test':                    'test.html',
    
    // set /books route to books.pug template with GET method
    'GET::/books':              'books.pug',
    
    // set json api with a json file in mock folder
    'POST::/api/books':         'mock::books.json',
    
    // mock file can also be a js file, which has more power to do the customization
    'GET::/api/category':       'mock::category.js',

    // fds works with java template such as jsp;
    // before do this, you have to set enableJava to true in your fds-config.js file
    '/jsp-page':                'books.jsp',
    
    // it allow your route to proxy an online page
    '/proxy-api':               'http://www.github.com/zhex.json',
    
    // proxy can do fuzzy mapping;
    // in the setting, if you visit /books/hello, it will map to http://example.com/books/hello
    'ALL::/books/:pattern*':    'http://example.com/books/'
};
```
the rule is `'[method]::[route_url]': '[template_file]'`.

Allowed method: `GET`, `POST`, `PUT`, `PATCH`, `DETELE`

`GET` will be used if it is not specified.

If you want to setup an ajax api url, you can set the template to a json file. The server will look for the json/js file in view folder and send back it as a json object. the data in the view folder sounds not make sense. So if you want put the json/js file in the mock folder, then you can add a `mock::` prefix in the template path, then the server will look for the file in mock folder.

If the mock file is a js file, then it is good to define as a module function:

```js
module.exports = function (data, utils) {
    return {
        id: data.params.id,
        name: data.query.name || 'hello world',
        content: data.body.content
    };
};
```
The `data.params` is the match variable collection in the particular route; The `data.query` is the query data from request url, so you can easily test your page with different api return.

`utils` provide some easy to use method to handle the data.

available method:

- utils.isObject(obj)
- utils.isArray(obj)
- utils.isFunc(obj)
- utils.contains(array, item)
- utils.serialize(obj)
- utils.assign() - which is [object-assign](https://www.npmjs.com/package/object-assign) library
- utils.moment() - which is [moment](http://momentjs.com/) library
- utils.Mock - which is [mockjs](http://mockjs.com) library

Also, you can add `$$header` in the data file to extend http response header, and using `$$delay` to set simulate the http connection delay.

```js
{
    "$$header": {
        "x-access-token": "abcs"
    },
    "$$delay": 3000,
    "title": "hello world"
}

```

## embedded template engines

- [pug](https://pugjs.org/api/getting-started.html)
- [handlebars](http://handlebarsjs.com/)
- [ejs](http://www.embeddedjs.com/)
- [jsp](https://en.wikipedia.org/wiki/JavaServer_Pages) (java)
- [velocity](http://velocity.apache.org/) (java)


## Configuration

You can custom your configuration in `fds-config.js` file.

```js
defaultConfig = {
    basePath: path.resolve(__dirname, './example'),
    publicFolder: 'public',
    viewFolder: 'views',
    mockFolder: 'mocks',
    routeFile: 'routes.js',
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

Routes mapping file

### mockExts

default: ['.js', '.json']

Some people like to set mockFolder as the same as viewFolder for convinence reason, `mockExts` give you the ability to define your own mock file type to avoid the conflict issue. Also, the ext order in array demonstrate the priority from higher to lower.

### proxy (Deprecated, using router proxy instead)

default: null

During the test, we want to get the api data from the real backend server; then we can proxy the url to the backend server. And multiple proxies are allowed.

```js
proxy: {
    '/api': 'http://www.example.com/api'
}
```

### port

default: 3000

Express server port

### enableJava

default: true

Sometimes you don't need to support java templates, you can turn it off with this property to `false`.

### javaServerPort (Deprecated, port will be auto generated)

default: 12321

FE server will run a child process for light java server to serve the templates in java, you can change the java server port if it is conflict with your other service.

### livereload

default: true

livereload is awesome, it will refresh your browser automatically after anything changed. If you dont like this feature, you can set it to `false` to switch it off. also you can set it as a **livereload option object**;

### open

default: { route: '/', browser: ['google chrome'] }

Browser setting allow you to open dev site automatically on server started with `-o` option in cli. It will open google chrome by default. 

```
$ fds server -o
```

## License

This project is licensed under the terms of the MIT license.
