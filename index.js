var path = require('path');
var fs = require('fs');
var url = require('url');
var express = require('express');
var cons = require('consolidate');
var assign = require('object-assign');
var proxy = require('proxy-middleware');
var Router = require('./libs/router');
var DataSet = require('./libs/dataset');
var utils = require('./libs/utils');

var defaultConfig = {
	basePath: path.resolve(__dirname, './example'),
	publicFolder: 'public',
	viewFolder: 'views',
	mockFolder: 'mocks',
	routeFile: 'routes.js',
	proxy: null,
	port: 3000
};

var SYMBOL_MOCK = 'mock::';

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

	var router = new Router(config.routeFile);
	var ds = new DataSet(config.mockFolder);

	var app = express();

	app.use(require('morgan')('dev'));
	app.use(express.static(config.publicFolder));

	app.engine('html', cons.ejs);
	app.engine('jade', cons.jade);
	app.engine('haml', cons.haml);

	app.set('view engine', 'html');
	app.set('views', config.viewFolder);

	if (config.proxy && utils.isObject(config.proxy)) {
		Object.keys(config.proxy).forEach(function (k) {
			app.use(k, proxy(url.parse(config.proxy[k])));
		});
	}

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
				data = ds.get(match);
				res.render(match, data);
			}
		} else {
			res.status(404).send('404 Error');
		}
	});

	app.listen(config.port, function () {
		console.log('FE Dev Server is listening on port ' + config.port);
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
