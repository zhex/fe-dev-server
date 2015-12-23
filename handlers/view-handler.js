var DataSet = require('../libs/dataset');
var lrScript = require('../libs/lr-script');

module.exports = function (req, res, next) {
	var match = req._fds.match;
	var config = req._fds.config;

	res.render(match.file, req._fds.data, function (err, html) {
		if (err) return next(err);

		if (config.livereload) {
			html = lrScript.getInjectHtml(html);
		}

		setTimeout(function () {
			res.send(html);
		}, req._fds.delay);
	});

};
