var should = require('should');
var path = require('path');
var Router = require('../libs/router');


describe('Router', function () {
	var router;

	beforeEach(function () {
		var f = path.resolve(__dirname, './data/route-file.js');
		router = new Router(f);
	});

	it('should have a prop to contain the route objects', function () {
		router.routes.should.be.a.Array();
		router.routes.length.should.equal(3);
	});

	it('should return the url path for given method and route', function () {
		router.search('/', 'get').file.should.equal('index.html');
		router.search('/test', 'get').file.should.equal('test.html');
		router.search('/test', 'post').file.should.equal('test_post.html');
	});
});
