var path = require('path');
var fs = require('fs');
var assign = require('object-assign');

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
	javaServerPort: 12321,
	livereload: true,
	open: {
		route: '/',
		browser: ['google chrome']
	}
};

function extendConfig(config) {
	config = assign({}, defaultConfig, config);
	config.basePath = path.resolve(config.basePath);
	config.viewFolder = path.resolve(config.basePath, config.viewFolder);
	config.mockFolder = path.resolve(config.basePath, config.mockFolder);
	config.publicFolder = path.resolve(config.basePath, config.publicFolder);
	config.routeFile = path.resolve(config.basePath, config.routeFile);
	return config;
}

module.exports = function (config, force) {
	if (typeof config === 'string') {
		if (force) delete require.cache[config];
		config = fs.existsSync(config) ? require(config) : {};
	}
	return extendConfig(config);
};
