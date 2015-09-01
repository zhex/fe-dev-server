var path = require('path');
var request = require('request');
var utils = require('./utils');
var DataSet = require('./dataset');

module.exports = function (req, res, next) {
	var config = req._fds.config;
	var match = req._fds.match;

	if (utils.contains(['.jsp', '.vm'], path.extname(match))) {
		var ds = new DataSet(config.mockFolder);
		var data = ds.get(match, req.query);

		var formData = {
			template: match.slice(0, 1) === '/' ? match : '/' + match,
			data: JSON.stringify(data)
		};
		var url = 'http://localhost:' + config.javaServerPort + '/render?' + utils.serialize(req.query);

		request.post(url, {form: formData}, function (err, response, body) {
			res.writeHead(response.statusCode, {'Content-Type': 'text/html'});
			res.write(body);
			res.end();
		});
	} else {
		next();
	}
};
