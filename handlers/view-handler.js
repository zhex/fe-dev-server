var DataSet = require('../libs/dataset');

module.exports = function (req, res) {
	var match = req._fds.match;

	setTimeout(function () {
		res.render(match.file, req._fds.data, function (err, html) {
			if (req._fds.lrScript) {
				html = html.split('</body>');
				if (html.length === 1) {
					html = html[0] + req._fds.lrScript;
				} else {
					html = html.join(req._fds.lrScript + '</body>');
				}
			}
			res.send(html);
		});
	}, req._fds.delay);
};
