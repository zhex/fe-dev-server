var DataSet = require('./dataset');

module.exports = function (req, res) {
	var config = req._fds.config;
	var match = req._fds.match;

	var ds = new DataSet(config.mockFolder);
	var data = ds.get(match.file, req.query);

	res.render(match.file, data);
};
