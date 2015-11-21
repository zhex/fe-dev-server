var request = require('request');

module.exports = function (req, res, next) {
	var match = req._fds.match;

	if (match.searchType !== 'url') {
		return next();
	}
	req.pipe(request(match.file)).pipe(res);
};
