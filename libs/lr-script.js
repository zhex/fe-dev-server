exports.getInjectHtml = function (html, port) {
    var script = "<script>document.write('<script src=\"http://' + (location.host || 'localhost').split(':')[0] + ':" + port + "/livereload.js\"></' + 'script>')</script>";

	html = html.split('</body>');

    if (html.length === 1) {
		html = html[0] + script;
	} else {
		html = html.join(script + '</body>');
	}

	return html;
};
