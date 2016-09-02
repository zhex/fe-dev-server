module.exports = {
	basePath: __dirname,
	publicFolder: 'public',
	viewFolder: 'views',
	mockFolder: 'mocks',
	routeFile: 'routes.js',
	mockExts: ['.js', '.json'],
	port: 3000,
	enableJava: true,
	livereload: true,
	open: {
		route: '/',
		browser: ['google chrome']
	}
};
