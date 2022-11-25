var { request } = require('gaxios');
var utils = require('../libs/utils');


module.exports = (req, res, next) => {
	var match = req._fds.match;

	if (match.searchType !== 'url') {
		return next();
	}

	var url =
		match.file +
		(match.params.pattern || '') +
		(req.query ? '?' + utils.serialize(req.query) : '');

	request({ url, method: req.method, responseType: 'stream' }).then((r) => r.data.pipe(res));
};
