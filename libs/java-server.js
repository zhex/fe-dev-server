var path = require('path');
var spawn = require('child_process').spawn;

var instance;

function create(config) {
	var jarPath = path.resolve(__dirname, '../jetty/server.jar');
	var args = [
		'-Dviewpath=' + config.viewFolder,
		'-Dserver.port=' + config.javaServerPort,
		'-jar', jarPath
	];

	instance = spawn('java', args, {cwd: __dirname, detached: true});
	instance.unref();
}

function close() {
	try {
		process.kill(instance.pid, 'SIGKILL');
		console.log('FE Server stopped ....');
	} catch(e) {}
}

function restart(config) {
	close();
	setTimeout(function () {
		create(config);
	}, 30);
}

module.exports = {
	create: create,
	close: close,
	restart: restart
};
