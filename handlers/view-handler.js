var DataSet = require('../libs/dataset');

module.exports = function (req, res) {
	var match = req._fds.match;

	setTimeout(function () {
		res.render(match.file, req._fds.data);
	}, req._fds.delay);
};
