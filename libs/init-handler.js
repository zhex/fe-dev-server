var Router = require('./router');

module.exports = function (config) {
	var router = new Router(config.routeFile);

	return function (req, res, next) {
		var route = '/' + req.params.pattern;
		var match = router.search(route, req.method);

		if (match) {
			req._fds = {
				route: route,
				match: match,
				config: config
			};
			next();
		} else {
			res.status(404).send('404 Error');
		}
	};
};
