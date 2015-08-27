var path = require('path');
var spawn = require('child_process').spawn;

module.exports = function (config) {
	var jarPath = path.resolve(__dirname, '../jetty/server.jar');
	var args = [
		'-Dviewpath=' + config.viewFolder,
		'-Dserver.port=' + config.javaServerPort,
		'-jar', jarPath
	];

	var jserver = spawn('java', args, {cwd: __dirname, detached: true});

	// jserver.stdout.on('data', function (data) {
	//   console.log('' + data);
	// });

	// jserver.stderr.on("data", function (data) {
 //    	console.log(data.toString());
	// });

	jserver.on('error', function(err) {
        try { process.kill(jserver.pid, 'SIGKILL'); } catch(e) {}
        console.error(err);
    });

    return jserver;
};
