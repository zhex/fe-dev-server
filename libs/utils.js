var toString = Object.prototype.toString;

exports.isObject = function (obj) {
	return toString.call(obj) === '[object Object]';
};

exports.isArray = function (obj) {
	return toString.call(obj) === '[object Array]';
};
