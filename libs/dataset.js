var path = require('path');
var fs = require('fs');
var utils = require('./utils');

function DataSet(path) {
	this.path = path;
}

DataSet.prototype.get = function (file, params) {
	var ext = path.extname(file);
	var regexp = new RegExp('\\' + ext + '$');

	var dataFile = file.replace(regexp, '');
	var f = path.resolve(this.path, dataFile);

	var data = (fs.existsSync(f + '.js')
		|| fs.existsSync(f + '.json'))
		? require(f) : {};

	if (utils.isFunc(data)) data = data(params, utils);

	return data;
};

module.exports = DataSet;
