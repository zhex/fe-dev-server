var fs = require('fs');
var pathRegexp = require('path-to-regexp');
var chokidar = require('chokidar');

var SYMBOL_MOCK = 'mock::';

function Router(routeFile) {
	this.routes = [];
	this.loadRoutes(routeFile);

	chokidar.watch(routeFile).on('change', function () {
		delete require.cache[routeFile];
		this.routes = [];
		this.loadRoutes(routeFile);
	}.bind(this));
}

Router.prototype.loadRoutes = function (routeFile) {
	var mapping = require(routeFile);
	Object.keys(mapping).forEach(function (key) {
		var tmp = key.split('::');
		if (tmp.length < 2) {
			tmp[1] = tmp[0];
			tmp[0] = 'GET';
		}
		tmp[1] = (tmp[1].slice(0, 1) === '/') ? tmp[1] : '/' + tmp[1];

		this.routes.push({
			method: tmp[0],
			route: tmp[1],
			file: mapping[key]
		});
	}.bind(this));
};

Router.prototype.search = function (url, method) {
	var match = null;
	var params = {};

	method = method.toLowerCase();

	this.routes.some(function (r) {
		var re = pathRegexp(r.route);
		var result = re.exec(url);

		if (result && (r.method.toLowerCase() === 'all' || r.method.toLowerCase() === method)) {
			match = r.file;
			if (match.slice(0, 1) === '/') match = match.slice(1);

			// find keys in routes and create params object
			var keys = r.route.match(/:\w+/g);
			if (keys) {
				result.shift();
				keys.forEach(function (key, idx) {
					params[key.slice(1)] = result[idx];
				});
			}
			return true;
		}
	});

	if (match) {
		var type = 'view';
		var urlExp = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;

		if (match.indexOf(SYMBOL_MOCK) >= 0) {
			match = match.replace(SYMBOL_MOCK, '');
			if (match.slice(0, 1) === '/') match = match.slice(1);
			type = 'mock';
		} else if (urlExp.test(match)) {
			type = 'url';
		}
		return {
			file: match,
			searchType: type,
			params: params
		};
	}

	return match;
};

module.exports = Router;

