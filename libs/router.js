var fs = require('fs');
var pathRegexp = require('path-to-regexp');

var SYMBOL_MOCK = 'mock::';

function Router(routeFile) {
	this.routes = [];
	this.loadRoutes(routeFile);
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

	this.routes.some(function (r) {
		var re = pathRegexp(r.route);
		var result = re.exec(url);

		if (result && r.method.toLowerCase() === method.toLowerCase()) {
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
		if (match.indexOf(SYMBOL_MOCK) >= 0) {
			match = match.replace(SYMBOL_MOCK, '');
			type = 'mock';
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

