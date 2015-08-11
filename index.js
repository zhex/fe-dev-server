var express = require('express');
var Router = require('./libs/router');


module.exports = function (config) {
	var app = express();
	var port = config.port || 3000;

	var router = new Router(config.routes);

	app.use(require('morgan')('dev'));
	app.set('views', config.viewPath);

	app.all('/:pattern(*)', function (req, res) {
		var route = '/' + req.params.pattern;
		var url = router.search(route, req.method);

		if (url) {

		} else {
			res.status(404).end();
		}
	});

	app.listen(port, function () {
		console.log('FE Dev Server is listening on port ' + port);
	});

	return app;
};
