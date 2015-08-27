var path = require('path');
var fs = require('fs');
var url = require('url');
var express = require('express');
var cons = require('consolidate');
var assign = require('object-assign');
var proxy = require('proxy-middleware');
var utils = require('./libs/utils');
var spawn = require('child_process').spawn;

var defaultConfig = {
	basePath: path.resolve(__dirname, './example'),
	publicFolder: 'public',
	viewFolder: 'views',
	mockFolder: 'mocks',
	routeFile: 'routes.js',
	proxy: null,
	port: 3000
};

function extendConfig(config) {
	config = assign({}, defaultConfig, config);
	config.viewFolder = path.resolve(config.basePath, config.viewFolder);
	config.mockFolder = path.resolve(config.basePath, config.mockFolder);
	config.publicFolder = path.resolve(config.basePath, config.publicFolder);
	config.routeFile = path.resolve(config.basePath, config.routeFile);
	return config;
}

var server = module.exports = function (config) {
	config = extendConfig(config || {});

	var app = express();

	app.use(require('morgan')('dev'));
	app.use(express.static(config.publicFolder));

	app.engine('html', cons.ejs);
	app.engine('jade', cons.jade);
	app.engine('hbs', cons.handlebars);

	app.set('view engine', 'html');
	app.set('views', config.viewFolder);

	if (config.proxy && utils.isObject(config.proxy)) {
		Object.keys(config.proxy).forEach(function (k) {
			app.use(k, proxy(url.parse(config.proxy[k])));
		});
	}

	app.all('/:pattern(*)', require('./libs/route-handler')(config));

	app.listen(config.port, function () {
		console.log('FE Dev Server is listening on port ' + config.port);
	});


	var jarPath = path.resolve(__dirname, './jetty/server.jar');
	var args = [
		'-Dviewpath=' + config.viewFolder,
		'-jar', jarPath
	];

	var jserver = spawn('java', args, {cwd: __dirname, detached: true});

	jserver.stdout.on('data', function (data) {
	  console.log('' + data);
	});

	// jserver.stderr.on("data", function (data) {
 //    	console.log(data.toString());
	// });

	jserver.on('error', function(err) {
        try { process.kill(jserver.pid, 'SIGKILL'); } catch(e) {}
        console.error(err);
    });

    jserver.unref();

	return app;
};


function init() {
	var configFile = path.resolve('fds-config.js');
	var config = fs.existsSync(configFile) ? require(configFile) : {};
	server(config);
}

if (require.main === module) {
	init();
}
