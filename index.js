var path = require('path');
var url = require('url');
var express = require('express');
var cons = require('consolidate');
var proxy = require('proxy-middleware');
var configHandler = require('./libs/config-handler');
var utils = require('./libs/utils');

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

	app.all('/:pattern(*)', require('./libs/route-handler')(config));

	app.listen(config.port, function () {
		console.log('FE Dev Server is listening on port ' + config.port);
	});

	return app;
};


function init() {
	var configFile = path.resolve('fds-config.js');
	server(config);
}

if (require.main === module) {
	init();
}
