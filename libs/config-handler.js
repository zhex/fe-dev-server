var path = require('path');
var fs = require('fs');
var assign = require('object-assign');

var defaultConfig = {
	basePath: path.resolve(__dirname, '../example'),
	publicFolder: 'public',
	viewFolder: 'views',
	mockFolder: 'mocks',
	routeFile: 'routes.js',
	proxy: null,
	port: 3000,
	javaServerPort: 12321
};

function extendConfig(config) {
	config = assign({}, defaultConfig, config);
	config.viewFolder = path.resolve(config.basePath, config.viewFolder);
	config.mockFolder = path.resolve(config.basePath, config.mockFolder);
	config.publicFolder = path.resolve(config.basePath, config.publicFolder);
	config.routeFile = path.resolve(config.basePath, config.routeFile);
	return config;
}

module.exports = function (configFile) {
	var config = fs.existsSync(configFile) ? require(configFile) : {};
	return extendConfig(config);
};
