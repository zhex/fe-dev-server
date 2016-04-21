var path = require('path');
var fs = require('fs');
var lrScript = require('../libs/lr-script');

module.exports = function (config) {
	return function (req, res, next) {
		var file = path.join(config.publicFolder, req.url);
		if (req.url.match(/\.html$/) && fs.existsSync(file)) {
			var html = fs.readFileSync(file).toString();
			html = lrScript.getInjectHtml(html, config.livereloadPort);
			res.setHeader('Content-Type', 'text/html');
			res.send(html);
		} else
			next();
	};
};

