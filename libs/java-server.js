var path = require('path');
var spawn = require('cross-spawn');
var colors = require('colors');
var EventEmitter = require('events');
var util = require('util');

function JavaServer() {
	this.instance = null;
	EventEmitter.call(this);
}

util.inherits(JavaServer, EventEmitter);

JavaServer.prototype.create = function (config) {
	var jarPath = path.resolve(__dirname, '../jetty/server.jar');
	var args = [
		'-Dviewpath=' + config.viewFolder,
		'-Dserver.port=' + config.javaServerPort,
		'-jar', jarPath
	];

	this.instance = spawn('java', args, {cwd: __dirname, detached: true});
	this.instance.unref();

	function onData(chunk) {
		var data = chunk.toString();
		if (data.indexOf('Exception') >= 0) {
			var match = data.match(/exception:?\s+([^\r\n]+)/i);
			console.log(('Embedded Java Server: ' + match[1]).red);
			// instance.stderr.removeListener('data', onData);
			// close();
		}
		else if (data.indexOf('ServerConnector@') >= 0) {
			console.log(('Embedded Java Server is listening on port ' + config.javaServerPort).cyan);
			this.emit('started');
		}
	}

	this.instance.stderr.on('data', onData.bind(this));
}

JavaServer.prototype.close = function () {
	try {
		if (this.instance) {
			process.kill(this.instance.pid, 'SIGKILL');
			console.log('Embedded Java Server is stopped.'.cyan);
		}
	} catch(e) {}
}

JavaServer.prototype.restart = function (config) {
	this.close();
	setTimeout(function () {
		this.create(config);
	}.bind(this), 30);
}

module.exports = JavaServer;
