var path = require('path');
var fs = require('fs');

function DataSet(path) {
	this.path = path;
}

DataSet.prototype.get = function (file) {
	var ext = path.extname(file);
	var regexp = new RegExp('\\' + ext + '$');
	var dataFile = file.replace(regexp, '.json');
	var file = path.resolve(this.path, dataFile);
	return fs.existsSync(file) ? require(file) : {};
};

module.exports = DataSet;
