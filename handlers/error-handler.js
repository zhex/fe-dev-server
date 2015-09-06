var cons = require('consolidate');
var path = require('path');

module.exports = function (err, req, res, next) {
	var tpl = path.resolve(__dirname, '../views/error.hbs');
	var data = {
		error: err,
		route: req._fds.route,
		method: req.method,
		query: req.query,
		match: req._fds.match,
		config: req._fds.config
	};

	cons.handlebars(tpl, data, function (err, html) {
		res.status(req._err).send(html);
	});
};
