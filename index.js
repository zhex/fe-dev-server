var path = require('path');
var fs = require('fs');
var express = require('express');
var cons = require('consolidate');
var assign = require('object-assign');
var Router = require('./libs/router');
var DataSet = require('./libs/dataset');

var defaultConfig = {
	basePath: path.resolve(__dirname, './example'),
	publicFolder: 'public',
	viewFolder: 'views',
	mockFolder: 'mocks',
	routeFile: 'routes.js'
};

var SYMBOL_MOCK = 'mock::';

function extendConfig(config) {
	config = assign(defaultConfig, config);
	config.viewFolder = path.resolve(config.basePath, config.viewFolder);
	config.mockFolder = path.resolve(config.basePath, config.mockFolder);
	config.publicFolder = path.resolve(config.basePath, config.publicFolder);
	config.routeFile = path.resolve(config.basePath, config.routeFile);
	return config;
}

var server = module.exports = function (config) {
	var app = express();
	var port = config.port || 3000;

	config = extendConfig(config || {});

	var router = new Router(config.routeFile);
	var ds = new DataSet(config.mockFolder);

	app.use(require('morgan')('dev'));
	app.use(express.static(config.publicFolder));

	app.engine('html', cons.ejs);
	app.engine('jade', cons.jade);
	app.engine('haml', cons.haml);

	app.set('view engine', 'html');
	app.set('views', config.viewFolder);


	app.all('/:pattern(*)', function (req, res) {
		var route = '/' + req.params.pattern;
		var match = router.search(route, req.method);
		var data;

		if (match) {
			if (path.extname(match) === '.json') {
				var folder = config.viewFolder
				if (match.indexOf(SYMBOL_MOCK) >= 0) {
					match = match.replace(SYMBOL_MOCK, '');
					folder = config.mockFolder;
				}
				data = require(path.resolve(folder, match));
				res.json(data);
			} else {
				data =ds.get(match);
				res.render(match, data);
			}
		} else {
			res.status(404).send('404 Error');
		}
	});

	app.listen(port, function () {
		console.log('FE Dev Server is listening on port ' + port);
	});

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
