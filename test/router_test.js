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
		router.routes.length.should.equal(4);
	});

	it('should return the url path for given method and route', function () {
		router.search('/', 'get').file.should.equal('index.html');
		router.search('/test', 'get').file.should.equal('test.html');
		router.search('/test', 'post').file.should.equal('test_post.html');
	});

	it('should contains the params data', function () {
		var match = router.search('/users/123/orders/222', 'get');
		Object.keys(match.params).length.should.equal(2);
		match.params.id.should.equal('123');
		match.params.oid.should.equal('222');
	});
});
