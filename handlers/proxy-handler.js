var request = require('request');
var utils = require('../libs/utils');

module.exports = function (req, res, next) {
	var match = req._fds.match;

	if (match.searchType !== 'url') {
		return next();
	}
	var url = match.file + (req.query ?  '?' + utils.serialize(req.query) : '');
	req.pipe(request(url)).pipe(res);
};
