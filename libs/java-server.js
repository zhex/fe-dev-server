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
		var data = chunk.toString();
		if (data.indexOf('Exception') >= 0) {
			var match = data.match(/exception:?\s+([^\r\n]+)/i);
			console.log(('Embedded Java Server: ' + match[1]).red);
			instance.stderr.removeListener('data', onData);
			close();
		}
		else if (data.indexOf('ServerConnector@') >= 0) {
			console.log(('Embedded Java Server is listening on port ' + config.javaServerPort).cyan);
		}
	}

	instance.stderr.on('data', onData);
}

function close() {
	try {
		if (instance) {
			process.kill(instance.pid, 'SIGKILL');
			console.log('Embedded Java Server is stopped.'.cyan);
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
process.on('SIGINT', function () {
	console.log('\n');
	close();
});

module.exports = {
	create: create,
	close: close,
	restart: restart
};
