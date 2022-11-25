var path = require('path');
var fs = require('fs');
var assign = require('object-assign');
var portscanner = require('portscanner');
var deasync = require('deasync');

var defaultJavaPort = 12321;
var defaultLivereloadPort = 35729;

var defaultConfig = {
	basePath: path.resolve(__dirname, '../example'),
	publicFolder: 'public',
	viewFolder: 'views',
	mockFolder: 'mocks',
	routeFile: 'routes.js',
	mockExts: ['.js', '.json'],
	proxy: null,
	port: 3000,
	enableJava: true,
	// javaServerPort: 12321,
	livereload: true,
	open: {
		route: '/',
		browser: ['google chrome']
	}
};

var findAPortNotInUse = deasync(portscanner.findAPortNotInUse);

function findPort(port) {
	return findAPortNotInUse(port, port + 1000, '127.0.0.1');
}

function extendConfig(config) {
	config = assign({}, defaultConfig, config);
	config.basePath = path.resolve(config.basePath);
	config.viewFolder = path.resolve(config.basePath, config.viewFolder);
	config.mockFolder = path.resolve(config.basePath, config.mockFolder);
	config.publicFolder = path.resolve(config.basePath, config.publicFolder);
	config.routeFile = path.resolve(config.basePath, config.routeFile);

	if (config.enableJava) {
		config.javaServerPort = findPort(defaultJavaPort);
	}

	if (config.livereload) {
		config.livereloadPort = findPort(defaultLivereloadPort);
	}
	return config;
}

module.exports = function (config, force) {
	if (typeof config === 'string') {
		if (force) delete require.cache[config];
		config = fs.existsSync(config) ? require(config) : {};
	}

	if (config.javaServerPort) {
		console.warn('WARN: config.javaServerPort is deprecated; please remove it in your fds-config.js file!'.yellow);
	}

	if (config.proxy) {
		console.warn('WARN: config.proxy is deprecated; please set proxy route in file routes.js'.yellow);
	}

	return extendConfig(config);
};
