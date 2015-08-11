var path = require('path');
var express = require('express');
var cons = require('consolidate');
var assign = require('object-assign');
var Router = require('./libs/router');

var defaultConfig = {
	basePath: './example',
	viewFolder: 'views',
	mockFolder: 'mocks',
	routeFile: 'routes.js'
};

function extendConfig(config) {
	config = assign(defaultConfig, config);
	config.viewFolder = path.resolve(config.basePath, config.viewFolder);
	config.mockFolder = path.resolve(config.basePath, config.mockFolder);
	config.routeFile = path.resolve(config.basePath, config.routeFile);
	return config;
}

var server = module.exports = function (config) {
	var app = express();
	var port = config.port || 3000;

	config = extendConfig(config);
	var router = new Router(config.routeFile);

	app.use(require('morgan')('dev'));

	app.engine('html', cons.ejs);
	app.engine('jade', cons.jade);
	app.engine('haml', cons.haml);

	app.set('view engine', 'html');
	app.set('views', config.viewFolder);

	app.all('/:pattern(*)', function (req, res) {
		var route = '/' + req.params.pattern;
		var match = router.search(route, req.method);

		if (match) {
			res.render(match);
		} else {
			res.status(404).send('404 Error');
		}
	});

	app.listen(port, function () {
		console.log('FE Dev Server is listening on port ' + port);
	});

	return app;
};

server({});
