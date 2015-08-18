var path = require('path');
var fs = require('fs');
var utils = require('./utils');

function DataSet(path) {
	this.path = path;
}

DataSet.prototype.get = function (file) {
	var ext = path.extname(file);
	var regexp = new RegExp('\\' + ext + '$');

	var dataFile = file.replace(regexp, '');
	var f = path.resolve(this.path, dataFile);

	return (fs.existsSync(f + '.js')
		|| fs.existsSync(f + '.json'))
		? require(f) : {};
};

module.exports = DataSet;
