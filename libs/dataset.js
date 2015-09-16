var path = require('path');
var fs = require('fs');
var utils = require('./utils');

function DataSet(path) {
	this.path = path;
}

DataSet.prototype.get = function (file, params) {
	var data = {};
	var dataExt = null;

	var ext = path.extname(file);
	var regexp = new RegExp('\\' + ext + '$');

	var dataFile = file.replace(regexp, '');
	dataFile = path.resolve(this.path, dataFile);


	if (fs.existsSync(dataFile + '.js'))
		dataExt = '.js';
	else if (fs.existsSync(dataFile + '.json'))
		dataExt = '.json';

	if (dataExt) {
		dataFile += dataExt;
		delete require.cache[dataFile];
		data = require(dataFile);
	}

	if (utils.isFunc(data)) data = data(params, utils);

	return data;
};

module.exports = DataSet;
