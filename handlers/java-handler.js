var path = require('path');
var { request } = require('gaxios');
var utils = require('../libs/utils');
var lrScript = require('../libs/lr-script');

module.exports = function (req, res, next) {
	var config = req._fds.config;
	var match = req._fds.match;

	if (!utils.contains(['.jsp', '.vm'], path.extname(match.file))) return next();

	if (!config.enableJava) {
		req._err = 500;
		return next(new Error('Please enable Java support in your fds-config.js file.'));
	}

	var formData = {
		template: match.file.slice(0, 1) === '/' ? match.file : '/' + match.file,
		data: JSON.stringify(req._fds.data),
	};
	var url = 'http://localhost:' + config.javaServerPort + '/render?' + utils.serialize(req.query);

	request({ url, method: 'post', form: formData })
		.then((r) => {
			let body = r.data;

			if (config.livereload) {
				body = lrScript.getInjectHtml(r.data, config.livereloadPort);
			}

			setTimeout(function () {
				res.status(r.status);
				res.setHeader('Content-Type', 'text/html');
				res.write(body);
				res.end();
			}, req._fds.delay);
		})
		.catch(next);
};
