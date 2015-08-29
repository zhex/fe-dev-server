var path = require('path');
var request = require('request');
var Router = require('./router');
var DataSet = require('./dataset');
var utils = require('./utils');

var SYMBOL_MOCK = 'mock::';

module.exports = function (config) {
	var router = new Router(config.routeFile);

	return function (req, res) {
		var route = '/' + req.params.pattern;
		var match = router.search(route, req.method);
		var data;

		function getMatchData(file, isView) {
			var ds = new DataSet(isView ? config.viewFolder : config.mockFolder);
			var data = ds.get(match);

			if (utils.isFunc(data)) data = data(req.query, utils);
			return data;
		}

		if (match) {
			if (utils.contains(['.json', '.js'], path.extname(match))) {
				var isViewFolder = true;
				if (match.indexOf(SYMBOL_MOCK) >= 0) {
					match = match.replace(SYMBOL_MOCK, '');
					isViewFolder = false;
				}
				data = getMatchData(match, isViewFolder);

				if (req.query.callback) {
					res.setHeader('Access-Control-Allow-Origin', '*');
					res.jsonp(data);
				} else {
					res.json(data);
				}
			} else if (utils.contains(['.jsp'], path.extname(match))) {
				data = getMatchData(match);

				var formData = {
					template: match.slice(0, 1) === '/' ? match : '/' + match,
					data: JSON.stringify(data)
				};
				var url = 'http://localhost:' + config.javaServerPort + '/?' + utils.serialize(req.query);

				request.post(url, {form: formData}, function (err, response, body) {
					res.writeHead(response.statusCode, {'Content-Type': 'text/html'});
        			res.write(body);
        			res.end();
				});
			} else {
				data = getMatchData(match);
				res.render(match, data);
			}
		} else {
			res.status(404).send('404 Error');
		}
	};
};




