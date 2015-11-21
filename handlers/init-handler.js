var Router = require('../libs/router');
var path = require('path');
var fs = require('fs');

module.exports = function (config) {
	var router = new Router(config.routeFile);

	return function (req, res, next) {
		var route = '/' + req.params.pattern;
		var match = router.search(route, req.method);

		req._fds = {
			route: route,
			match: match,
			config: config,
			delay: 0,
			data: null
		};

		if (config.livereload) {
			req._fds.lrScript = "<script>document.write('<script src=\"http://' + (location.host || 'localhost').split(':')[0] + ':" + 35729 + "/livereload.js\"></' + 'script>')</script>";
		}

		try {
			if (!match)
				throw new Error('No route defined in: ' + config.routeFile);

			if (match.searchType !== 'url') {
				var filePath = match.searchType === 'mock' ? config.mockFolder : config.viewFolder;
				file = path.resolve(filePath, match.file);

				if (!fs.existsSync(file))
					throw new Error('Template file: ' + file + ' is not found');
			}

			next();
		} catch(e) {
			req._err = 404;
			next(e);
		}
	};
};
