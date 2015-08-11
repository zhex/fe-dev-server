var path = require('path');

function DataSet(path) {
	this.path = path;
}

DataSet.prototype.get = function (file) {
	var ext = path.extname(file);
	var dataFile = file.replace(ext, '.json');
	return require(path.resolve(this.path, dataFile));
};

module.exports = DataSet;
