var path = require('path');
var url = require('url');
var express = require('express');
var cons = require('consolidate');
var colors = require('colors');
var proxy = require('proxy-middleware');
var open = require('opn');
var configHandler = require('./libs/config-handler');
var utils = require('./libs/utils');
var JavaServer = require('./libs/java-server');

require('./libs/handlebars-helper');

module.exports = function (config) {
	config = configHandler(config);

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

	app.all(
		'/:pattern(*)',
		require('./handlers/init-handler')(config),
		require('./handlers/data-handler'),
		require('./handlers/java-handler'),
		require('./handlers/view-handler'),
		require('./handlers/not-found-handler'),
		require('./handlers/error-handler')
	);

	app.config = config;
	app.javaServer = new JavaServer();

	if (config.enableJava) {
		app.javaServer.create(config);
	}

	app.openBrowser = function () {
		var url = 'http://localhost:' + config.port + (config.open.route || '/');
		open(url, { app: config.open.browser });
	};

	app.listen(config.port, function () {
		console.log('FE Dev Server is listening on port '.green + config.port.toString().green);
	});

	process.on('uncaughtException', function(err) {
	    if(err.errno === 'EADDRINUSE') {
	        console.log(('FE Dev Server:  Port ' + config.port + ' is already in use.').red);
	        process.exit(1);
	    } else
	        console.log(err);
	});

	process.on('SIGINT', function () {
		if (config.enableJava) app.javaServer.close();
		console.log('FE Dev Server is stopped.'.green);
		process.exit();
	});

	return app;
};
