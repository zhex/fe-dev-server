var Router = require('../libs/router');
var cons = require('consolidate');
var path = require('path');
var fs = require('fs');

module.exports = function (config) {
	var router = new Router(config.routeFile);

	return function (req, res, next) {
		var route = '/' + req.params.pattern;
		var match = router.search(route, req.method);

		try {
			if (!match)
				throw new Error('No route defined in: ' + config.routeFile);

			var  filePath= match.searchType === 'mock' ? config.mockFolder : config.viewFolder;
			file = path.resolve(filePath, match.file);
			if (!fs.existsSync(file))
				throw new Error('Template file: ' + file + ' is not found');

			req._fds = {
				route: route,
				match: match,
				config: config
			};
			next();

		} catch(e) {
			var tpl = path.resolve(__dirname, '../views/404.hbs');
			var data = {
				error: e,
				config: config,
				route: route,
				method: req.method,
				query: req.query,
				match: match
			};
			cons.handlebars(tpl, data, function (err, html) {
				res.status(404).send(html);
			});
		}
	};
};
