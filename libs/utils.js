var toString = Object.prototype.toString;

exports.isObject = function (obj) {
	return toString.call(obj) === '[object Object]';
};

exports.isArray = function (obj) {
	return toString.call(obj) === '[object Array]';
};

exports.isFunc = function (obj) {
	return toString.call(obj) === '[object Function]';
};

exports.contains = function (arr, item) {
	return arr.indexOf(item) >= 0;
};
