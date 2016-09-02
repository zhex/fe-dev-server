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

exports.serialize = function (obj, delimiter) {
	var arr = [];
	Object.keys(obj).forEach(function (key) {
		arr.push(key + '=' + obj[key]);
	});
	return arr.join(delimiter || '&');
};

exports.moment = require('moment');

exports.assign = require('object-assign');

exports.Mock = require('mockjs');
