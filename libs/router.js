var fs = require('fs');
var pathRegexp = require('path-to-regexp');

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
	var match = null, re;
	this.routes.some(function (r) {
		re = pathRegexp(r.route);
		if (re.exec(url) && r.method.toLowerCase() === method.toLowerCase()) {
			match = r.file;
			if (match.slice(0, 1) === '/') match = match.slice(1);
			return;
		}
	});
	return match;
};

module.exports = Router;

