var path = require('path');
var url = require('url');
var express = require('express');
var cons = require('consolidate');
var colors = require('colors');
var proxy = require('proxy-middleware');
var configHandler = require('./libs/config-handler');
var utils = require('./libs/utils');
var JavaServer = require('./libs/java-server');
var findup = require('findup-sync');

require('./libs/handlebars-helper');

var isMain = false;

var server = module.exports = function (config) {
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

	if (!isMain && config.enableJava) {
		JavaServer.create(config);
	}

	app.config = config;
	app.JavaServer = JavaServer;

	app.listen(config.port, function () {
		console.log('FE Dev Server is listening on port '.green + config.port.toString().green);
	});

	process.on('uncaughtException', function(err) {
	    if(err.errno === 'EADDRINUSE')
	        console.log(('FE Dev Server:  Port ' + config.port + ' is already in use.').red);
	    else
	        console.log(err);
	});

	return app;
};


function init() {
	var config = findup('fds-config.js');
	server(config);
}

if (require.main === module) {
	isMain = true;
	init();
}
