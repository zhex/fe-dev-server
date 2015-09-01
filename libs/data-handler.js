var path = require('path');
var utils = require('./utils');
var DataSet = require('./dataset');

var SYMBOL_MOCK = 'mock::';

module.exports = function (req, res, next) {
	var config = req._fds.config;
	var match = req._fds.match;

	if (utils.contains(['.json', '.js'], path.extname(match))) {
		var isViewFolder = true;

		if (match.indexOf(SYMBOL_MOCK) >= 0) {
			match = match.replace(SYMBOL_MOCK, '');
			isViewFolder = false;
		}

		var ds = new DataSet(isViewFolder ? config.viewFolder : config.mockFolder);
		var data = ds.get(match, req.query);

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
