var cons = require('consolidate');
var path = require('path');

module.exports = function (err, req, res, next) {
	if (req._err !== 404) return next(err);

	var tpl = path.resolve(__dirname, '../views/404.hbs');

	var data = {
		error: err,
		config: req._fds.config,
		route: req._fds.route,
		method: req.method,
		query: req.query,
		match: req._fds.match
	};

	cons.handlebars(tpl, data, function (err, html) {
		res.status(404).send(html);
	});
};
