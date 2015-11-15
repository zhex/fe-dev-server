module.exports = {
	basePath: __dirname,
	publicFolder: 'public',
	viewFolder: 'views',
	mockFolder: 'mocks',
	routeFile: 'routes.js',
	mockExts: ['.js', '.json'],
	proxy: null,
	port: 3000,
	enableJava: true,
	javaServerPort: 12321,
	livereload: true,
	open: {
		route: '/',
		browser: ['google chrome']
	}
};
