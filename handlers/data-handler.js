var path = require('path');
var utils = require('../libs/utils');
var DataSet = require('../libs/dataset');

module.exports = function (req, res, next) {
	var config = req._fds.config;
	var match = req._fds.match;

	if (utils.contains(['.json', '.js'], path.extname(match.file))) {
		var ds = new DataSet(match.searchType === 'view' ? config.viewFolder : config.mockFolder);
		var data = ds.get(match.file, req.query);

		if (req.query.callback) {
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Access-Control-Allow-Methods', '*');
			res.jsonp(data);
		} else {
			res.json(data);
		}
	} else {
		next();
	}
};
