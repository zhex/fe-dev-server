var path = require('path');
var fs = require('fs');
var url = require('url');
var express = require('express');
var cons = require('consolidate');
var bodyParser = require('body-parser');
var colors = require('colors');
var proxy = require('proxy-middleware');
var open = require('opn');
var livereload = require('livereload');
var configHandler = require('./libs/config-handler');
var utils = require('./libs/utils');
var JavaServer = require('./libs/java-server');

require('./libs/handlebars-helper');

module.exports = function (config) {
	config = configHandler(config);

	var app = express();
	app.config = config;

	app.use(require('morgan')('dev'));

	app.engine('html', cons.ejs);
	app.engine('jade', cons.jade);
	app.engine('hbs', cons.handlebars);

	app.set('view engine', 'html');
	app.set('views', config.viewFolder);

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	// set proxy routes
	if (config.proxy && utils.isObject(config.proxy)) {
		Object.keys(config.proxy).forEach(function (k) {
			app.use(k, proxy(url.parse(config.proxy[k])));
		});
	}

	// serve reload server
	if (config.livereload) {
		app.use(
			require('./handlers/static-html-handler')(config),
			express.static(config.publicFolder)
		);

		var options = {
			exts: [ 'html', 'css', 'js', 'png', 'gif', 'jpg', 'json', 'jsp', 'vm' ],
			exclusions: [/node_modules/],
			port: config.livereloadPort
		};

		if (utils.isObject(config.livereload))
			options = utils.assign({}, options, config.livereload);

		var lrServer = livereload.createServer(options);

		lrServer.watch([
			config.viewFolder,
			config.mockFolder,
			config.publicFolder
		]);
	} else {
		app.use(express.static(config.publicFolder));
	}

	// route handle
	app.all(
		'/:pattern(*)',
		require('./handlers/init-handler')(config),
		require('./handlers/data-handler'),
		require('./handlers/proxy-handler'),
		require('./handlers/view-data-handler'),
		require('./handlers/java-handler'),
		require('./handlers/view-handler'),
		require('./handlers/not-found-handler'),
		require('./handlers/error-handler')
	);

	// launch java server in child process
	if (config.enableJava) {
		app.javaServer = new JavaServer();
		app.javaServer.create(config);
	}

	app.openBrowser = function () {
		var openMe = function () {
			var url = 'http://localhost:' + config.port + (config.open.route || '/');
			open(url, { app: config.open.browser });
		};

		if (config.enableJava) {
			app.javaServer.on('started', openMe);
		} else {
			openMe();
		}
	};

	app.listen(config.port, function () {
		console.log('FE Dev Server is listening on port '.green + config.port.toString().green);
	});

	process.on('uncaughtException', function(err) {
	    if(err.errno === 'EADDRINUSE') {
	        console.log(('FE Dev Server:  Port ' + err.port + ' is already in use.').red);
	        process.exit(1);
	    } else
	        console.log(err);
	});

	process.on('SIGINT', function () {
		console.log('FE Dev Server is stopped.'.green);
		process.exit();
	});

	process.on('exit', function () {
		if (config.enableJava) app.javaServer.close();
	});

	return app;
};
