var should = require('should');
var path = require('path');
var configHandler = require('../libs/config-handler');

describe('Config Handler', function () {
	var base, config;

	describe('file config', function () {
		before(function () {
			base = path.resolve(__dirname, '../');
			config = configHandler(path.resolve(__dirname, './data/fds-config.js'));
		});

		it ('should have extended base path', function () {
			config.basePath.should.equal('.');
		});

		it ('should have default viewFolder', function () {
			config.viewFolder.should.equal(base + '/views');
		});

		it ('should have default mockFolder', function () {
			config.mockFolder.should.equal(base + '/mocks');
		});

		it ('should have default publicFolder', function () {
			config.publicFolder.should.equal(base + '/public');
		});


		it ('should have default router file', function () {
			config.routeFile.should.equal(base + '/routes.js');
		});
	});

	describe('object config', function () {
		before(function () {
			config = configHandler({
				basePath: '.'
			});
		});

		it ('should have extended base path', function () {
			config.basePath.should.equal('.');
		});

		it ('should have default viewFolder', function () {
			config.viewFolder.should.equal(base + '/views');
		});

		it ('should have default mockFolder', function () {
			config.mockFolder.should.equal(base + '/mocks');
		});

		it ('should have default publicFolder', function () {
			config.publicFolder.should.equal(base + '/public');
		});


		it ('should have default router file', function () {
			config.routeFile.should.equal(base + '/routes.js');
		});
	});

});
