var DataSet = require('../libs/dataset');
var lrScript = require('../libs/lr-script');

module.exports = function (req, res) {
	var match = req._fds.match;
	var config = req._fds.config;

	setTimeout(function () {
		res.render(match.file, req._fds.data, function (err, html) {
			if (config.livereload) {
				html = lrScript.getInjectHtml(html);
			}
			res.send(html);
		});
	}, req._fds.delay);
};
