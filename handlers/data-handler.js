var path = require('path');
var utils = require('../libs/utils');
var DataSet = require('../libs/dataset');

module.exports = function (req, res, next) {
	var config = req._fds.config;
	var match = req._fds.match;

	if (!utils.contains(config.mockExts, path.extname(match.file)))
		return next();

	var ds = new DataSet(
		match.searchType === 'view' ? config.viewFolder : config.mockFolder,
		config.mockExts
	);
	var data = ds.get(match.file, {
		params: match.params,
		query: req.query
	});

	if (data.$$header) {
		Object.keys(data.$$header).forEach(function (key) {
			res.setHeader(key, data.$$header[key]);
		});
		delete data['$$header'];
	}

	var delay = 0;
	if (data.$$delay >= 0) {
		delay = data.$$delay;
		delete data['$$delay'];
	}

	setTimeout(function () {
		if (req.query.callback) {
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Access-Control-Allow-Methods', '*');
			res.jsonp(data);
		} else {
			res.json(data);
		}
	}, delay);
};
