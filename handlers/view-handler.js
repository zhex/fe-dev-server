var DataSet = require('../libs/dataset');

module.exports = function (req, res) {
	var config = req._fds.config;
	var match = req._fds.match;

	var ds = new DataSet(config.mockFolder);
	var data = {
		params: match.params,
		query: req.query
	};
	data = ds.get(match.file, data);

	res.render(match.file, data);
};
