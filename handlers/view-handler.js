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

	if (data.$$header) {
		Object.keys(data.$$header).forEach(function (key) {
			res.setHeader(key, data.$$header[key]);
		});
		delete data['$$header'];
	}

	res.render(match.file, data);
};
