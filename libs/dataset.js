var path = require('path');
var fs = require('fs');
var utils = require('./utils');

function DataSet(path) {
	this.path = path;
	this.exts = ['.js', '.json'];
}

DataSet.prototype.get = function (file, params) {
	var data = {};
	var dataExt = null;

	var ext = path.extname(file);
	var regexp = new RegExp('\\' + ext + '$');

	var dataFile = file.replace(regexp, '');
	dataFile = path.resolve(this.path, dataFile);

	this.exts.some(function (ext) {
		if (fs.existsSync(dataFile + ext)) {
			dataExt = ext;
			return true;
		}
	});

	if (dataExt) {
		dataFile += dataExt;
		delete require.cache[dataFile];
		data = require(dataFile);
	}

	if (utils.isFunc(data)) data = data(params, utils);

	return data;
};

module.exports = DataSet;
