var path = require('path');
var spawn = require('child_process').spawn;
var colors = require('colors');

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

	function onData(chunk) {
		if (chunk.toString().indexOf('ServerConnector@') >= 0) {
			console.log(('Embedded Java Server is listening on port ' + config.javaServerPort).cyan);
		}
	}

	instance.stdout.on('data', onData);
	instance.stderr.on('data', onData);
}

function close() {
	try {
		if (instance) {
			process.kill(instance.pid, 'SIGKILL');
			console.log('\nEmbedded Java Server is stopped.'.cyan);
		}
	} catch(e) {}
}

function restart(config) {
	close();
	setTimeout(function () {
		create(config);
	}, 30);
}

// catch ctrl+c
process.on('SIGINT', close);

module.exports = {
	create: create,
	close: close,
	restart: restart
};
