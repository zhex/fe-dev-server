var should = require('should');
var utils = require('../libs/utils');

describe('Utils', function () {
	it('isFunc', function () {
		utils.isFunc(function () {}).should.be.true;
		utils.isFunc('1').should.be.false;
	});

	it('isObject', function () {
		utils.isObject({}).should.be.true;
		utils.isObject('1').should.be.false;
	});

	it('isArray', function () {
		utils.isArray([]).should.be.true;
		utils.isArray('1').should.be.false;
	});

	it('contains', function () {
		utils.contains([2,1,4], 1).should.be.true;
		utils.contains([2, 4], 1).should.be.false;
	});

	it('serialize', function () {
		utils.serialize({a:1, b:2}).should.equal('a=1&b=2');
	});

	it('moment', function () {
		utils.moment.version.should.be.a.String();
	});

	it('assign', function () {
		utils.assign.should.be.a.Function();
	});
});
